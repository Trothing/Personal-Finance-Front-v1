import IconCaretLeft from '../../assets/transactions/icon-caret-left.svg?react';
import IconCaretRight from '../../assets/transactions/icon-caret-right.svg?react';
import './styles.scss'
import {useMediaQuery} from "../../hooks/useMediaQuery.ts";

interface TransactionsPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const TransactionsPagination = ({ currentPage, totalPages, onPageChange }: TransactionsPaginationProps) => {
    const isSmallDevice = useMediaQuery(480);

    const getPageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];
        const maxVisible = isSmallDevice ? 3 : 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (isSmallDevice) {
                if (currentPage === 1 || currentPage === 2) {
                    pages.push(1, 2, '...', totalPages);
                } else if (currentPage === totalPages || currentPage === totalPages - 1) {
                    pages.push(1, '...', totalPages - 1, totalPages);
                } else {
                    pages.push(1, '...', currentPage, '...', totalPages);
                }
            } else {
                pages.push(1);

                if (currentPage > 3) {
                    pages.push('...');
                }

                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 1);

                for (let i = start; i <= end; i++) {
                    pages.push(i);
                }

                if (currentPage < totalPages - 2) {
                    pages.push('...');
                }

                pages.push(totalPages);
            }
        }

        return pages;
    };
    const pageNumbers = getPageNumbers();

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="transactions-pagination">
            <button
                className="transactions-pagination__button transactions-pagination__button--prev"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <IconCaretLeft/>
                <span className='hidden-mobile'>Prev</span>
            </button>

            <div className="transactions-pagination__numbers">
                {pageNumbers.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className="transactions-pagination__ellipsis">
                                ...
                             </span>
                        );
                    }

                    return (
                        <button
                            key={page}
                            className={`transactions-pagination__number ${currentPage === page ? 'transactions-pagination__number--active' : ''}`}
                            onClick={() => onPageChange(page as number)}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            <button
                className="transactions-pagination__button transactions-pagination__button--next"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <span className='hidden-mobile'>Next</span>
                <IconCaretRight/>
            </button>
        </div>
    );
}

export default TransactionsPagination;