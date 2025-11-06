import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";
import { getSubscriptionStatus } from "@/lib/user";

export default async function PlanBadge() {
  const user = await currentUser();
  if (!user) return null;

  const hasActiveSubscription = await getSubscriptionStatus(user);

  console.log("Subscription Status:", hasActiveSubscription);

  if (!hasActiveSubscription.success || !hasActiveSubscription.data) {
    return (
      <Badge
        variant="outline"
        className={cn(
          "ml-2 bg-linear-to-r from-amber-100 to-amber-200  border-amber-300 hidden lg:flex items-center flex-row",
          "from-red-100 to-red-200 border-red-300"
        )}
      >
        <Crown
          className={cn("w-3 h-3 mr-1 text-amber-600", "text-red-600")}
        ></Crown>
        Buy a plan
      </Badge>
    );
  }

  const priceId = hasActiveSubscription.data.planId;
  const planName = hasActiveSubscription.data.planName || "No Plan";

  return (
    <Badge
      variant="outline"
      className={cn(
        "ml-2 bg-linear-to-r from-amber-100 to-amber-200  border-amber-300 hidden lg:flex items-center flex-row",
        !priceId && "from-red-100 to-red-200 border-red-300"
      )}
    >
      <Crown
        className={cn(
          "w-3 h-3 mr-1 text-amber-600",
          !priceId && "text-red-600"
        )}
      ></Crown>
      {planName}
    </Badge>
  );
}
