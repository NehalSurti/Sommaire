"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";

export default function PricingCardButton({
  paymentLink,
  id,
}: {
  paymentLink: string;
  id: string;
}) {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleBuyNow = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    // Redirect to checkout
    router.push(paymentLink);
  };
  return (
    <Button
      onClick={handleBuyNow}
      className={cn(
        "w-full rounded-full flex items-center justify-center gap-2 bg-linear-to-r from-rose-800 to-rose-500 hover:from-rose-500 hover:to-rose-800 text-white border-2 py-2",
        id === "pro"
          ? "border-rose-900"
          : "border-rose-100 from-rose-400 to-rose-500"
      )}
    >
      Buy Now <ArrowRight size={18}></ArrowRight>
    </Button>
  );
}
