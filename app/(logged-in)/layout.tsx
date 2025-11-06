import UpgradeRequired from "@/components/common/upgrade-required";
import { getSubscriptionStatus } from "@/lib/user";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const hasActiveSubscription = await getSubscriptionStatus(user);

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
