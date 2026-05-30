import IconCaret from '../../assets/Budget/icon-caret-right.svg?react'
import type {Budget} from "../../api/budgets.ts";
import BudgetProgressBar from "../BudgetProgressBar";
import {useCallback, useEffect, useRef, useState} from "react";
import { getTransactions, type Transaction } from "../../api/transactions.ts";
import {API_URL} from "../../api/apiInfo.ts";
import './styles.scss'
import {useNavigate} from "react-router-dom";

interface color_value {
    name: string,
    value: string,
}

interface BudgetProgressBarProps {
    budget: Budget
    Colors: color_value[]
    onEdit: (budget: Budget) => void;
    onDelete: (budget: Budget) => void;
}

const BudgetElement = ({ budget, Colors, onEdit, onDelete}: BudgetProgressBarProps) => {
    const [lastTransactions, setLastTransactions] = useState<Transaction[]>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    const controlRef = useRef<HTMLDivElement>(null)

    const handleEdit = () => {
        onEdit(budget);
        if(controlRef.current){
            controlRef.current.classList.remove('active')
        }
    };
    const handleDelete = () => {
        onDelete(budget);
        if(controlRef.current){
            controlRef.current.classList.remove('active')
        }
    };
    const handleControl = () => {
        if(controlRef.current){
            controlRef.current.classList.toggle('active')
        }
    }
    const handleTransactionsView = () => {
        navigate(`/transactions?category=${budget.category.id}&sort=latest&type=expense`)
    }

    const colorExist = useCallback((color: string) => {
        return Colors.some((c) => c.value === color);
    }, [Colors])
    const formatDate = (dateString: string) =>{
        const date = new Date(dateString)
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }
    const formatAmount = (amount: number, type: string) => {
        const sign = type === 'income' ? '+' : '-';
        return `${sign}$${Math.abs(amount).toFixed(2)}`;
    };
    useEffect(() => {
        const fetchTransactions = async () => {
            try{
                setIsLoading(true)
                const data = await getTransactions({
                    skip: 0,
                    limit: 3,
                    type: "expense",
                    category_id: budget.category_id
                })
                setLastTransactions(data.transactions)
            }catch (err){
                console.error("Помилка завантаження транзакцій:", err);
            }finally {
                setIsLoading(false)
            }
        }
        fetchTransactions()
    }, [budget.category_id]);
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
        <div className="budget-element" key={budget.id}>
            <div className="budget-element__header">
                <div>
                    <p className="budget-element__header-color" style={{background: budget.color}}></p>
                    <h2 className="budget-elementt__itle">{budget.category.name}</h2>
                </div>
                <div className='budget-element__header-left'>
                    <button className="budget-element__control" onClick={handleControl}>...</button>
                    <div className="budget-element__control-modal" ref={controlRef}>
                        <button className="budget-element__edit" onClick={handleEdit}>Edit Budget</button>
                        <button className="budget-element__delete" onClick={handleDelete}>Delete Budget</button>
                    </div>
                </div>
            </div>
            <div className="budget-element__maximum">Maximum of ${budget.maximum}</div>
            <div className="budget-element__progress-bar">
                <BudgetProgressBar
                    spent={budget.spent}
                    maximum={budget.maximum}
                    color={colorExist(budget.color) ? budget.color : '#277C78'}
                />
            </div>
            <div className="budget-element__money">
                <div className="budget-element__money_spent">
                    <p className="budget-element__money_spent-text">Spent</p>
                    <p className="budget-element__money_spent-amount">${budget.spent}</p>
                </div>
                <div className="budget-element__money_remaining">
                    <p className="budget-element__money_remaining-text">Remaining</p>
                    <p className="budget-element__money_remaining-amount">${budget.maximum - budget.spent}</p>
                </div>
            </div>
            <div className="budget-element__last-spending">
                <div className="budget-element__last-spending-header">
                    <h3 className="budget-element__last-spending-title">Latest Spending</h3>
                    <button className="budget-element__last-spending-see-all" onClick={handleTransactionsView}>
                        See All
                        <IconCaret/>
                    </button>
                </div>
                {isLoading ? (
                    /*<p>Loading...</p>*/
                    <p></p>
                ) : (
                    <div className="budget-element__transactions">
                        {
                            lastTransactions?.map((tx) => (
                                <div key={tx.id} className="budget-element__tx-item">
                                    <div className="budget-element__tx-info">
                                        <img src={`${API_URL}/static/${tx.counterparty_avatar_url}`} alt="avatar"/>
                                        <span>{tx.counterparty_name}</span>
                                    </div>
                                    <div className="budget-element__tx-other-info">
                                        <p className="budget-element__tx-amount">{formatAmount(tx.amount, tx.type)}</p>
                                        <p className="budget-element__tx-date">{formatDate(tx.date)}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )}
            </div>
        </div>
    );
};

export default BudgetElement;