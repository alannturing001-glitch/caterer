import React from "react";
import { Link } from "wouter";
import Heading from "./Heading";
import { eventTypeMenuList } from "@/lib/utils";

const CategoryMenu = () => (
  <div className="py-10 bg-blue-600">
    <Heading title="BROWSE BY EVENT TYPE" />
    <div className="max-w-screen-2xl mx-auto py-10 gap-x-5 px-16 max-md:px-10 gap-y-5 grid grid-cols-5 max-lg:grid-cols-3 max-md:grid-cols-2 max-[450px]:grid-cols-1">
      {eventTypeMenuList.map((item) => (
        <Link key={item.id} href={item.href}
          className="flex flex-col items-center gap-y-2 bg-white/10 hover:bg-white/20 rounded-xl py-5 px-3 transition-colors cursor-pointer">
          <span className="text-4xl">{item.emoji}</span>
          <span className="text-white font-semibold text-sm text-center">{item.title}</span>
        </Link>
      ))}
    </div>
  </div>
);
export default CategoryMenu;
