import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const eventTypeMenuList = [
  { id: 1, title: "Weddings", emoji: "💍", href: "/packages/weddings" },
  { id: 2, title: "Corporate Events", emoji: "🏢", href: "/packages/corporate" },
  { id: 3, title: "Birthday Parties", emoji: "🎂", href: "/packages/birthdays" },
  { id: 4, title: "Outdoor BBQ", emoji: "🍖", href: "/packages/bbq" },
  { id: 5, title: "Cocktail Receptions", emoji: "🥂", href: "/packages/cocktail" },
  { id: 6, title: "Baby Showers", emoji: "🍼", href: "/packages/baby-showers" },
  { id: 7, title: "Gala Dinners", emoji: "🍽️", href: "/packages/gala" },
  { id: 8, title: "Graduation", emoji: "🎓", href: "/packages/graduation" },
  { id: 9, title: "Religious Events", emoji: "🕊️", href: "/packages/religious" },
  { id: 10, title: "Team Building", emoji: "🤝", href: "/packages/team-building" },
];

export const incentives = [
  { name: "Dedicated Event Planner", description: "A personal planner guides you from quotation to the last dish served.", imageSrc: "/support icon.png" },
  { name: "Transparent Pricing", description: "No hidden fees. All costs calculated live before you submit a request.", imageSrc: "/shipping icon.png" },
  { name: "Verified Caterers", description: "Every caterer on our platform is vetted, licensed, and reviewed.", imageSrc: "/fast shopping icon.png" },
];

export const navigation = {
  packages: [{ name: "Browse All Packages", href: "/packages" }, { name: "Wedding Packages", href: "/packages/weddings" }, { name: "Corporate Packages", href: "/packages/corporate" }],
  about: [{ name: "About Us", href: "#" }, { name: "Work With Us", href: "#" }, { name: "Become a Caterer", href: "#" }],
  customers: [{ name: "How It Works", href: "#" }, { name: "Request a Quote", href: "/packages" }, { name: "Track My Quotation", href: "/my-quotations" }],
  help: [{ name: "Contact", href: "#" }, { name: "FAQ", href: "#" }, { name: "Privacy Policy", href: "#" }],
};

export const isValidEmailAddressFormat = (input: string) => /^\S+@\S+\.\S+$/.test(input);
export const isValidCardNumber = (input: string) => {
  const c = input.replace(/[^0-9]/g, "");
  if (!/^\d{13,19}$/.test(c)) return false;
  let sum = 0, isEven = false;
  for (let i = c.length - 1; i >= 0; i--) {
    let d = parseInt(c[i], 10);
    if (isEven) { d *= 2; if (d > 9) d -= 9; }
    sum += d; isEven = !isEven;
  }
  return sum % 10 === 0;
};
export const isValidCreditCardExpirationDate = (input: string) => /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/.test(input);
export const isValidCreditCardCVVOrCVC = (input: string) => /^[0-9]{3,4}$/.test(input);
