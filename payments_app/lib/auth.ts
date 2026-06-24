import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/prisma";
import { UserRole } from "@prisma/client";


export type AuthenticatedUser = {
  id: string;
  roles: UserRole[];
  name: string;
  email: string;
  isApiKey?: boolean;
};

export type AuthenticateOptions = {
  apiKeyEnvName: "CHECKOUT_API_KEY" | "TRANSACTIONS_API_KEY" | "DISPUTES_API_KEY";
  virtualUserRole: UserRole;
  allowedRoles?: UserRole[];
};

export async function authenticateRequest(
  req: Request,
  options: AuthenticateOptions
): Promise<{ user: AuthenticatedUser | null; errorResponse?: Response; status: number }> {
  // 1. Intentar autenticar mediante API Key
  const apiKey = req.headers.get("x-api-key") || req.headers.get("authorization")?.split(" ")[1];

  if (apiKey) {
    const configuredKey = process.env[options.apiKeyEnvName];

    if (configuredKey && apiKey === configuredKey) {
      const mockUser: AuthenticatedUser = {
        id: `${options.apiKeyEnvName.toLowerCase()}-virtual-user`,
        roles: [options.virtualUserRole],
        name: `${options.apiKeyEnvName} User`,
        email: `${options.apiKeyEnvName.toLowerCase()}@payments.readcycle`,
        isApiKey: true,
      };

      // Si se especifican allowedRoles y el rol asignado a la key no está permitido
      if (options.allowedRoles && !options.allowedRoles.includes(options.virtualUserRole)) {
        return {
          user: null,
          status: 403,
          errorResponse: new Response(
            JSON.stringify({ error: `Forbidden: API Key role '${options.virtualUserRole}' is not allowed for this route` }),
            { status: 403, headers: { "Content-Type": "application/json" } }
          ),
        };
      }

      return { user: mockUser, status: 200 };
    }

    // Si se envió una API key pero no coincide con la configurada para este servicio
    return {
      user: null,
      status: 401,
      errorResponse: new Response(
        JSON.stringify({ error: "Unauthorized: Invalid API Key for this service" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      ),
    };
  }

  // 2. Intentar autenticar mediante sesión de Clerk
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return {
        user: null,
        status: 401,
        errorResponse: new Response(
          JSON.stringify({ error: "Unauthorized: Missing authentication" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        ),
      };
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return {
        user: null,
        status: 404,
        errorResponse: new Response(
          JSON.stringify({ error: "User not found in database" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        ),
      };
    }

    // Verificar si el usuario autenticado tiene al menos uno de los roles permitidos
    if (options.allowedRoles && !user.roles.some((role) => options.allowedRoles?.includes(role))) {
      return {
        user: null,
        status: 403,
        errorResponse: new Response(
          JSON.stringify({ error: "Forbidden: Insufficient permissions" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        ),
      };
    }

    return { user, status: 200 };
  } catch (err) {
    console.error("Auth helper error:", err);
    return {
      user: null,
      status: 401,
      errorResponse: new Response(
        JSON.stringify({ error: "Unauthorized: Authentication error" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      ),
    };
  }
}

export async function resolveOrCreateUser(idOrClerkId: string): Promise<string> {
  if (!idOrClerkId) return idOrClerkId;

  // 1. Try finding by database CUID (User.id)
  let user = await prisma.user.findUnique({
    where: { id: idOrClerkId },
  });

  if (user) {
    return user.id;
  }

  // 2. Try finding by Clerk User ID (User.clerkUserId)
  user = await prisma.user.findUnique({
    where: { clerkUserId: idOrClerkId },
  });

  if (user) {
    return user.id;
  }

  let resolvedClerkId = idOrClerkId;

  // 3. If it does not start with "user_", it might be the seller's internal database ID.
  // We query the seller's API (using SELLER_ID_WEBHOOK) to translate it to their Clerk ID.
  if (!idOrClerkId.startsWith("user_")) {
    let sellerBaseUrl = process.env.SELLER_ID_WEBHOOK;
    if (!sellerBaseUrl && process.env.SELLER_WEBHOOK) {
      try {
        sellerBaseUrl = new URL(process.env.SELLER_WEBHOOK).origin;
      } catch (e) {
        console.error("Invalid SELLER_WEBHOOK URL format", e);
      }
    }
    const sellerApiKey = process.env.SELLER_API_KEY;
    if (sellerBaseUrl && sellerApiKey) {
      try {
        const baseUrl = sellerBaseUrl.endsWith("/") ? sellerBaseUrl.slice(0, -1) : sellerBaseUrl;
        const sellerUserUrl = `${baseUrl}/api/public/user/id=${idOrClerkId}`;
        console.log(`Fetching Clerk ID from seller API: ${sellerUserUrl}`);

        const response = await fetch(sellerUserUrl, {
          method: "GET",
          headers: {
            "X-API-Key": sellerApiKey,
          },
        });

        if (response.ok) {
          const sellerUserData = await response.json();
          console.log("Seller API user response:", sellerUserData);
          const clerkId = sellerUserData.clerkUserId || sellerUserData.clerkId || sellerUserData.clerk_user_id;
          if (clerkId) {
            resolvedClerkId = clerkId;
            console.log(`Resolved seller local ID ${idOrClerkId} to Clerk ID ${clerkId}`);

            // Check if this resolved Clerk ID already exists in our database
            user = await prisma.user.findUnique({
              where: { clerkUserId: resolvedClerkId },
            });
            if (user) {
              return user.id;
            }
          }
        } else {
          console.error(`Seller API returned status ${response.status} when fetching user ${idOrClerkId}`);
        }
      } catch (fetchError) {
        console.error(`Error calling seller API for user ${idOrClerkId}:`, fetchError);
      }
    }
  }

  // 4. Fetch from Clerk and create database record if it's a Clerk User ID
  if (resolvedClerkId.startsWith("user_")) {
    try {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(resolvedClerkId);
      if (clerkUser) {
        const currentRoles = (clerkUser.publicMetadata?.roles as string[]) || [];
        let userRole: UserRole = UserRole.BUYER;
        if (currentRoles.includes("ADMIN")) {
          userRole = UserRole.ADMIN;
        } else if (currentRoles.includes("SELLER")) {
          userRole = UserRole.SELLER;
        }

        const newUser = await prisma.user.create({
          data: {
            clerkUserId: resolvedClerkId,
            name: clerkUser.firstName || "",
            surname: clerkUser.lastName || "",
            email: clerkUser.emailAddresses[0]?.emailAddress || "",
            roles: [userRole],
          },
        });
        return newUser.id;
      }
    } catch (clerkError) {
      console.error(`Failed to fetch/create user ${resolvedClerkId} from Clerk:`, clerkError);
    }
  }

  return resolvedClerkId;
}

