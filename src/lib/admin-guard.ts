import { NextResponse } from "next/server";
import { type AdminRole } from "@/lib/admin-access";
import { auth } from "@/lib/auth";
import { getAuthorizedUserByEmail } from "@/lib/db/users";

type GuardSuccess = {
  response: null;
  user: NonNullable<Awaited<ReturnType<typeof getAuthorizedUserByEmail>>>;
};

type GuardFailure = {
  response: NextResponse;
  user: null;
};

function errorResponse(status: number, error: string) {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status },
  );
}

export async function requireAdminAccess(
  allowedRoles: readonly AdminRole[],
): Promise<GuardSuccess | GuardFailure> {
  const session = await auth();
  const sessionEmail = session?.user?.email;

  if (!sessionEmail) {
    return {
      response: errorResponse(401, "Authentication required."),
      user: null,
    };
  }

  const user = await getAuthorizedUserByEmail(sessionEmail);

  if (!user) {
    return {
      response: errorResponse(401, "Authentication required."),
      user: null,
    };
  }

  if (!allowedRoles.includes(user.role)) {
    return {
      response: errorResponse(403, "You do not have permission for this action."),
      user: null,
    };
  }

  return {
    response: null,
    user,
  };
}
