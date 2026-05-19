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

    const {
      transactionId,
      reason,
    } = body;

    if (!transactionId || !reason) {
      return NextResponse.json(
        { error: "Campos faltantes" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId: user.id,
      },
      include: {
        disputes: true,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaccion no encontrada" },
        { status: 404 }
      );
    }

    if (transaction.disputes) {
      return NextResponse.json(
        { error: "Ya existe una disputa" },
        { status: 400 }
      );
    }

    const dispute = await prisma.dispute.create({
      data: {
        userId: user.id,
        transactionId: transaction.id,
        reason,
        status: "Abierta",
        resolution: "Pendiente de revisión",
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