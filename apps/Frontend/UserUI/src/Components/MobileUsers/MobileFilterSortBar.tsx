import { Filter, SortAsc } from "lucide-react";

interface Props {
  onOpenFilter: () => void;
  onOpenSort: () => void;
}

export default function MobileFilterSortBar({ onOpenFilter, onOpenSort }: Props) {
  return (
    <div className="flex justify-around items-center py-2 border-t">
      <button onClick={onOpenSort} className="flex flex-col items-center">
        <SortAsc className="w-5 h-5" />
        <span className="text-xs">Sort</span>
      </button>
      <button onClick={onOpenFilter} className="flex flex-col items-center">
        <Filter className="w-5 h-5" />
        <span className="text-xs">Filter</span>
      </button>
    </div>
  );
}
