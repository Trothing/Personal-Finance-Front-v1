import './styles.scss';

interface PotProgressBarProps {
    saved: number;
    target: number;
    color: string;
}

const PotProgressBar = ({ saved, target, color }: PotProgressBarProps) => {
    const percentage = Math.min((saved / target) * 100, 100);

    return (
        <div className="pot-progress-bar">
            <div className="pot-progress-bar__background">
                <div
                    className="pot-progress-bar__fill"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color
                    }}
                />
            </div>
        </div>
    );
};

export default PotProgressBar;