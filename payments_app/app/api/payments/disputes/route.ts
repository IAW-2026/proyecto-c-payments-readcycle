import { auth } from "@clerk/nextjs/server";
import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
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

    if (user.roles.includes("ADMIN")) {
      const disputes = await prisma.dispute.findMany({
        include: {
          transaction: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json(disputes);
    }

    const filters = [];

    if (user.roles.includes("BUYER")) {
      filters.push({
        transaction: {
          buyerId: user.id,
        },
      });
    }

    if (user.roles.includes("SELLER")) {
      filters.push({
        transaction: {
          sellerId: user.id,
        },
      });
    }

    if (filters.length === 0) {
      return NextResponse.json(
        { error: "User has no valid roles" },
        { status: 403 }
      );
    }

    const disputes = await prisma.dispute.findMany({
      where: {
        OR: filters,
      },
      include: {
        transaction: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(disputes);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}