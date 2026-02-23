import { useState, useCallback, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TransactionsFilters from '../../components/TransactionsFilters';
import TransactionsList from '../../components/TransactionsList';
import './styles.scss';
import Navbar from "../../components/Navbar";
import { getTransactions, type Transaction, type TransactionSort } from "../../api/transactions.ts";
import { useNavbar } from "../../hooks/useNavbar.ts";
import TransactionsPagination from "../../assets/TransactionsPagination";
import { type Category, getCategories } from "../../api/categories.ts";

export interface Filters {
    search: string;
    sort: TransactionSort;
    type: string | null;
    category_id: number | null;
}

interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

const Transactions = () => {
    const { isMinimized } = useNavbar();
    const [searchParams, setSearchParams] = useSearchParams();

    const initialFilters: Filters = {
        search: searchParams.get('search') || '',
        sort: (searchParams.get('sort') as TransactionSort) || 'latest',
        category_id: searchParams.get('category') ? parseInt(searchParams.get('category')!) : null,
        type: searchParams.get('type') || null
    };

    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [pagination, setPagination] = useState<PaginationData>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    });

    const abortControllerRef = useRef<AbortController | null>(null);
    const isInitialMount = useRef(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const cats = await getCategories();
                setCategories(cats);
            } catch (err) {
                console.error('Failed to load categories:', err);
            }
        };

        loadCategories();
    }, []);

    const fetchTransactions = useCallback(async (newFilters: Filters, page: number = 1) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;

        setLoading(true);
        setError(null);

        try {
            const limit = 10;
            const skip = (page - 1) * limit;

            const data = await getTransactions(
                {
                    skip,
                    limit,
                    type: newFilters.type,
                    sort: newFilters.sort,
                    category_id: newFilters.category_id,
                    search: newFilters.search,
                },
                signal
            );

            setTransactions(data.transactions);

            const totalPages = Math.ceil(data.total / limit);

            setPagination({
                currentPage: page,
                totalPages: totalPages,
                totalItems: data.total,
                itemsPerPage: limit
            });

        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                console.log('Request was cancelled');
                return;
            }

            setError(err instanceof Error ? err.message : 'Something went wrong');
            console.error('Error fetching transactions:', err);

        } finally {
            setLoading(false);
        }
    }, []);

    const updateURL = useCallback((updatedFilters: Filters) => {
        const params = new URLSearchParams();

        if (updatedFilters.search) {
            params.set('search', updatedFilters.search);
        }
        if (updatedFilters.sort && updatedFilters.sort !== 'latest') {
            params.set('sort', updatedFilters.sort);
        }
        if (updatedFilters.category_id) {
            params.set('category', updatedFilters.category_id.toString());
        }

        setSearchParams(params, { replace: true });
    }, [setSearchParams]);

    const handleFiltersChange = useCallback((newFilters: Partial<Filters>) => {
        setFilters(prevFilters => {
            const updatedFilters = { ...prevFilters, ...newFilters };

            updateURL(updatedFilters);

            fetchTransactions(updatedFilters, 1);

            return updatedFilters;
        });
    }, [fetchTransactions, updateURL]);

    const handlePageChange = useCallback((newPage: number) => {
        if (newPage < 1 || newPage > pagination.totalPages) {
            return;
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });

        fetchTransactions(filters, newPage);
    }, [filters, pagination.totalPages, fetchTransactions]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            fetchTransactions(filters, 1);

            if (searchParams.has('type')) {
                const params = new URLSearchParams(searchParams);
                params.delete('type');
                setSearchParams(params, { replace: true });
            }
        } else {
            const urlFilters: Filters = {
                search: searchParams.get('search') || '',
                sort: (searchParams.get('sort') as TransactionSort) || 'latest',
                category_id: searchParams.get('category') ? parseInt(searchParams.get('category')!) : null,
                type: null
            };

            setFilters(urlFilters);
            fetchTransactions(urlFilters, 1);
        }

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [searchParams.get('search'), searchParams.get('sort'), searchParams.get('category')]);

    return (
        <div className={`transactions ${isMinimized ? 'minimized' : ''}`}>
            <Navbar />
            <div className="transactions__main">
                <h1 className='transactions__title'>Transactions</h1>

                <div className="transactions__transactions-module">
                    <TransactionsFilters
                        categories={categories}
                        filters={filters}
                        onFiltersChange={handleFiltersChange}
                    />

                    {error && (
                        <div className="transactions__error">
                            ⚠️ {error}
                        </div>
                    )}

                    {loading && (
                        <div className="transactions__loader">
                            <div className="spinner">Loading...</div>
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            {transactions.length === 0 ? (
                                <div className="transactions__empty">
                                    No transactions found
                                </div>
                            ) : (
                                <>
                                    <TransactionsList transactions={transactions} />

                                    {pagination.totalPages > 1 && (
                                        <TransactionsPagination
                                            currentPage={pagination.currentPage}
                                            totalPages={pagination.totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Transactions;