import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  onItemsPerPageChange,
  className = "",
}) => {
  const itemsPerPageOptions = [10, 20, 50, 100];

  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbersAlternative = () => {
    const pages = [];
    const visiblePages = 5;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    let start = Math.max(2, currentPage - Math.floor(visiblePages / 2));
    let end = Math.min(totalPages - 1, start + visiblePages - 1);

    if (end === totalPages - 1) {
      start = Math.max(2, end - visiblePages + 1);
    }

    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  if (totalItems === 0) return null;

  const pages = getPageNumbersAlternative();

  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-3 bg-cardbg rounded-lg border border-gray-300/50 ${className}`}
    >
      {/* Left */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-3 sm:gap-6 mb-3 sm:mb-0">
        {" "}
        <div className="flex items-center gap-2">
          <span className="max-[370px]:hidden text-xs sm:text-sm text-gray-700 font-medium">
            Per page:
          </span>

          <div className="flex items-center bg-white/80 rounded-lg border border-gray-300 p-1">
            {itemsPerPageOptions.map((option) => (
              <button
                key={option}
                onClick={() => onItemsPerPageChange(option)}
                className={`px-3 py-1.5 rounded text-xs sm:text-sm transition-all duration-200 font-medium ${
                  itemsPerPage === option
                    ? "bg-[#003388] text-white shadow-lg"
                    : " hover:text-white hover:bg-[#003388]/70"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="max-[426px]:hidden text-xs sm:text-sm text-gray-700">
          <span className="font-semibold text-gray-900">
            {startItem}-{endItem}
          </span>{" "}
          of <span className="font-semibold text-gray-900">{totalItems}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
        <div className="text-xs sm:text-sm text-gray-700 order-2 sm:order-1">
          Page{" "}
          <span className="font-bold text-gray-900 mx-1">{currentPage}</span> of{" "}
          <span className="font-bold text-gray-900 mx-1">{totalPages}</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#003388]/10 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1">
            {pages.map((page, idx) => (
              <React.Fragment key={idx}>
                {page === "..." ? (
                  <span className="px-2 text-gray-400 text-sm">⋯</span>
                ) : (
                  <button
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 rounded-full text-sm font-bold transition-all ${
                      currentPage === page
                        ? "bg-[#003388] text-white scale-110"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-[#003388]/70 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-buttonbg/10 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
