import { Routes, Route, useLocation } from 'react-router-dom';
import Overview from "./pages/Overview";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Pots from "./pages/Pots";
import { AnimatePresence } from "framer-motion";
import './styles/style.scss'
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { PublicRoute } from "./components/PublicRoute.tsx";
import Login from "./pages/Login";
import {NavbarProvider} from "./context/NavbarContext.tsx";


function App() {
    const location = useLocation()

    return (
        <AnimatePresence mode='wait'>
            <AuthProvider>
                <NavbarProvider>
                    <Routes location={location} key={location.pathname}>
                        <Route path='register' element={<PublicRoute><Register/></PublicRoute>}/>
                        <Route path='login' element={<PublicRoute><Login/></PublicRoute>}/>


                        <Route path="/" element={<ProtectedRoute><Overview/></ProtectedRoute>} />
                        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
                        <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
                        <Route path="/pots" element={<ProtectedRoute><Pots /></ProtectedRoute>} />

                    </Routes>
                </NavbarProvider>
            </AuthProvider>
        </AnimatePresence>
    );
}

export default App;