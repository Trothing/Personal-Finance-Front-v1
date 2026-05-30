import './styles.scss';
import Navbar from "../../components/Navbar";
import { useCallback, useEffect, useState } from "react";
import {
    type Budget,
    getBudgets,
    createBudget,
    updateBudget,
    type BudgetCreate,
    type BudgetUpdate,
    deleteBudget
} from "../../api/budgets.ts";
import BudgetsElements from "../../components/BudgetsElements";
import { type Category, getCategories } from "../../api/categories.ts";
import BudgetModal from "../../components/BudgetModal";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import {useNavbar} from "../../hooks/useNavbar.ts";

const Colors = [
    { "name": "Deep Space Blue", "value": "#1B263B" },
    { "name": "Crimson Red", "value": "#DC143C" },
    { "name": "Emerald Green", "value": "#50C878" },
    { "name": "Goldenrod", "value": "#DAA520" },
    { "name": "Amethyst", "value": "#9966CC" },
    { "name": "Coral", "value": "#FF7F50" },
    { "name": "Slate Gray", "value": "#708090" },
    { "name": "Mint Frost", "value": "#E1F8EF" },
    { "name": "Terracotta", "value": "#E2725B" },
    { "name": "Midnight Purple", "value": "#2E1A47" },
    { "name": "Sky Blue", "value": "#87CEEB" },
    { "name": "Olive Drab", "value": "#6B8E23" },
    { "name": "Mustard", "value": "#FFDB58" },
    { "name": "Rose Quartz", "value": "#F7CAC9" },
    { "name": "Charcoal", "value": "#36454F" }
];

const Budgets = () => {
    const { isMinimized } = useNavbar();

    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);

    const fetchBudgets = useCallback(async () => {
        setError(null);
        setLoading(true);

        try {
            const response = await getBudgets();
            setBudgets(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBudgets();
    }, [fetchBudgets]);

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

    const handleAddNew = () => {
        setEditingBudget(null);
        setIsModalOpen(true);
    };

    const handleEdit = (budget: Budget) => {
        setEditingBudget(budget);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBudget(null);
    };

    const handleSave = async (data: BudgetCreate | BudgetUpdate) => {
        try {
            setError(null);

            if (editingBudget) {
                await updateBudget(editingBudget.id, data as BudgetUpdate);
            } else {
                await createBudget(data as BudgetCreate);
            }

            await fetchBudgets();
            handleCloseModal();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save budget');
        }
    };

    const handleDelete = (budget: Budget) => {
        setBudgetToDelete(budget);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!budgetToDelete) return;

        try {
            setError(null);
            await deleteBudget(budgetToDelete.id);
            await fetchBudgets();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete budget');
        } finally {
            setIsDeleteModalOpen(false);
            setBudgetToDelete(null);
        }
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setBudgetToDelete(null);
    };

    return (
        <div className={`budgets  ${isMinimized ? 'minimized' : ''}`}>
            <Navbar />
            <div className="budgets__main">
                <div className="budgets__header">
                    <div className="budgets__title">Budgets</div>
                    <button
                        className="budgets__new-budget"
                        onClick={handleAddNew}
                    >
                        + Add New Budget
                    </button>
                </div>

                <div className="budgets__budgets-module">
                    {error && (
                        <div className="budgets__error">
                            ⚠️ {error}
                        </div>
                    )}

                    {loading && (
                        <div className="budgets__loader">
                            {/*<div className="spinner">Loading...</div>*/}
                        </div>
                    )}

                    {!loading && !error && (
                        <BudgetsElements
                            budgets={budgets}
                            categories={categories}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </div>

            <BudgetModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                budget={editingBudget}
                budgets={budgets}
                categories={categories}
                availableColors={Colors}
                onSave={handleSave}
            />
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={confirmDelete}
                budgetName={budgetToDelete?.category.name || ''}
                text='Are you sure you want to delete this budget? This action cannot be reversed, and all the data inside it will be removed forever.'
            />
        </div>
    );
};

export default Budgets;