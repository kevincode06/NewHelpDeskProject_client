import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerAPI } from '../services/api';
import './Register.css';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(''); 

        try {
            await registerAPI({ name, email, password});
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    }; 


    return (
        <div className='register-container'>
            <div className='register-card'>
                <h2 className='register-title'>HelpDesk Pro</h2>
                <p className='register-subtitle'>Create your account</p>

                
                {error && <div className='error-message'>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className='form-field'>
                        <label className='form-label'>Name</label>
                        <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='form-input'
                        placeholder='Enter your name'
                        required
                        />
                    </div>

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
                    {loading ? 'Create account...' : 'Register'}
                </button>
         </form>


         <p className='login-link'>
            Already have an account? <Link to='/login'>Login</Link>
         </p>
            </div>
        </div>
    );
}


export default Register;

