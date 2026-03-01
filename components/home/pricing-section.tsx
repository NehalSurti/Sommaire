import { cn } from "@/lib/utils";
import {
  containerVariants,
  itemVariants,
  listVariants,
  pricingPlans,
} from "@/utils/constants";
import { CheckIcon } from "lucide-react";
import { MotionDiv, MotionSection } from "../common/motion-wrapper";
import PricingCardButton from "@/components/common/pricingCard-button";

type PriceType = {
  name: string;
  price: number;
  description: string;
  items: string[];
  id: string;
  paymentLink: string;
  priceId: string;
};

const PricingCard = ({
  id,
  name,
  price,
  description,
  items,
  paymentLink,
  priceId,
}: PriceType) => {
  return (
    <MotionDiv
      variants={listVariants}
      whileHover={{ scale: 1.02 }}
      className="relative w-full max-w-lg hover:scale-105 hover:transition-all duration-300"
    >
      <div
        className={cn(
          "relative flex flex-col h-full gap-4 lg:gap-8 z-10 p-8 border-[1px] border-gray-500/20 rounded-2xl",
          id === "pro" && "border-rose-500 gap-5 border-2",
        )}
      >
        <div className="flex justify-between items-center gap-4">
          <div>
            <p className="text-lg lg:text-xl font-bold capitalize">{name}</p>
            <p className="text-base-content/80 mt-2">{description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <p className="text-5xl tracking-tight font-extrabold">${price}</p>
          <div className="flex flex-col justify-end mb-[4px]">
            <p className="text-xs uppercase font-semibold">USD</p>
            <p className="text-xs">/month</p>
          </div>
        </div>
        <ul className="space-y-2.5 leading-relaxed text-base flex-1 list-none p-0 m-0">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <CheckIcon
                className="w-4 h-4 text-rose-500"
                aria-hidden="true"
              ></CheckIcon>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-2 flex justify-center w-full">
          <PricingCardButton
            id={id}
            paymentLink={paymentLink}
          ></PricingCardButton>
        </div>
      </div>
    </MotionDiv>
  );
};

export default function PricingSection() {
  return (
    <MotionSection
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative overflow-hidden"
      id="pricing"
    >
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <MotionDiv
          variants={itemVariants}
          className="flex items-center justify-center w-full pb-12"
        >
          <h2 className="uppercase font-bold text-xl text-rose-500">Pricing</h2>
        </MotionDiv>
        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {pricingPlans.map((plan) => {
            return <PricingCard key={plan.id} {...plan} />;
          })}
        </div>
      </div>
    </MotionSection>
  );
}
