import { authenticateRequest } from "@/lib/auth";
import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticateRequest(req, {
      apiKeyEnvName: "TRANSACTIONS_API_KEY",
      virtualUserRole: UserRole.ADMIN,
      allowedRoles: [UserRole.ADMIN, UserRole.BUYER, UserRole.SELLER],
    });

    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }

    const user = authResult.user!;
    const { id } = await params;

    if (user.roles.includes("ADMIN")) {
      const transaction = await prisma.transaction.findUnique({
        where: {
          id,
        },
      });

      if (!transaction) {
        return NextResponse.json(
          { error: "Transaction not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(transaction);
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
        id,
        OR: filters,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(transaction);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticateRequest(req, {
      apiKeyEnvName: "TRANSACTIONS_API_KEY",
      virtualUserRole: UserRole.ADMIN,
      allowedRoles: [UserRole.ADMIN],
    });

    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }

    const user = authResult.user!;

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const validStatuses = ["PENDING", "APPROVED", "REJECTED", "REFUNDED", "CANCELLED"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...(status && { status }),
      },
    });

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}