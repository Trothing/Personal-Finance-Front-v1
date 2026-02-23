import { NavLink } from 'react-router-dom';
import './styles.scss';
import logoLarge from '../../assets/navbar/logo-large.svg';
import logoSmall from '../../assets/navbar/logo-small.svg';
import minimizeMenu from '../../assets/navbar/icon-minimize-menu.svg';
import IconOverview from '../../assets/navbar/icon-nav-overview.svg?react';
import IconTransactions from '../../assets/navbar/icon-nav-transactions.svg?react';
import IconBudgets from '../../assets/navbar/icon-nav-budgets.svg?react';
import IconPots from '../../assets/navbar/icon-nav-pots.svg?react';
import IconBills from '../../assets/navbar/icon-nav-recurring-bills.svg?react';
import {useNavbar} from "../../hooks/useNavbar.ts";

const Navbar = () => {
    const { isMinimized, toggleMinimize } = useNavbar();

    const navLinks = [
        { path: '/', name: 'Overview', Icon: IconOverview },
        { path: '/transactions', name: 'Transactions', Icon: IconTransactions },
        { path: '/budgets', name: 'Budgets', Icon: IconBudgets },
        { path: '/pots', name: 'Pots', Icon: IconPots },
    ];

    return (
        <nav className={`navbar ${isMinimized ? 'navbar--minimized' : ''}`}>
            <div className="navbar__logo-container">
                <img
                    src={isMinimized ? logoSmall : logoLarge}
                    alt="logo"
                    className="navbar__logo"
                    key={isMinimized ? 'small' : 'large'}
                />
            </div>

            <ul className="navbar__routes">
                {navLinks.map(({ path, name, Icon }) => (
                    <li key={path}>
                        <NavLink
                            to={path}
                            className={({ isActive }) =>
                                `navbar__link ${isActive ? 'active' : ''}`
                            }
                        >
                            <Icon className="navbar__link_icon" />
                            {!isMinimized && (
                                <span className="navbar__link_text hidden-mobile">{name}</span>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>

            <button className="navbar__minimize-menu" onClick={toggleMinimize}>
                <img
                    src={minimizeMenu}
                    alt=""
                    className={`navbar__minimize-menu_icon ${isMinimized ? 'rotate' : ''}`}
                />
                {!isMinimized && (
                    <span className="navbar__minimize-menu_text">Minimize Menu</span>
                )}
            </button>
        </nav>
    );
};

export default Navbar;