import { useState, useEffect, type FormEvent } from 'react';
import IconClose from '../../assets/Budget/icon-close-modal.svg';
import './styles.scss';
import type { Budget } from "../../api/budgets.ts";
import type { Category } from "../../api/categories.ts";

interface BudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    budget: Budget | null;
    budgets: Budget[];
    categories: Category[];
    availableColors: Array<{ name: string; value: string }>;
    onSave: (data: { category_id: number; maximum: number; color: string }) => Promise<void>;
}

const BudgetModal = (props: BudgetModalProps) => {
    const {
        isOpen,
        onClose,
        budget,
        budgets,
        categories,
        availableColors,
        onSave
    } = props
    const [categoryId, setCategoryId] = useState<number>(0);
    const [amount, setAmount] = useState<number>(0);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (budget) {
                setCategoryId(budget.category_id);
                setAmount(budget.maximum);
                setSelectedColor(budget.color);
            } else {
                const availableCategory = categories.find(
                    cat => !budgets.some(b => b.category_id === cat.id)
                );

                setCategoryId(availableCategory?.id || 0);
                setAmount(0);
                const firstAvailableColor = availableColors.find(
                    col => !budgets.some(b => b.color === col.value)
                );
                setSelectedColor(firstAvailableColor?.value || '');
            }
            setError(null);
        }
    }, [isOpen, budget, budgets, categories, availableColors]);

    const categoryUsed = (categoryId: number): boolean => {
        if (budget && budget.category_id === categoryId) {
            return false;
        }
        return budgets.some((b: Budget) => b.category_id === categoryId);
    };

    const colorUsed = (color: string): boolean => {
        if (budget && budget.color === color) {
            return false;
        }
        return budgets.some((b: Budget) => b.color === color);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!selectedColor || colorUsed(selectedColor)) {
            setError('Please select an available color');
            setLoading(false);
            return;
        }
        if (!categoryId || (categoryUsed(categoryId) && !budget)) {
            setError('Please select an available category');
            setLoading(false);
            return;
        }

        try {
            await onSave({
                category_id: categoryId,
                maximum: amount,
                color: selectedColor
            });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save budget');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const title = budget ? 'Edit Budget' : 'Add New Budget';
    const submitText = budget ? 'Save Changes' : 'Add Budget';

    return (
        <div className="budget-modal-overlay" onClick={onClose}>
            <div className="budget-modal" onClick={(e) => e.stopPropagation()}>
                <div className="budget-modal__header">
                    <h1 className="budget-modal__title">{title}</h1>
                    <button
                        className="budget-modal__close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <img src={IconClose} alt="close modal" />
                    </button>
                </div>

                <p className="budget-modal__text">
                    As your budgets change, feel free to update your spending limits.
                </p>

                {error && (
                    <div className="budget-modal__error">
                        ⚠️ {error}
                    </div>
                )}

                <form className="budget-modal__form" onSubmit={handleSubmit}>
                    <div className="budget-modal__group">
                        <label className="budget-modal__label">Budget Category</label>
                        <select
                            className="budget-modal__select"
                            value={categoryId}
                            onChange={(e) => setCategoryId(Number(e.target.value))}
                            disabled={!!budget}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => {
                                const isUsed = categoryUsed(cat.id);
                                return (
                                    <option
                                        key={cat.id}
                                        value={cat.id}
                                        disabled={isUsed}
                                    >
                                        {cat.name} {isUsed ? "(Used)" : ""}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="budget-modal__group">
                        <label className="budget-modal__label">Maximum Spend</label>
                        <div className="budget-modal__input-container">
                            <span className="budget-modal__currency">$</span>
                            <input
                                type="number"
                                className="budget-modal__input"
                                value={amount || ''}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="budget-modal__group">
                        <label className="budget-modal__label">Theme</label>
                        <div className="budget-modal__color-wrapper">
                            <div
                                className="budget-modal__color-dot"
                                style={{ backgroundColor: selectedColor }}
                            />
                            <select
                                className="budget-modal__select budget-modal__select--color"
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                                required
                            >
                                <option value="">Select a color</option>
                                {availableColors.map((col) => {
                                    const isUsed = colorUsed(col.value);
                                    return (
                                        <option
                                            key={col.value}
                                            value={col.value}
                                            disabled={isUsed}
                                        >
                                            {col.name} {isUsed ? "(Used)" : ""}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="budget-modal__submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : submitText}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BudgetModal;