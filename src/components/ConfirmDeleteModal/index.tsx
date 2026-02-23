import IconClose from '../../assets/Budget/icon-close-modal.svg';
import './styles.scss';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    budgetName: string;
    text: string;
}

const ConfirmDeleteModal = (props: ConfirmDeleteModalProps) => {
    const { isOpen, onClose, onConfirm, budgetName, text } = props

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="confirm-delete-overlay" onClick={onClose}>
            <div className="confirm-delete" onClick={(e) => e.stopPropagation()}>
                <div className="confirm-delete__header">
                    <h2 className="confirm-delete__title">
                        Delete '{budgetName}'?
                    </h2>
                    <button
                        className="confirm-delete__close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <img src={IconClose} alt="close" />
                    </button>
                </div>

                <p className="confirm-delete__text">
                    {text}
                </p>

                <div className="confirm-delete__actions">
                    <button
                        className="confirm-delete__confirm"
                        onClick={handleConfirm}
                    >
                        Yes, Confirm Deletion
                    </button>
                    <button
                        className="confirm-delete__cancel"
                        onClick={onClose}
                    >
                        No, Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;