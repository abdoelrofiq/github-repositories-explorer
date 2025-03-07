import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

interface PaginationProps {
  rowsPerPage: number;
  currentPage: number;
  totalRows: number;
  users: any;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  rowsPerPage,
  currentPage,
  totalRows,
  users,
  onPageChange,
}: PaginationProps) {
  const [pageItems, setPageItems] = useState<any[]>([]);
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  function getPaginationItems(currentPage: any, totalPages: any) {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages - 1, totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  }

  useEffect(() => {
    const pageRange = getPaginationItems(currentPage, totalPages);
    setPageItems(pageRange);
  }, [totalPages, currentPage]);

  const onPrevPage = () => {
    if (currentPage === 1) return;
    onPageChange(currentPage - 1);
  };

  const onNextPage = () => {
    if (currentPage === totalPages || totalPages === 0) return;
    onPageChange(currentPage + 1);
  };

  return (
    <div className="flex flex-col gap-2 items-center ">
      <div>
        <p className="text-sm text-gray-700">
          Showing{" "}
          <span className="font-medium">{users.length > 0 ? 1 : 0}</span> to{" "}
          <span className="font-medium">{users.length}</span> of{" "}
          <span className="font-medium">
            {totalRows.toLocaleString("en-US")}
          </span>{" "}
          results
        </p>
      </div>
      <div>
        <nav
          aria-label="Pagination"
          className="isolate inline-flex -space-x-px rounded-md shadow-xs"
        >
          <div
            onClick={() => onPrevPage()}
            className="cursor-pointer relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          >
            <span className="sr-only">Previous</span>
            <ChevronLeftIcon aria-hidden="true" className="size-5" />
          </div>

          {pageItems.map((item, index) => {
            if (item === currentPage) {
              return (
                <div
                  key={index}
                  onClick={() => onPageChange(item)}
                  aria-current="page"
                  className="cursor-pointer relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {item.toLocaleString("en-US")}
                </div>
              );
            }

            return (
              <div
                key={index}
                onClick={() => onPageChange(item)}
                className="cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                {item.toLocaleString("en-US")}
              </div>
            );
          })}

          <div
            onClick={() => onNextPage()}
            className="cursor-pointer relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          >
            <span className="sr-only">Next</span>
            <ChevronRightIcon aria-hidden="true" className="size-5" />
          </div>
        </nav>
      </div>
    </div>
  );
}
