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

    const { id } = await params;

    // ADMIN puede ver cualquier disputa
    if (user.roles.includes("ADMIN")) {
      const dispute = await prisma.dispute.findUnique({
        where: {
          id,
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

      if (!dispute) {
        return NextResponse.json(
          { error: "Dispute not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(dispute);
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

    const dispute = await prisma.dispute.findFirst({
      where: {
        id,
        OR: filters,
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

    if (!dispute) {
      return NextResponse.json(
        { error: "Dispute not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(dispute);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}