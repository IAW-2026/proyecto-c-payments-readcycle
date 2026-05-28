import { auth, currentUser, clerkClient } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import prisma from "@/prisma"
import { UserRole } from "@prisma/client"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/")
  }
  const clerkUser = await currentUser()

  if (!clerkUser) {
    redirect("/")
  }

  const existingUser =
    await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    })

  if (!existingUser) {
    const currentRoles =
      (clerkUser.publicMetadata
        ?.roles as string[]) || []

    let userRole: UserRole = UserRole.BUYER
    if (
      currentRoles.includes("ADMIN")
    ) {
      userRole = UserRole.ADMIN
    } else if (
      currentRoles.includes("SELLER")
    ) {
      userRole = UserRole.SELLER
    } else if (
      currentRoles.includes("BUYER")
    ) {
      userRole = UserRole.BUYER
    } else {
      const client = await clerkClient()
      await client.users.updateUser(
        userId,
        {
          publicMetadata: {
            ...clerkUser.publicMetadata,
            roles: ["BUYER"],
          },
        }
      )
    }

    await prisma.user.create({
      data: {
        clerkUserId: userId,

        name:
          clerkUser.firstName || "",

        surname:
          clerkUser.lastName || "",

        email:
          clerkUser.emailAddresses[0]
            ?.emailAddress || "",

        roles: [userRole],
      },
    })
  }
  return <>{children}</>
}