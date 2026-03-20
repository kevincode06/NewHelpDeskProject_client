import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyTickets } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';



function Dashboard () {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect (() => {
        const fetchTickets = async () => {
            try {
                const { data } = await getMyTickets();
                setTickets(data);
                } catch (err) {
                    setError('Failed to load tickets');
                } finally {
                    setLoading(false);
                }
            };
            fetchTickets();
        }, []);

        const openCount = tickets.filter(t => t.status === 'open').length;
        const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
        const closedCount = tickets.filter(t => t.status === 'closed').length;

        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
        };

        return (
    <div className='dashboard-container'>
        <div className='dashboard-header'>
            <div>
                <h1 className='dashboard-title'>My Tickets</h1>
                <p className='dashboard-subtitle'>Welcome back, {user?.name}</p>
            </div>
            <Link to='/tickets/new' className='new-ticket-btn'>+ New Ticket</Link>
        </div>

        <div className='stats-row'>
            <div className='stat-card open'>
                <div className='stat-number'>{openCount}</div>
                <div className='stat-label'>Open</div>
            </div>
            <div className='stat-card in-progress'>
                <div className='stat-number'>{inProgressCount}</div>
                <div className='stat-label'>In Progress</div>
            </div>
            <div className='stat-card closed'>
                <div className='stat-number'>{closedCount}</div>
                <div className='stat-label'>Closed</div>
            </div>
        </div>

        <div className='tickets-section'>
            <div className='tickets-section-header'>
                All Tickets ({tickets.length})
            </div>

            {loading && <div className='loading'>Loading tickets...</div>}
            {error && <div className='loading'>{error}</div>}

            {!loading && !error && tickets.length === 0 && (
                <div className='empty-state'>
                    <div className='empty-state-icon'></div>
                    <p className='empty-state-text'>No tickets yet</p>
                    <Link to='/tickets/new' className='new-ticket-btn'>
                        Create your first ticket
                    </Link>
                </div>
            )}

            {!loading && tickets.map(ticket => (
                <Link
                    to={`/tickets/${ticket._id}`}
                    key={ticket._id}
                    className='ticket-item'
                >
                    <div>
                        <div className='ticket-title'>{ticket.title}</div>
                        <div className='ticket-meta'>
                            Created {formatDate(ticket.createdAt)} •{' '}
                            {ticket.messages.length} messages
                        </div>
                    </div>
                    <div className='ticket-right'>
                        <span className={`status-badge status-${ticket.status}`}>
                            {ticket.status.replace('_', ' ')}
                        </span>
                        {ticket.isEscalated && (
                            <span className='escalated-badge'>⚠ Escalated</span>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    </div>
        );
    }


export default Dashboard