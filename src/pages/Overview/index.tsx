import './styles.scss';
import Navbar from "../../components/Navbar";
import { useCallback, useEffect, useState } from "react";
import { useNavbar } from "../../hooks/useNavbar.ts";
import { getTransactions, type Transaction } from "../../api/transactions.ts";
import { getBudgets, type Budget } from "../../api/budgets.ts";
import { getPots, type Pot } from "../../api/pots.ts";
import { API_URL } from "../../api/apiInfo.ts";
import { Cell, Pie, PieChart } from "recharts";
import IconPot from '../../assets/Overview/icon-pot.svg?react';
import {get_balance} from "../../api/finance.ts";

const Overview = () => {
    const { isMinimized } = useNavbar();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [pots, setPots] = useState<Pot[]>([]);
    const [loading, setLoading] = useState(false);

    const [currentBalance, setCurrentBalance] = useState(0);
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState(0);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [txResponse, budgetsData, potsData] = await Promise.all([
                getTransactions({ skip: 0, limit: 5, sort: 'latest' }),
                getBudgets(),
                getPots()
            ]);

            setTransactions(txResponse.transactions);
            setBudgets(budgetsData);
            setPots(potsData);


            const {available_balance, incomes, expenses, pots_total} = await get_balance()

            setIncome(incomes);
            setExpenses(expenses);
            setCurrentBalance(incomes - expenses - pots_total);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const totalSaved = pots.reduce((sum, pot) => sum + Number(pot.saved), 0);
    const totalBudgetLimit = budgets.reduce((sum, b) => sum + Number(b.maximum), 0);
    const totalBudgetSpent = budgets.reduce((sum, b) => sum + Number(b.spent), 0);

    const budgetChartData = budgets.map(budget => ({
        name: budget.category.name,
        value: budget.spent,
        color: budget.color
    }));

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatAmount = (amount: number, type: string) => {
        const sign = type === 'income' ? '+' : '-';
        return `${sign}$${Math.abs(amount).toFixed(2)}`;
    };

    return (
        <div className={`overview ${isMinimized ? 'minimized' : ''}`}>
            <Navbar />
            <div className="overview__main">
                <h1 className="overview__title">Overview</h1>

                <div className="overview__balance-cards">
                    <div className="overview__card overview__card--dark">
                        <div className="overview__card-label">Current Balance</div>
                        <div className="overview__card-amount">${currentBalance.toFixed(2)}</div>
                    </div>
                    <div className="overview__card overview__card--light">
                        <div className="overview__card-label">Income</div>
                        <div className="overview__card-amount">${income.toFixed(2)}</div>
                    </div>
                    <div className="overview__card overview__card--light">
                        <div className="overview__card-label">Expenses</div>
                        <div className="overview__card-amount">${expenses.toFixed(2)}</div>
                    </div>
                </div>

                <div className="overview__content">
                    <div className="overview__left">
                        <div className="overview__section overview__pots">
                            <div className="overview__section-header">
                                <h2 className="overview__section-title">Pots</h2>
                                <a href="/pots" className="overview__see-details">
                                    See Details →
                                </a>
                            </div>
                            <div className="overview__pots-content">
                                <div className="overview__pots-total">
                                    <IconPot className="overview__pots-icon" />
                                    <div>
                                        <div className="overview__pots-label">Total Saved</div>
                                        <div className="overview__pots-amount">${totalSaved.toFixed(2)}</div>
                                    </div>
                                </div>
                                <div className="overview__pots-list">
                                    {pots.slice(0, 4).map((pot) => (
                                        <div key={pot.id} className="overview__pot-item">
                                            <div className="overview__pot-name">{pot.name}</div>
                                            <div className="overview__pot-amount">${pot.saved.toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="overview__section overview__transactions">
                            <div className="overview__section-header">
                                <h2 className="overview__section-title">Transactions</h2>
                                <a href="/transactions" className="overview__see-details">
                                    View All →
                                </a>
                            </div>
                            <div className="overview__transactions-list">
                                {transactions.map((tx) => (
                                    <div key={tx.id} className="overview__tx-item">
                                        <div className="overview__tx-left">
                                            <img
                                                src={`${API_URL}/static/${tx.counterparty_avatar_url}`}
                                                alt={tx.counterparty_name}
                                                className="overview__tx-avatar"
                                            />
                                            <span className="overview__tx-name">{tx.counterparty_name}</span>
                                        </div>
                                        <div className="overview__tx-right">
                                            <div className={`overview__tx-amount overview__tx-amount--${tx.type}`}>
                                                {formatAmount(tx.amount, tx.type)}
                                            </div>
                                            <div className="overview__tx-date">{formatDate(tx.date)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="overview__right">
                        <div className="overview__section overview__budgets">
                            <div className="overview__section-header">
                                <h2 className="overview__section-title">Budgets</h2>
                                <a href="/budgets" className="overview__see-details">
                                    See Details →
                                </a>
                            </div>
                            <div className="overview__budgets-content">
                                <div className="overview__budgets-chart">
                                    <PieChart width={240} height={240}>
                                        <Pie
                                            data={budgetChartData}
                                            cx={120}
                                            cy={120}
                                            innerRadius={85}
                                            outerRadius={110}
                                            paddingAngle={3}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {budgetChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                    <div className="overview__budgets-center">
                                        <div className="overview__budgets-spent">${totalBudgetSpent.toFixed(2)}</div>
                                        <div className="overview__budgets-limit">of ${totalBudgetLimit.toFixed(2)} limit</div>
                                    </div>
                                </div>
                                <div className="overview__budgets-list">
                                    {budgets.slice(0, 4).map((budget) => (
                                        <div key={budget.id} className="overview__budget-item">
                                            <div className="overview__budget-left">
                                                <div
                                                    className="overview__budget-color"
                                                    style={{ backgroundColor: budget.color }}
                                                />
                                                <span className="overview__budget-name">{budget.category.name}</span>
                                            </div>
                                            <div className="overview__budget-amount">${budget.spent.toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;