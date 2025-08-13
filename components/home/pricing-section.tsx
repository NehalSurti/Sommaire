const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 9,
    description: "Perfect for occasional use",
    items: [
      "5 PDF summaries per month",
      "Standard processing speed",
      "Email support",
    ],
    paymentLink: "",
    priceId: "",
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    description: "For professionals and teams",
    items: [
      "Unlimited PDF summaries",
      "Priority processing",
      "24/7 priority support",
      "Markdown Export",
    ],
    paymentLink: "",
    priceId: "",
  },
];

const PricingCard = () => {
  return <div>PricingCard</div>;
};

export default function PricingSection() {
  return (
    <section>
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <div>
          <h2>Pricing</h2>
        </div>
        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {plans.map((plan) => {
            return <PricingCard key={plan.id} {...plan} />;
          })}
        </div>
      </div>
    </section>
  );
}
