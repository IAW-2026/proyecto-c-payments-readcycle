import { auth } from "@clerk/nextjs/server";
import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkUserId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const body = await req.json();

    const { transactionId, reason } = body;

    if (!transactionId || !reason) {
      return NextResponse.json(
        { error: "Campos faltantes" },
        { status: 400 }
      );
    }

    // ADMIN no crea disputas
    if (user.roles.includes("ADMIN")) {
      return NextResponse.json(
        { error: "Admins no pueden crear disputas" },
        { status: 403 }
      );
    }

    const filters = [];

    if (user.roles.includes("BUYER")) {
      filters.push({
        buyerId: user.id,
      });
    }

    if (user.roles.includes("SELLER")) {
      filters.push({
        sellerId: user.id,
      });
    }

    if (filters.length === 0) {
      return NextResponse.json(
        { error: "Usuario sin permisos válidos" },
        { status: 403 }
      );
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        OR: filters,
      },
      include: {
        dispute: true,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transacción no encontrada" },
        { status: 404 }
      );
    }

    // Ya existe disputa
    if (transaction.dispute) {
      return NextResponse.json(
        { error: "Ya existe una disputa para esta transacción" },
        { status: 400 }
      );
    }

    const dispute = await prisma.dispute.create({
      data: {
        userId: user.id, // quien creó la disputa
        transactionId: transaction.id,
        reason,

        status: "OPEN",

        resolution: "Pendiente de revisión",
      },
      include: {
        transaction: {
          select: {
            orderId: true,
            amount: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json(dispute, {
      status: 201,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}