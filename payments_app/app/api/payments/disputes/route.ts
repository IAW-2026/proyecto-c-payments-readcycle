import { authenticateRequest } from "@/lib/auth";
import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const authResult = await authenticateRequest(request, {
      apiKeyEnvName: "DISPUTES_API_KEY",
      virtualUserRole: UserRole.ADMIN,
      allowedRoles: [UserRole.ADMIN, UserRole.BUYER, UserRole.SELLER],
    });

    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }

    const user = authResult.user!;

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