import { useState, type ChangeEvent, useEffect, useRef } from 'react';
import './styles.scss';
import IconSearch from '../../assets/transactions/icon-search.svg?react';
import IconCaretDown from '../../assets/transactions/icon-caret-down.svg?react';
import IconFilter from '../../assets/transactions/icon-filter-mobile.svg?react';
import IconSort from '../../assets/transactions/icon-sort-mobile.svg?react';
import { TransactionSort } from "../../api/transactions.ts";
import type { Filters } from "../../pages/Transactions";
import type { Category } from "../../api/categories.ts";

interface TransactionsFiltersProps {
    filters: Filters;
    categories: Category[];
    onFiltersChange: (filters: Partial<Filters>) => void;
}

const TransactionsFilters = ({ filters, categories, onFiltersChange }: TransactionsFiltersProps) => {
    const [localSearch, setLocalSearch] = useState(filters.search);
    const mobileSortOverlayRef = useRef<HTMLDivElement>(null);
    const mobileFilterOverlayRef = useRef<HTMLDivElement>(null);

    const sortOptions = [
        { value: TransactionSort.LATEST, label: 'Latest' },
        { value: TransactionSort.OLDEST, label: 'Oldest' },
        { value: TransactionSort.NAME_ASC, label: 'A to Z' },
        { value: TransactionSort.NAME_DESC, label: 'Z to A' },
        { value: TransactionSort.AMOUNT_DESC, label: 'Highest' },
        { value: TransactionSort.AMOUNT_ASC, label: 'Lowest' },
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch.trim() !== filters.search.trim()) {
                onFiltersChange({ search: localSearch });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [localSearch, filters.search, onFiltersChange]);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLocalSearch(e.target.value);
    };

    const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const sort = e.target.value as TransactionSort;
        onFiltersChange({ sort });
    };

    const handleSortChangeMobile = (sorting: TransactionSort) => {
        onFiltersChange({ sort: sorting });
        if (mobileSortOverlayRef.current) {
            mobileSortOverlayRef.current.classList.remove('active');
        }
    };

    const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        onFiltersChange({
            category_id: value === 'all' ? null : parseInt(value)
        });
    };

    const handleCategoryChangeMobile = (categoryId: string) => {
        onFiltersChange({
            category_id: categoryId === 'all' ? null : parseInt(categoryId)
        });

        if (mobileFilterOverlayRef.current) {
            mobileFilterOverlayRef.current.classList.remove('active');
        }
    };

    const activateMobileOverlaySort = () => {
        if (mobileSortOverlayRef.current) {
            mobileSortOverlayRef.current.classList.toggle('active');
        }

        if (mobileFilterOverlayRef.current) {
            mobileFilterOverlayRef.current.classList.remove('active');
        }
    };

    const activateMobileOverlayFilter = () => {
        if (mobileFilterOverlayRef.current) {
            mobileFilterOverlayRef.current.classList.toggle('active');
        }

        if (mobileSortOverlayRef.current) {
            mobileSortOverlayRef.current.classList.remove('active');
        }
    };

    return (
        <div className='transactions-filters'>
            <div className="transactions-filters__search-container">
                <input
                    type="text"
                    id="search"
                    className="transactions-filters__search-input"
                    placeholder=" "
                    value={localSearch}
                    onChange={handleSearchChange}
                />
                <label htmlFor="search" className='transactions-filters__search-label'>
                    Search...
                </label>
                <IconSearch className='transactions-filters__search-icon'/>
            </div>

            <div className="transactions-filters__selectors">
                <div className="transactions-filters__mobile-sort-container transactions-filters__mobile-selector-container visible-mobile">
                    <IconSort onClick={activateMobileOverlaySort}/>
                    <div className="transactions-filters__mobile-selectors" ref={mobileSortOverlayRef}>
                        {sortOptions.map(option => (
                            <button
                                key={option.value}
                                onClick={() => handleSortChangeMobile(option.value)}
                                className={filters.sort === option.value ? 'active' : ''}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="transactions-filters__mobile-category-container transactions-filters__mobile-selector-container visible-mobile">
                    <IconFilter onClick={activateMobileOverlayFilter}/>
                    <div className="transactions-filters__mobile-selectors" ref={mobileFilterOverlayRef}>
                        <button
                            onClick={() => handleCategoryChangeMobile('all')}
                            className={filters.category_id === null ? 'active' : ''}
                        >
                            All Transactions
                        </button>

                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryChangeMobile(category.id.toString())}
                                className={filters.category_id === category.id ? 'active' : ''}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className='transactions-filters__sort-container transactions-filters__selector-container hidden-mobile'>
                    <label htmlFor="sort">Sort by</label>
                    <select
                        className='transactions-filters__selector'
                        id="sort"
                        value={filters.sort}
                        onChange={handleSortChange}
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <IconCaretDown className='transactions-filters__caret-down'/>
                </div>

                <div className='transactions-filters__category-container transactions-filters__selector-container hidden-mobile'>
                    <label htmlFor="category">Category</label>
                    <select
                        className='transactions-filters__selector'
                        id="category"
                        value={filters.category_id ?? 'all'}
                        onChange={handleCategoryChange}
                    >
                        <option value="all">All Transactions</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <IconCaretDown className='transactions-filters__caret-down'/>
                </div>
            </div>
        </div>
    );
}

export default TransactionsFilters;