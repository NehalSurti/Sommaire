"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import type { User } from "@/app/generated/prisma";

interface ActionResult<T> {
    success: boolean;
    data: T | null;
    created?: boolean; // true if user was created, false if found
    error?: string;
}

const GetOrCreateUserSchema = z.object({
    email: z.string().email(),
    fullName: z.string().optional(),
    customerId: z.string().optional(),
    priceId: z.string().optional(),
    status: z.enum(["active", "inactive"]).optional(),
});

/**
 * Finds an existing user by email or creates one if none exists.
 */
export async function getOrCreateUser(
    input: z.infer<typeof GetOrCreateUserSchema>
): Promise<ActionResult<User>> {
    try {
        // Validate input
        const data = GetOrCreateUserSchema.parse(input);

        // Try to find existing user
        let user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (user) {
            return {
                success: true,
                data: user,
                created: false,
            };
        }

        // If not found, create one
        user = await prisma.user.create({
            data: {
                email: data.email,
                fullName: data.fullName,
                customerId: data.customerId,
                priceId: data.priceId,
                status: data.status ?? "inactive",
            },
        });

        return {
            success: true,
            data: user,
            created: true,
        };
    } catch (error) {
        console.error("Error in getOrCreateUser:", error);

        if (error instanceof z.ZodError) {
            return {
                success: false,
                data: null,
                error: "Validation failed: " + error.errors.map(e => e.message).join(", "),
            };
        }

        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}


// Validation schema for updating user
const UpdateUserSchema = z.object({
    // identify user either by email or id (one of them must be provided)
    email: z.string().email().optional(),
    id: z.string(),

    // updatable fields
    fullName: z.string().optional(),
    customerId: z.string().optional(),
    priceId: z.string().optional(),
    status: z.enum(["active", "inactive"]),
});

/**
 * Updates an existing user by ID or email
 */
export async function updateUser(
    input: z.infer<typeof UpdateUserSchema>
): Promise<ActionResult<User>> {
    try {
        const data = UpdateUserSchema.parse(input);

        // Ensure we have at least one identifier
        if (!data.id) {
            throw new Error("Missing identifier: provide either user ID");
        }

        // Ensure the user exists,
        const existingUser = await prisma.user.findUnique({
            where: { customerId: data.id },
        });

        if (!existingUser) {
            throw new Error("User not found");
        }

        // Update user with only provided fields
        const updatedUser = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
                fullName: data.fullName ?? existingUser.fullName,
                customerId: data.customerId ?? existingUser.customerId,
                priceId: data.priceId ?? existingUser.priceId,
                status: data.status ?? existingUser.status,
            },
        });

        return {
            success: true,
            data: updatedUser,
        };
    } catch (error) {
        console.error("Error updating user:", error);

        if (error instanceof z.ZodError) {
            return {
                success: false,
                data: null,
                error: "Validation failed: " + error.errors.map(e => e.message).join(", "),
            };
        }

        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}


// Validation schema for email
const EmailSchema = z.string().email();

/**
 * Get user details based on email
 */
export async function getUserByEmail(email: string): Promise<ActionResult<User>> {
    try {
        // Validate email format
        EmailSchema.parse(email);

        // Fetch the user from the database
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                pdfSummaries: false,
                payments: false,
            },
        });

        if (!user) {
            return {
                success: false,
                data: null,
                error: "User not found",
            };
        }

        return {
            success: true,
            data: user,
        };
    } catch (error) {
        console.error("Error fetching user:", error);

        if (error instanceof z.ZodError) {
            return {
                success: false,
                data: null,
                error: "Invalid email format",
            };
        }

        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
