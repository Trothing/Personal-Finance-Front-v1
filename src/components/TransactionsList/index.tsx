import type {Transaction} from "../../api/transactions.ts";
import './styles.scss'
import {API_URL} from "../../api/apiInfo.ts";

interface TransactionsListProps {
    transactions: Transaction[];
}

const TransactionsList = ({ transactions }: TransactionsListProps) => {
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

    return (
        <div className="transactions-list">
            <div className="transactions-list__headers hidden-mobile">
                <p className="transactions-list__headers-item">Recipient\Sender</p>
                <p className="transactions-list__headers-item">Category</p>
                <p className="transactions-list__headers-item">Transaction Date</p>
                <p className="transactions-list__headers-item transactions-list__headers-item-amount">Amount</p>
            </div>
            <div className="transactions-list__rows">
                {transactions.map(transaction => (
                    <div key={transaction.id} className="transactions-list__item">
                        <div className="transactions-list__item-info">
                            <img src={`${API_URL}/static/${transaction.counterparty_avatar_url}`} alt="avatar"/>
                            <div>
                                <h3>{transaction.counterparty_name}</h3>
                                <p className='visible-mobile'>{transaction.category.name}</p>
                            </div>
                        </div>
                        <div className="transactions-list__item-category hidden-mobile">
                            {transaction.category.name}
                        </div><div className="transactions-list__item-date hidden-mobile">
                            {formatDate(transaction.date)}
                        </div>
                        <div className={`transactions-list__item-amount ${transaction.type == 'income' ? 'income' : 'expense'}`}>
                            {formatAmount(transaction.amount, transaction.type)}
                            <p className='visible-mobile'>{formatDate(transaction.date)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TransactionsList;