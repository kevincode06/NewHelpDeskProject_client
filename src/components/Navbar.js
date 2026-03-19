import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className='navbar'>
            <Link to='/' className='navbar-brand'>HelpDesk Pro</Link>
            <div className='navbar-links'>
                {user ? (
                    <>
                       {user.role === 'admin' ? (
                            <>
                            <Link to='/admin' className='navbar-link'>Dashboard</Link>
                            </>
                       ) : (
                            <>
                            <Link to='/dashboard' className='navbar-link'>My Tickets</Link>
                            <Link to='/tickets/new' className='navbar-link'>New Ticket</Link>
                            </>
                       )} 
                       <span className='navbar-user'>HI, {user.name}</span>
                          <button onClick={handleLogout} className='logout-button'>Logout</button>
                            </>
                ) : (
                    <>
                    <Link to='/login' className='navbar-link'>Login</Link>
                    <Link to='/register' className='navbar-link'>Register</Link> 
                    </>
                )}
                
            </div>
        </nav>
    );
}

export default Navbar;