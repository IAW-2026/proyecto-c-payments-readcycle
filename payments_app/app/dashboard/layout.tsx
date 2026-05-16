import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import prisma from "@/prisma"

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

  const existingUser = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  })

  if (!existingUser) {
    await prisma.user.create({
      data: {

        clerkUserId: userId,

        name:
          clerkUser.firstName || "",

        mail:
          clerkUser.emailAddresses[0]
            ?.emailAddress || "",
      },
    })
  }
  return <>{children}</>;
}