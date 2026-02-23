import RegImage from '../../assets/RegLog/RegLogImage.png'
import {useState, type FormEvent} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth.ts"
import ShowPasswordImage from '../../assets/RegLog/icon-show-password.svg?react';
import HidePasswordImage from '../../assets/RegLog/icon-hide-password.svg?react';
import LogoImage from '../../assets/RegLog/logo-large.svg?react';
import './styles.scss'
import {AnimatePresence, motion} from "framer-motion";

const login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [visiblePassword, setVisiblePassword] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true)

        try {
            await login({username, password})
            navigate('/transactions')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="login">
            <img src={RegImage} alt='Keep track of your money and save for your future' className="login__image tablet-hidden"/>
            <div className="login__header tablet-visible">
                <LogoImage className='login__logo-image'/>
            </div>
            <div className="login__main">
                <div className="login__title">Login</div>
                <form onSubmit={handleSubmit} className="login__auth-form">
                    <div className="login__form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="login__form-group">
                        <label htmlFor="password">Password</label>
                        <div className="login__input-wrapper">
                            <input
                                id="password"
                                type={visiblePassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                                minLength={6}
                            />
                            <button type='button' className="login__visibility-password"
                                    onClick={() => setVisiblePassword(!visiblePassword)}>
                                {
                                    visiblePassword ? <HidePasswordImage/> : <ShowPasswordImage/>
                                }
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        <motion.div
                            animate={{
                                opacity: error ? 1 : 0,
                                y: error ? 0 : -10
                            }}
                            transition={{ duration: 0.3 }}
                            className={`login__auth-error ${error ? 'visible' : ''}`}
                        >
                            {error}
                        </motion.div>
                    </AnimatePresence>
                    <button
                        type="submit"
                        className="login__auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Login'}
                    </button>
                </form>
                <p className="login__auth-link">
                    Need to create an account? <Link to="/register">Sign up</Link>
                </p>
            </div>
        </div>
    );


};

export default login