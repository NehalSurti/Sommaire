"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import type { Payment } from "@/app/generated/prisma";

interface ActionResult<T> {
    success: boolean;
    data: T | null;
    error?: string;
}

const CreatePaymentSchema = z.object({
    amount: z.number().int().positive(),
    status: z.enum(["completed", "pending", "failed"]),
    stripePaymentId: z.string().min(1),
    priceId: z.string().min(1),
    userEmail: z.string().email(),
});

//
// Create a new payment
//
export async function createPayment(
    input: z.infer<typeof CreatePaymentSchema>
): Promise<ActionResult<Payment>> {
    try {
        const data = CreatePaymentSchema.parse(input);

        const newPayment = await prisma.payment.create({
            data,
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