import './styles.scss';
import Navbar from "../../components/Navbar";
import { useCallback, useEffect, useState } from "react";
import {
    type Pot,
    getPots,
    createPot,
    updatePot,
    type PotCreate,
    type PotUpdate,
    deletePot
} from "../../api/pots.ts";
import PotsElements from "../../components/PotsElements";
import PotModal from "../../components/PotModal";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import {useNavbar} from "../../hooks/useNavbar.ts";

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
];

const Pots = () => {
    const { isMinimized } = useNavbar();

    const [pots, setPots] = useState<Pot[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPot, setEditingPot] = useState<Pot | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [potToDelete, setPotToDelete] = useState<Pot | null>(null);

    const fetchPots = useCallback(async () => {
        setError(null);
        setLoading(true);

        try {
            const response = await getPots();
            setPots(response);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else if (typeof err === 'object' && err !== null && 'detail' in err) {
                setError((err as any).detail);
            } else {
                setError('Failed to get pots');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPots();
    }, [fetchPots]);

    const handleAddNew = () => {
        setEditingPot(null);
        setIsModalOpen(true);
    };

    const handleEdit = (pot: Pot) => {
        setEditingPot(pot);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPot(null);
    };

    const handleSave = async (data: PotCreate | PotUpdate) => {
        try {
            setError(null);

            if (editingPot) {
                await updatePot(editingPot.id, data as PotUpdate);
            } else {
                await createPot(data as PotCreate);
            }

            await fetchPots();
            handleCloseModal();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else if (typeof err === 'object' && err !== null && 'detail' in err) {
                setError((err as any).detail);
            } else {
                setError('Failed to save pot');
            }
        }
    };

    const handleDelete = (pot: Pot) => {
        setPotToDelete(pot);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!potToDelete) return;

        try {
            setError(null);
            await deletePot(potToDelete.id);
            await fetchPots();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else if (typeof err === 'object' && err !== null && 'detail' in err) {
                setError((err as any).detail);
            } else {
                setError('Failed to delete pot');
            }
        } finally {
            setIsDeleteModalOpen(false);
            setPotToDelete(null);
        }
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setPotToDelete(null);
    };

    return (
        <div className={`pots  ${isMinimized ? 'minimized' : ''}`}>
            <Navbar />
            <div className="pots__main">
                <div className="pots__header">
                    <div className="pots__title">Pots</div>
                    <button
                        className="pots__new-pot"
                        onClick={handleAddNew}
                    >
                        + Add New Pot
                    </button>
                </div>

                <div className="pots__pots-module">
                    {error && (
                        <div className="pots__error">
                            ⚠️ {error}
                        </div>
                    )}

                    {loading && (
                        <div className="pots__loader">
                            {/*<div className="spinner">Loading...</div>*/}
                        </div>
                    )}

                    {!loading && !error && (
                        <PotsElements
                            pots={pots}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onRefresh={fetchPots}
                        />
                    )}
                </div>
            </div>

            <PotModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                pot={editingPot}
                pots={pots}
                availableColors={Colors}
                onSave={handleSave}
            />
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={confirmDelete}
                budgetName={potToDelete?.name || ''}
                text='Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever.'
            />
        </div>
    );
};

export default Pots;