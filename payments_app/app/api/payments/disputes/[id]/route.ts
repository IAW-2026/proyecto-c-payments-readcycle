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
      apiKeyEnvName: "DISPUTES_API_KEY",
      virtualUserRole: UserRole.ADMIN,
      allowedRoles: [UserRole.ADMIN, UserRole.BUYER, UserRole.SELLER],
    });

    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }

    const user = authResult.user!;

    const { id } = await params;

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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticateRequest(req, {
      apiKeyEnvName: "DISPUTES_API_KEY",
      virtualUserRole: UserRole.ADMIN,
      allowedRoles: [UserRole.ADMIN],
    });

    if (authResult.errorResponse) {
      return authResult.errorResponse;
    }

    const user = authResult.user!;

    const { id } = await params;
    const body = await req.json();
    const { status, resolution } = body;

    const updatedDispute = await prisma.dispute.update({
      where: { id },
      data: {
        ...(status && { status }),
        resolution,
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

    return NextResponse.json(updatedDispute);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}