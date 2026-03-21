import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginAPI } from "../services/api.js";
import './Login.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');
const [loading, setLoading] = useState(false);


    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await loginAPI({ email, password });
            login(data, data.token);

            if (data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className='login-container'>
            <div className='login-card'>
                <h2 className='login-title'>HelpDesk Pro</h2>
                <p className='login-subtitle'>Welcome back! Please login to your account.</p>

                {error && <div className='error-message'>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className='form-field'> 
                        <label className='form-label'>Email</label>
                        <input 
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='form-input'
                        placeholder='Enter your email'
                        required
                        />
                    </div>

                    <div className='form-field'>
                        <label className='form-label'>Password</label>
                        <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='form-input'
                        placeholder='Enter your password'
                        required
                        />
                    </div>

                    <button type='submit' className='submit-button' disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className='register-link'>Don't have an account? <Link to='/register'>Register</Link></p>
            </div>
        </div>
    );
}

export default Login;