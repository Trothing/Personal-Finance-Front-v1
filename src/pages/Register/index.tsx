import RegImage from '../../assets/RegLog/RegLogImage.png'
import {useState, type FormEvent} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth.ts"
import ShowPasswordImage from '../../assets/RegLog/icon-show-password.svg?react';
import HidePasswordImage from '../../assets/RegLog/icon-hide-password.svg?react';
import LogoImage from '../../assets/RegLog/logo-large.svg?react';
import './styles.scss'
import {AnimatePresence, motion} from "framer-motion";

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [visiblePassword, setVisiblePassword] = useState(false)

    const {register} = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Password do not match')
            return
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true)

        try {
            await register({username, email, password})
            navigate('/transactions')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="register">
            <img src={RegImage} alt='Keep track of your money and save for your future' className="register__image tablet-hidden"/>
            <div className="register__header tablet-visible">
                <LogoImage className='register__logo-image'/>
            </div>
            <div className="register__main">
                    <div className="register__title">Sign Up</div>
                    <form onSubmit={handleSubmit} className="register__auth-form">
                        <div className="register__form-group">
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

                        <div className="register__form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="register__form-group">
                            <label htmlFor="password">Password</label>
                            <div className="register__input-wrapper">
                                <input
                                    id="password"
                                    type={visiblePassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    minLength={6}
                                />
                                <button type='button' className="register__visibility-password"
                                        onClick={() => setVisiblePassword(!visiblePassword)}>
                                    {
                                        visiblePassword ? <HidePasswordImage/> : <ShowPasswordImage/>
                                    }
                                </button>
                            </div>
                        </div>

                        <div className="register__form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="register__input-wrapper">
                                <input
                                    id="confirmPassword"
                                    type={visiblePassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                                <button type='button' className="register__visibility-password"
                                        onClick={() => setVisiblePassword(!visiblePassword)}>
                                    {
                                        visiblePassword ? <HidePasswordImage/> : <ShowPasswordImage/>
                                    }
                                </button>
                            </div>
                            <p className="register__input-helper">Passwords must be at least 6 characters</p>
                        </div>


                        <AnimatePresence>
                            <motion.div
                                animate={{
                                    opacity: error ? 1 : 0,
                                    y: error ? 0 : -10
                                }}
                                transition={{ duration: 0.3 }}
                                className={`register__auth-error ${error ? 'visible' : ''}`}
                            >
                                {error}
                            </motion.div>
                        </AnimatePresence>
                        <button
                            type="submit"
                            className="register__auth-button"
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Create Account'}
                        </button>
                    </form>
                    <p className="register__auth-link">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
        </div>
    );


};

export default Register