import { getUserPdfSummaryCount } from "@/actions/pdfSummaryActions";
import { getUserByEmail } from "@/actions/userActions";
import { pricingPlans } from "@/utils/constants";
import { currentUser } from "@clerk/nextjs/server";
import type { $Enums } from "@/app/generated/prisma";
import type { User } from "@/app/generated/prisma";

interface UploadLimitData {
    hasReachedUploadLimit: boolean;
    uploadLimit: number;
}

interface UploadLimitResult {
    success: boolean;
    data: UploadLimitData | null;
    error?: string;
}


/**
 * Determines if the user has reached their upload limit based on their plan.
 * @param userId - The user's unique identifier.
 * @returns An object containing the upload limit status and metadata.
 */

export const hasReachedUploadLimit = async (DbUser: User): Promise<UploadLimitResult> => {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) {
            throw new Error("User not authenticated");
        }

        const uploadCount = await getUserPdfSummaryCount(DbUser.id);
        if (!uploadCount.success || uploadCount.data === null) {
            throw new Error("Could not retrieve upload count");
        }

        const { priceId } = DbUser;
        const plan = pricingPlans.find((p) => p.priceId === priceId);

        const uploadLimit = plan?.id === "pro" ? 1000 : 5;
        const hasReachedUploadLimit = uploadCount.data >= uploadLimit;

        return {
            success: true,
            data: { hasReachedUploadLimit, uploadLimit }
        };
    }
    catch (error) {
        console.error("Error in hasReachedUploadLimit:", error);

        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}


interface SubscriptionStatusData {
    status: $Enums.UserStatus;
    planId: string | null;
    planName: string | null;
    isPro: boolean;
}

interface SubscriptionStatusResult {
    success: boolean;
    data: SubscriptionStatusData | null;
    error?: string;
}

/**
 * Retrieves the current user's subscription status and plan details.
 * @returns An object containing the user's subscription information.
 */
export const getSubscriptionStatus = async (): Promise<SubscriptionStatusResult> => {
    try {
        const user = await currentUser();
        if (!user) {
            throw new Error("User not authenticated");
        }

        const email = user.emailAddresses?.[0]?.emailAddress;
        if (!email) {
            throw new Error("User email not found");
        }

        const { success, data } = await getUserByEmail(email);

        if (!success || !data) {
            throw new Error("Could not retrieve user subscription data");
        }

        const { status, priceId } = data;

        const plan = pricingPlans.find((p) => p.priceId === priceId);
        const isPro = plan?.id === "pro" ? true : false;

        const result: SubscriptionStatusData = {
            status,
            planId: plan?.id ?? null,
            planName: plan?.name ?? null,
            isPro,
        };

        return { success: true, data: result };
    } catch (error) {
        console.error("Error in getSubscriptionStatus:", error);

        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
};

