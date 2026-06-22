import { usePaginationStore } from "@/store/paginationStore";
import React from "react";
const Pagination = () => {
  const { page, incrementPage, decrementPage } = usePaginationStore();
  return (
    <div className="join flex justify-center py-16">
      <button className="join-item btn btn-lg bg-blue-500 text-white hover:bg-white hover:text-blue-500 px-4 py-2 border" onClick={() => decrementPage()}>«</button>
      <button className="join-item btn btn-lg bg-blue-500 text-white px-4 py-2 border">Page {page}</button>
      <button className="join-item btn btn-lg bg-blue-500 text-white hover:bg-white hover:text-blue-500 px-4 py-2 border" onClick={() => incrementPage()}>»</button>
    </div>
  );
};
export default Pagination
