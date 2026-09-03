import { ChevronRight, ChevronRightSquareIcon, EllipsisVertical, Expand, Search } from "lucide-react";
import Link from "next/link";

export default function Sidebar({
    activeHistoryId,
    histories = [],
    searchQuery = "",
    onSearchChange,
    onHistoryClick,
    onNewSessionClick
}) {
    // Filter histories on the fly
    const filteredHistories = histories.filter((h) =>
        h.query.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-80 pt-18 md:pt-2 md:shadow-[inset_-0.1px_0_0_0_#000000] h-full z-30">
            <div className="p-3">
                <div>
                    <p className="text-gray-500 text-sm font-semibold">Account</p>
                    <div className="shadow-[inset_0_0_0_0.5px_#aaa] rounded-lg px-3 py-2 mt-2 text-sm text-gray-500 flex gap-2 justify-between items-center">
                        <span className="flex-1 overflow-hidden">testuser@gmail.com</span>
                        <EllipsisVertical size={15} />
                    </div>
                </div>
                <div className="mt-5">
                    <p className="text-gray-500 text-sm font-semibold">History</p>
                    <div className="mt-2 bg-white shadow-[inset_0_0_0_0.5px_#aaa] rounded-lg w-full px-3 py-2 text-sm flex items-center gap-2">
                        <Search size={15} className="stroke-gray-500" />
                        <input
                            className="flex-1 outline-none"
                            placeholder="Search by title/query"
                            value={searchQuery}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1 mt-3 text-gray-800 max-h-[calc(100vh-220px)] overflow-y-auto">
                        <HistoryItem
                            title="New Session"
                            active={activeHistoryId === null}
                            onClick={onNewSessionClick}
                        />
                        {filteredHistories.map((h) => (
                            <HistoryItem
                                key={h.id}
                                title={h.query}
                                active={activeHistoryId === h.id}
                                onClick={() => onHistoryClick?.(h.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const HistoryItem = ({ active, title, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`text-sm p-2 hover:bg-slate-200/50 rounded-sm cursor-pointer ${active && "bg-slate-200/50"
                }`}
        >
            <p>{title.length > 35 ? title.slice(0, 35) + "..." : title}</p>
        </div>
    )
}