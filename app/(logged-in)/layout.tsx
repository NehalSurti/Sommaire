import UpgradeRequired from "@/components/common/upgrade-required";
import { getSubscriptionStatus } from "@/lib/user";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const hasActiveSubscription = await getSubscriptionStatus();

  if (!hasActiveSubscription.success || !hasActiveSubscription.data) {
    console.error(
      "Error fetching subscription status:",
      hasActiveSubscription.error
    );
  } else {
    if (hasActiveSubscription.data.status !== "active") {
      return <UpgradeRequired></UpgradeRequired>;
    }
  }
  return <>{children}</>;
}
