"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";

export default function Table({ data = [], maxHeight = "500px" }) {
  const [sortConfig, setSortConfig] = useState(null);

  const headers = data[0] || [];
  const rows = data.slice(1);

  const sortedRows = useMemo(() => {
    if (!sortConfig) return rows;

    return [...rows].sort((a, b) => {
      const aValue = a[sortConfig.index];
      const bValue = b[sortConfig.index];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      return String(aValue).localeCompare(String(bValue), undefined, {
        numeric: true,
        sensitivity: "base",
      }) * (sortConfig.direction === "asc" ? 1 : -1);
    });
  }, [rows, sortConfig]);

  const handleSort = (index) => {
    setSortConfig((current) => {
      if (!current || current.index !== index) {
        return { index, direction: "asc" };
      }

      if (current.direction === "asc") {
        return { index, direction: "desc" };
      }

      return null;
    });
  };

  if (!data?.length) {
    return (
      <div className="rounded-xl bg-[#E9E8E1] px-5 py-8 text-center text-sm text-[#686861] shadow-[inset_0_0_0_0.5px_#aaa]">
        No data available
      </div>
    );
  }

  return (
    <div
      className="w-full overflow-auto rounded-md bg-white shadow-[inset_0_0_0_0.5px_#aaa]"
      style={{ maxHeight }}
    >
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-[#E9E8E1]">
          <tr>
            {headers.map((header, index) => {
              const isSorted = sortConfig?.index === index;

              return (
                <th
                  key={index}
                  onClick={() => handleSort(index)}
                  className="
                    group
                    min-w-30
                    whitespace-nowrap
                    border-b border-[#d4d3cc]
                    px-4 py-3
                    text-left
                    font-medium
                    text-[#44443f]
                    cursor-pointer
                    select-none
                    transition
                    hover:bg-[#dfded7]
                  "
                >
                  <div className="flex items-center gap-2">
                    <span>{formatHeader(header)}</span>

                    <span
                      className={`
                        transition-opacity
                        ${isSorted ? "opacity-100" : "opacity-0 group-hover:opacity-50"}
                      `}
                    >
                      {sortConfig?.direction === "desc" ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronUp size={14} />
                      )}
                    </span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {sortedRows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="
                border-b border-[#eeeeea]
                last:border-b-0
                transition
                hover:bg-[#f7f7f3]
              "
            >
              {headers.map((_, columnIndex) => (
                <td
                  key={columnIndex}
                  className="
                    max-w-100
                    px-4 py-3
                    align-top
                    text-[#686861]
                  "
                >
                  <Cell value={row?.[columnIndex]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ value }) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-[#aaa9a1]">—</span>;
  }

  if (typeof value === "boolean") {
    return (
      <span
        className={`
          inline-flex
          rounded-full
          px-2 py-0.5
          text-xs
          font-medium
          ${
            value
              ? "bg-[#e5eadc] text-[#526044]"
              : "bg-[#eeeeeb] text-[#85857e]"
          }
        `}
      >
        {value ? "Yes" : "No"}
      </span>
    );
  }

  return (
    <span className="wrap-break-word">
      {String(value)}
    </span>
  );
}

function formatHeader(header) {
  return String(header)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}