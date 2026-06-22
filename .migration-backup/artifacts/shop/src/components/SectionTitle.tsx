import React from "react";
const SectionTitle = ({ title, path }: { title: string; path: string }) => (
  <div className="h-[200px] bg-green-900 flex flex-col items-center justify-center max-sm:h-[160px]">
    <h1 className="text-5xl font-bold text-white text-center max-sm:text-3xl">{title}</h1>
    <p className="text-green-300 text-sm mt-3 text-center">{path}</p>
  </div>
);
export default SectionTitle;
