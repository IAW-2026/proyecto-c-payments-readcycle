import { auth } from "@clerk/nextjs/server";
import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

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

    // ADMIN puede ver cualquier transacción
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