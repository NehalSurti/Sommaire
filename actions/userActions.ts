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
