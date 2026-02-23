import type { Pot } from "../../api/pots.ts";
import PotProgressBar from "../PotProgressBar";
import { useCallback, useEffect, useRef, useState } from "react";
import './styles.scss';
import { addMoneyToPot, withdrawMoneyFromPot, getAvailableBalance } from "../../api/pots.ts";

interface color_value {
    name: string;
    value: string;
}

interface PotElementProps {
    pot: Pot;
    Colors: color_value[];
    onEdit: (pot: Pot) => void;
    onDelete: (pot: Pot) => void;
    onRefresh: () => void;
}

const PotElement = ({ pot, Colors, onEdit, onDelete, onRefresh }: PotElementProps) => {
    const controlRef = useRef<HTMLDivElement>(null);
    const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [amount, setAmount] = useState<string>('');
    const [availableBalance, setAvailableBalance] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    const handleEdit = () => {
        onEdit(pot);
        if (controlRef.current) {
            controlRef.current.classList.remove('active');
        }
    };

    const handleDelete = () => {
        onDelete(pot);
        if (controlRef.current) {
            controlRef.current.classList.remove('active');
        }
    };

    const handleControl = () => {
        if (controlRef.current) {
            controlRef.current.classList.toggle('active');
        }
    };

    const colorExist = useCallback((color: string) => {
        return Colors.some((c) => c.value === color);
    }, [Colors]);

    const percentage = (pot.saved / pot.target) * 100;

    const openAddMoneyModal = async () => {
        try {
            const balance = await getAvailableBalance();
            setAvailableBalance(balance.available_balance);
            setIsAddMoneyModalOpen(true);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get balance');
        }
    };

    const openWithdrawModal = () => {
        setIsWithdrawModalOpen(true);
        setError(null);
    };

    const handleAddMoney = async () => {
        try {
            setError(null);
            const numAmount = parseFloat(amount);
            if (isNaN(numAmount) || numAmount <= 0) {
                setError('Please enter a valid amount');
                return;
            }

            if (numAmount > 999999999) {
                setError('Amount is too large');
                return;
            }

            if (numAmount > availableBalance) {
                setError(`Insufficient funds. Available balance: $${availableBalance.toFixed(2)}`);
                return;
            }
            await addMoneyToPot(pot.id, numAmount);
            setIsAddMoneyModalOpen(false);
            setAmount('');
            onRefresh();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else if (typeof err === 'object' && err !== null && 'detail' in err) {
                setError((err as any).detail);
            } else {
                setError('Failed to add money');
            }
        }
    };

    const handleWithdraw = async () => {
        try {
            setError(null);
            const numAmount = parseFloat(amount);
            if (isNaN(numAmount) || numAmount <= 0) {
                setError('Please enter a valid amount');
                return;
            }
            if (numAmount > 999999999) {
                setError('Amount is too large');
                return;
            }

            if (numAmount > pot.saved) {
                setError(`Insufficient funds in pot. Available: $${pot.saved.toFixed(2)}`);
                return;
            }
            await withdrawMoneyFromPot(pot.id, numAmount);
            setIsWithdrawModalOpen(false);
            setAmount('');
            onRefresh();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else if (typeof err === 'object' && err !== null && 'detail' in err) {
                setError((err as any).detail);
            } else {
                setError('Failed to withdraw money');
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (controlRef.current && !controlRef.current.contains(event.target as Node)) {
                controlRef.current.classList.remove('active');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="pot-element">
                <div className="pot-element__header">
                    <div>
                        <p className="pot-element__header-color" style={{ background: pot.color }}></p>
                        <h2 className="pot-element__title">{pot.name}</h2>
                    </div>
                    <div className='pot-element__header-left'>
                        <button className="pot-element__control" onClick={handleControl}>...</button>
                        <div className="pot-element__control-modal" ref={controlRef}>
                            <button className="pot-element__edit" onClick={handleEdit}>Edit Pot</button>
                            <button className="pot-element__delete" onClick={handleDelete}>Delete Pot</button>
                        </div>
                    </div>
                </div>

                <div className="pot-element__info">
                    <div className="pot-element__saved-info">
                        <span className="pot-element__label">Total Saved</span>
                        <span className="pot-element__amount">${pot.saved.toFixed(2)}</span>
                    </div>
                    <div className="pot-element__target-info">
                        <span className="pot-element__percentage">{percentage.toFixed(1)}%</span>
                        <span className="pot-element__target">Target of ${pot.target.toFixed(0)}</span>
                    </div>
                </div>

                <div className="pot-element__progress-bar">
                    <PotProgressBar
                        saved={pot.saved}
                        target={pot.target}
                        color={colorExist(pot.color) ? pot.color : '#277C78'}
                    />
                </div>

                <div className="pot-element__actions">
                    <button className="pot-element__add-money" onClick={openAddMoneyModal}>
                        + Add Money
                    </button>
                    <button className="pot-element__withdraw" onClick={openWithdrawModal}>
                        Withdraw
                    </button>
                </div>
            </div>

            {isAddMoneyModalOpen && (
                <div className="modal-overlay" onClick={() => setIsAddMoneyModalOpen(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Add Money to {pot.name}</h2>
                        <p className="modal__balance">Available balance: ${availableBalance.toFixed(2)}</p>
                        {error && <div className="modal__error">{error}</div>}
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            step="0.01"
                            min="0.01"
                        />
                        <div className="modal__actions">
                            <button onClick={() => setIsAddMoneyModalOpen(false)}>Cancel</button>
                            <button onClick={handleAddMoney}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            {isWithdrawModalOpen && (
                <div className="modal-overlay" onClick={() => setIsWithdrawModalOpen(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Withdraw from {pot.name}</h2>
                        <p className="modal__balance">Available in pot: ${pot.saved.toFixed(2)}</p>
                        {error && <div className="modal__error">{error}</div>}
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            step="0.01"
                            min="0.01"
                            max={pot.saved}
                        />
                        <div className="modal__actions">
                            <button onClick={() => setIsWithdrawModalOpen(false)}>Cancel</button>
                            <button onClick={handleWithdraw}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PotElement;