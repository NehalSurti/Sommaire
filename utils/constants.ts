import { isDevelopment } from "./env-helper";
import { Variants } from "framer-motion";

export const pricingPlans = [
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
        paymentLink:
            isDevelopment
                ? process.env.STRIPE_BASIC_PAYMENTLINK_DEV!
                : "",
        priceId:
            isDevelopment
                ? process.env.STRIPE_BASIC_PRICEID_DEV!
                : "",
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
        paymentLink:
            isDevelopment
                ? process.env.STRIPE_PRO_PAYMENTLINK_DEV!
                : "",
        priceId:
            isDevelopment
                ? process.env.STRIPE_PRO_PRICEID_DEV!
                : "",
    },
];

export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1
        }
    },
};

export const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 50,
            damping: 15,
            duration: 0.8
        },
    }
};

export const listVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 50,
            damping: 15,
            duration: 0.8
        }
    },
}

export const DEMO_SUMMARY = `# ⚡ The Global Electric Vehicle Boom in 2025  
• 📝 Electric vehicles are revolutionizing transportation, making 2025 a milestone year for clean mobility.  
• 💡 With record-breaking sales and rapid tech advances, EVs are now mainstream worldwide.  

# Document Details  
• 📄 Type: Industry Report / Market Analysis  
• 🎯 For: Business leaders, policymakers, and sustainability enthusiasts  

# Key Highlights  
• 🔑 EV sales projected to exceed 20 million units globally in 2025  
• 🚀 Automakers and governments driving massive investment in green mobility  
• ⭐ Battery tech breakthroughs making EVs more affordable and efficient  

# Why It Matters  
• 🌍 The electric vehicle surge is reshaping industries, reducing carbon emissions, and accelerating the transition toward sustainable energy systems.  

# Main Points  
• 📌 EVs now account for a significant share of new car sales globally  
• 💪 Advancements in battery tech and recycling address cost and environmental issues  
• 🎯 By 2030, EVs could represent over 60% of all new car sales worldwide  

# Pro Tips  
• ★ Invest in EV-related infrastructure and renewable energy integration  
• ⚡ Keep an eye on solid-state battery innovations  
• 🛠️ Support policies that promote ethical mineral sourcing and recycling  

# Key Terms to Know  
• 📚 Solid-State Battery: Next-gen battery with higher energy density and faster charging  
• 🧩 Lithium: A crucial mineral used in current EV battery production  

# Bottom Line  
• 🏁 Electric vehicles aren’t just the future — they’re the driving force of today’s sustainable transformation.  
`;

