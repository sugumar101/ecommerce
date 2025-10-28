"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./config";
import { signUpSchema, signInSchema } from "./validation";
import { db } from "@/lib/db";
import { guest } from "@/lib/db/schema/guest";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

type ActionResult<T = void> = {
  success: boolean;
  error?: string;
  data?: T;
};

/**
 * Sign up a new user
 */
export async function signUp(
  email: string,
  password: string,
  name: string
): Promise<ActionResult<{ userId: string }>> {
  try {
    const validatedData = signUpSchema.parse({ email, password, name });

    const result = await auth.api.signUpEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
      },
    });

    if (!result) {
      return {
        success: false,
        error: "Failed to create account. Please try again.",
      };
    }

    await mergeGuestCartWithUserCart(result.user.id);

    return {
      success: true,
      data: { userId: result.user.id },
    };
  } catch (error) {
    console.error("Sign up error:", error);
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "An unexpected error occurred during sign up.",
    };
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(
  email: string,
  password: string
): Promise<ActionResult<{ userId: string }>> {
  try {
    const validatedData = signInSchema.parse({ email, password });

    const result = await auth.api.signInEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
      },
    });

    if (!result) {
      return {
        success: false,
        error: "Invalid email or password.",
      };
    }

    await mergeGuestCartWithUserCart(result.user.id);

    return {
      success: true,
      data: { userId: result.user.id },
    };
  } catch (error) {
    console.error("Sign in error:", error);
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "An unexpected error occurred during sign in.",
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<ActionResult> {
  try {
    await auth.api.signOut();
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return {
      success: false,
      error: "Failed to sign out. Please try again.",
    };
  }
}

/**
 * Get the current session
 */
export async function getSession() {
  try {
    const session = await auth.api.getSession({
      headers: await cookies(),
    });
    return session;
  } catch (error) {
    console.error("Get session error:", error);
    return null;
  }
}

/**
 * Create a guest session
 */
export async function createGuestSession(): Promise<
  ActionResult<{ sessionToken: string }>
> {
  try {
    const sessionToken = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await db.insert(guest).values({
      sessionToken,
      expiresAt,
    });

    const cookieStore = await cookies();
    cookieStore.set("guest_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return {
      success: true,
      data: { sessionToken },
    };
  } catch (error) {
    console.error("Create guest session error:", error);
    return {
      success: false,
      error: "Failed to create guest session.",
    };
  }
}

/**
 * Get the current guest session
 */
export async function getGuestSession(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("guest_session")?.value;

    if (!sessionToken) {
      return null;
    }

    const guestSession = await db.query.guest.findFirst({
      where: eq(guest.sessionToken, sessionToken),
    });

    if (!guestSession) {
      return null;
    }

    if (new Date() > guestSession.expiresAt) {
      await db.delete(guest).where(eq(guest.sessionToken, sessionToken));
      const cookieStore = await cookies();
      cookieStore.delete("guest_session");
      return null;
    }

    return sessionToken;
  } catch (error) {
    console.error("Get guest session error:", error);
    return null;
  }
}

/**
 * Merge guest cart with user cart after login/signup
 */
export async function mergeGuestCartWithUserCart(
  userId: string
): Promise<ActionResult> {
  try {
    const { mergeGuestCartToUserCart } = await import('@/lib/actions/cart');
    const result = await mergeGuestCartToUserCart(userId);

    if (!result.success) {
      return result;
    }

    const cookieStore = await cookies();
    cookieStore.delete("guest_session");

    return { success: true };
  } catch (error) {
    console.error("Merge guest cart error:", error);
    return {
      success: false,
      error: "Failed to merge guest cart.",
    };
  }
}

/**
 * Require authentication - redirect to sign-in if not authenticated
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }
  return session;
}
