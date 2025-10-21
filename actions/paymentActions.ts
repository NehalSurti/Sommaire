"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import type { Payment } from "@/app/generated/prisma";
import Stripe from "stripe";

interface ActionResult<T> {
    success: boolean;
    data: T | null;
    error?: string;
}

const CreatePaymentSchema = z.object({
    userId: z.string().min(1),
    amount: z.number().int().positive(),
    status: z.enum(["open", "complete", "expired"]),
    stripePaymentId: z.string().min(1),
    priceId: z.string().min(1),
    userEmail: z.string().email(),
});

// Map Stripe statuses to Prisma enum values
function mapStripeStatusToPrisma(
    status: Stripe.Checkout.Session.Status
): "pending" | "completed" | "failed" {
    switch (status) {
        case "open":
            return "pending";
        case "complete":
            return "completed";
        case "expired":
            return "failed";
    }
}

/**
 * Create a new payment
 */
export async function createPayment(
    input: z.infer<typeof CreatePaymentSchema>
): Promise<ActionResult<Payment>> {
    try {
        const data = CreatePaymentSchema.parse(input);

        const prismaStatus = mapStripeStatusToPrisma(input.status);

        const newPayment = await prisma.payment.create({
            data: { ...data, status: prismaStatus, }
        });

        return { success: true, data: newPayment };
    } catch (error) {
        console.error("Error creating payment:", error);

        if (error instanceof z.ZodError) {
            return {
                success: false,
                data: null,
                error: "Validation failed: " + error.errors.map((e) => e.message).join(", "),
            };
        }

        if (error instanceof Error && error.message.includes("Unique constraint failed")) {
            return {
                success: false,
                data: null,
                error: "Payment with this stripePaymentId already exists.",
            };
        }

        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}