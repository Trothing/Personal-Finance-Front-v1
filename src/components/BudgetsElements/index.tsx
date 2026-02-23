import {Cell, Pie, PieChart} from "recharts";
import type {Budget} from "../../api/budgets.ts";
import './styles.scss'
import {useCallback} from "react";
import BudgetElement from "../BudgetElement";
import type {Category} from "../../api/categories.ts";

interface BudgetsElementsProps{
    budgets: Budget[]
    categories: Category[]
    onEdit: (budget: Budget) => void;
    onDelete: (budget: Budget) => void;
}
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
]

const BudgetsElements = (props: BudgetsElementsProps) => {
    const { budgets, categories,onEdit, onDelete } = props

    const colorExist = useCallback((color: string) => {
        return Colors.some((c) => c.value === color);
    }, [Colors])

    const chartData  = budgets.map(budget => ({
        name: budget.category.name,
        value: budget.maximum,
        color: colorExist(budget.color) ? budget.color : '#277C78'
    }))

    const totalBudget = budgets.reduce((sum, b) => sum + Number(b.maximum), 0);
    const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent), 0);

    return(
        <div className="budgets-module">
            <div className="budgets-module__global">
                <div className="budgets-module__donut">
                    <PieChart width={240} height={240}>
                        <Pie
                            data={chartData}
                            cx={120}
                            cy={120}
                            innerRadius={85}
                            outerRadius={110}
                            paddingAngle={3}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>

                    <div className="budgets-module__center">
                        <h2 className="budgets-module__spent">${totalSpent}</h2>
                        <div className="budgets-module__total">of limit ${totalBudget}</div>
                    </div>
                </div>
                <div className="budgets-module__list">
                    <h3 className="budgets-module__title">Spending Summary</h3>
                    {budgets.map((budget) => (
                        <div key={budget.id} className="budgets-module__micro-item">
                            <div className="budgets-module__micro-item-info">
                                <span
                                    className="budgets-module__micro-item-color"
                                    style={{ backgroundColor: colorExist(budget.color) ? budget.color : '#277C78' }}
                                />
                                <span className="budgets-module__micro-item-category">
                                {budget.category.name}
                                </span>
                            </div>
                            <div className="budgets-module__micro-item-amount">
                                <span className="budgets-module__micro-item-amount-spent">${budget.spent}</span> of ${budget.maximum}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="budgets-module__all-budgets">
                {budgets.map((budget) => (
                    <BudgetElement
                        budget={budget}
                        Colors={Colors}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    )
}

export default BudgetsElements