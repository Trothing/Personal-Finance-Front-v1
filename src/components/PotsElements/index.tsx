import type { Pot } from "../../api/pots.ts";
import './styles.scss';
import PotElement from "../PotElement";

interface PotsElementsProps {
    pots: Pot[];
    onEdit: (pot: Pot) => void;
    onDelete: (pot: Pot) => void;
    onRefresh: () => void;
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
];

const PotsElements = (props: PotsElementsProps) => {
    const { pots, onEdit, onDelete, onRefresh } = props;

    return (
        <div className="pots-module">
            <div className="pots-module__all-pots">
                {pots.map((pot) => (
                    <PotElement
                        key={pot.id}
                        pot={pot}
                        Colors={Colors}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onRefresh={onRefresh}
                    />
                ))}
            </div>
        </div>
    );
}

export default PotsElements;