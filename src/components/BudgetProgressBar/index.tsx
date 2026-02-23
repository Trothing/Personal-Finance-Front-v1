import './styles.scss'

interface BudgetProgressBarProps {
    spent: number;
    maximum: number;
    color: string;
}

const BudgetProgressBar = ({ spent, maximum, color }: BudgetProgressBarProps) => {
    const percentage = Math.min((spent / maximum) * 100, 100);

    return (
        <div className="budget-progress">
            <div style={{
                width: '100%',
                height: '32px',
                backgroundColor: 'var(--color-beige-100)',
                borderRadius: '4px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `calc(${percentage}% - 8px)`,
                    height: '24px',
                    backgroundColor: color,
                    borderRadius: '4px',
                    transition: 'width 0.5s ease',
                    marginTop: '4px',
                    marginLeft: '4px',
                }} />
            </div>
        </div>
    );
};

export default BudgetProgressBar;