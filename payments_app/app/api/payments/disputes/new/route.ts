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
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    const { transactionId, reason } = body;

    if (!transactionId || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (user.roles.includes("ADMIN")) {
      return NextResponse.json(
        { error: "Admins cannot create disputes" },
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
        { error: "User has no valid roles" },
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
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    if (transaction.dispute) {
      return NextResponse.json(
        { error: "A dispute already exists for this transaction" },
        { status: 400 }
      );
    }

    const dispute = await prisma.dispute.create({
      data: {
        userId: user.id,
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