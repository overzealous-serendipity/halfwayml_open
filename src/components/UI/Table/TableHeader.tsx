import { RiArrowUpSLine } from "react-icons/ri";
import { RiArrowDownSLine } from "react-icons/ri";
import { RiSortAsc } from "react-icons/ri";
import { useState } from "react";   

type TableHeaderProps = {
    title: string;
    icon: React.ElementType;
    sortable?: boolean;
}

const TableHeader = ({ title, icon: Icon, sortable = true }: TableHeaderProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [sortDirection, setSortDirection] = useState(null);
  
    const toggleSort = () => {
      if (!sortDirection) setSortDirection("asc" as any);
      else if (sortDirection === "asc") setSortDirection("desc" as any);
      else setSortDirection(null);
    };

  
    return (
      <th
        className="px-3 py-2 border-b border-base-300/10 bg-base-200/50 first:rounded-tl-lg last:rounded-tr-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-2 group">
          <Icon className="w-4 h-4 text-base-content/50" />
          <span className="text-xs font-medium uppercase tracking-wide text-base-content/70">
            {title}
          </span>
          {sortable && (
            <button
              onClick={toggleSort}
              className={`ml-1 transition-opacity duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              {sortDirection === "asc" && (
                <RiArrowUpSLine className="w-4 h-4 text-primary" />
              )}
              {sortDirection === "desc" && (
                <RiArrowDownSLine className="w-4 h-4 text-primary" />
              )}
              {!sortDirection && (
                <RiSortAsc className="w-4 h-4 text-base-content/30" />
              )}
            </button>
          )}
        </div>
      </th>
    );
  };
  
export default TableHeader;