interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:hover:bg-white"
            >
                ← Prev
            </button>

            <div className="flex items-center gap-1">
                {start > 1 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className="w-10 h-10 rounded-lg font-medium text-sm transition-all bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                            1
                        </button>
                        {start > 2 && <span className="px-2 text-gray-400">...</span>}
                    </>
                )}

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                            page === currentPage
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {page}
                    </button>
                ))}

                {end < totalPages && (
                    <>
                        {end < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className="w-10 h-10 rounded-lg font-medium text-sm transition-all bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                            {totalPages}
                        </button>
                    </>
                )}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:hover:bg-white"
            >
                Next →
            </button>
        </div>
    );
}

export default Pagination;
