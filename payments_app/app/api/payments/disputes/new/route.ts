import { authenticateRequest } from "@/lib/auth";
import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const authResult = await authenticateRequest(req, {
      apiKeyEnvName: "DISPUTES_API_KEY",
      virtualUserRole: UserRole.ADMIN,
      allowedRoles: [UserRole.ADMIN, UserRole.BUYER, UserRole.SELLER],
    });

    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }

    const user = authResult.user!;

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