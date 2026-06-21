import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const categoryMenuList = [
  { id: 1, title: "Smart Phones", src: "/smart phone icon.png", href: "/shop/smart-phones" },
  { id: 2, title: "Tablets", src: "/tablet icon.png", href: "/shop/tablets" },
  { id: 3, title: "Mouses", src: "/mouse icon.png", href: "/shop/mouses" },
  { id: 4, title: "Cameras", src: "/camera icon.png", href: "/shop/cameras" },
  { id: 5, title: "Smart Watches", src: "/smart watch.png", href: "/shop/watches" },
  { id: 6, title: "Laptops", src: "/laptop icon.png", href: "/shop/laptops" },
  { id: 7, title: "PCs", src: "/pc icon.png", href: "/shop/computers" },
  { id: 8, title: "Printers", src: "/printers icon.png", href: "/shop/printers" },
  { id: 9, title: "Earbuds", src: "/ear buds icon.png", href: "/shop/earbuds" },
  { id: 10, title: "Head Phones", src: "/headphone icon.png", href: "/shop/headphones" },
];

export const incentives = [
  { name: "Free Shipping", description: "Our shipping is completely free.", imageSrc: "/shipping icon.png" },
  { name: "24/7 Customer Support", description: "Our support is working all day and night.", imageSrc: "/support icon.png" },
  { name: "Fast Shopping Cart", description: "Super fast shopping experience.", imageSrc: "/fast shopping icon.png" },
];

export const navigation = {
  sale: [{ name: "Discounts", href: "#" }, { name: "News", href: "#" }, { name: "Register Discounts", href: "#" }],
  about: [{ name: "About Singitronic", href: "#" }, { name: "Work With Us", href: "#" }, { name: "Company Profile", href: "#" }],
  buy: [{ name: "Singitronic Loyalty Card", href: "#" }, { name: "Terms Of Use", href: "#" }, { name: "Privacy Policy", href: "#" }],
  help: [{ name: "Contact", href: "#" }, { name: "How to Buy at Singitronic", href: "#" }, { name: "FAQ", href: "#" }],
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

