import { useState, useEffect, type FormEvent } from 'react';
import IconClose from '../../assets/Budget/icon-close-modal.svg';
import './styles.scss';
import type { Pot } from "../../api/pots.ts";

interface PotModalProps {
    isOpen: boolean;
    onClose: () => void;
    pot: Pot | null;
    pots: Pot[];
    availableColors: Array<{ name: string; value: string }>;
    onSave: (data: { name: string; target: number; color: string }) => Promise<void>;
}

const PotModal = (props: PotModalProps) => {
    const {
        isOpen,
        onClose,
        pot,
        pots,
        availableColors,
        onSave
    } = props;

    const [name, setName] = useState<string>('');
    const [target, setTarget] = useState<number>(0);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (pot) {
                setName(pot.name);
                setTarget(pot.target);
                setSelectedColor(pot.color);
            } else {
                setName('');
                setTarget(0);
                const firstAvailableColor = availableColors.find(
                    col => !pots.some(p => p.color === col.value)
                );
                setSelectedColor(firstAvailableColor?.value || '');
            }
            setError(null);
        }
    }, [isOpen, pot, availableColors]);

    const nameUsed = (potName: string): boolean => {
        if (pot && pot.name === potName) {
            return false;
        }
        return pots.some((p: Pot) => p.name.toLowerCase() === potName.toLowerCase());
    };

    const colorUsed = (color: string): boolean => {
        if (pot && pot.color === color) {
            return false;
        }
        return pots.some((p: Pot) => p.color === color);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (nameUsed(name)) {
            setError('A pot with this name already exists');
            setLoading(false);
            return;
        }
        if (!selectedColor || colorUsed(selectedColor)) {
            setError('Please select an available color');
            setLoading(false);
            return;
        }

        try {
            await onSave({
                name: name,
                target: target,
                color: selectedColor
            });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save pot');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const title = pot ? 'Edit Pot' : 'Add New Pot';
    const submitText = pot ? 'Save Changes' : 'Add Pot';

    return (
        <div className="pot-modal-overlay" onClick={onClose}>
            <div className="pot-modal" onClick={(e) => e.stopPropagation()}>
                <div className="pot-modal__header">
                    <h1 className="pot-modal__title">{title}</h1>
                    <button
                        className="pot-modal__close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <img src={IconClose} alt="close modal" />
                    </button>
                </div>

                <p className="pot-modal__text">
                    Create a pot to set savings targets. These can help keep you on track as you save for special purchases.
                </p>

                {error && (
                    <div className="pot-modal__error">
                        ⚠️ {error}
                    </div>
                )}

                <form className="pot-modal__form" onSubmit={handleSubmit}>
                    <div className="pot-modal__group">
                        <label className="pot-modal__label">Pot Name</label>
                        <input
                            type="text"
                            className="pot-modal__input pot-modal__input--text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Rainy Days"
                            maxLength={30}
                            required
                        />
                    </div>

                    <div className="pot-modal__group">
                        <label className="pot-modal__label">Target</label>
                        <div className="pot-modal__input-container">
                            <span className="pot-modal__currency">$</span>
                            <input
                                type="number"
                                className="pot-modal__input"
                                value={target || ''}
                                onChange={(e) => setTarget(Number(e.target.value))}
                                step="0.01"
                                min="0.01"
                                required
                            />
                        </div>
                    </div>

                    <div className="pot-modal__group">
                        <label className="pot-modal__label">Theme</label>
                        <div className="pot-modal__color-wrapper">
                            <div
                                className="pot-modal__color-dot"
                                style={{ backgroundColor: selectedColor }}
                            />
                            <select
                                className="pot-modal__select pot-modal__select--color"
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
                        className="pot-modal__submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : submitText}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PotModal;