import { auth } from "@clerk/nextjs/server";
import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit") || "5";

    const filters: any[] = [];

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

    // Build the where filter condition
    let whereCondition: any = undefined;
    if (!user.roles.includes("ADMIN")) {
      if (filters.length === 0) {
        return NextResponse.json(
          { error: "User has no valid roles" },
          { status: 403 }
        );
      }
      whereCondition = {
        OR: filters,
      };
    }

    // If page parameter is supplied, return paginated results
    if (pageParam) {
      const page = parseInt(pageParam) || 1;
      const limit = parseInt(limitParam) || 5;
      const skip = (page - 1) * limit;

      const total = await prisma.dispute.count({
        where: whereCondition,
      });

      const disputes = await prisma.dispute.findMany({
        where: whereCondition,
        include: {
          transaction: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      });

      return NextResponse.json({
        data: disputes,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    }

    // Default: return all disputes (backward compatible)
    const disputes = await prisma.dispute.findMany({
      where: whereCondition,
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