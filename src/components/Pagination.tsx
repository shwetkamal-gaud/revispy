type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const getPages = () => {
        const pages = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, "...", totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="flex justify-center dark:text-white/80 items-center space-x-2 mt-4 text-gray-600">
            <button
                className="hover:text-black dark:hover:text-white"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
            >
                &laquo;
            </button>
            <button
                className="hover:text-black dark:hover:text-white"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &lt;
            </button>

            {getPages().map((page, idx) => (
                <button
                    key={idx}
                    onClick={() => typeof page === "number" && onPageChange(page)}
                    className={`px-2 ${page === currentPage ? "text-black dark:text-white font-bold" : ""}`}
                    disabled={page === "..."}
                >
                    {page}
                </button>
            ))}

            <button
                className="hover:text-black dark:hover:text-white"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                &gt;
            </button>
            <button
                className="hover:text-black dark:hover:text-white"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
            >
                &raquo;
            </button>
        </div>
    );
};

export default Pagination;
  