import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllTickets, getStats } from '../../services/api';
import './AdminDashboard.css';


function AdminDashboard() {
    const [tickets, setTickets] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ticketsRes, statsRes] = await Promise.all([
                    getAllTickets(filter),
                    getStats()
                ]);
                setTickets(ticketsRes.data);
                setStats(statsRes.data);
        } catch (err) {
            console.error('Failed to load data', err);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
    }, [filter]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    return (
        <div className='admin-container'>
            <div className='admin-header'>
                <div>
                    <h1 className='admin-title'>Admin Dashboard</h1>
                    <p className='admin-subtitle'>Manage all support tickets</p>
                </div>
            </div>

            {stats && (
                <div className='stats-row'>
                    <div className='stat-card total'>
                        <div className='stat-number'>{stats.total}</div>
                        <div className='stat-label'>Total</div>
                </div>
                <div className='stat-card open'>
                        <div className='stat-number'>{stats.open}</div>
                        <div className='stat-label'>Open</div>
                    </div>
                    <div className='stat-card in-progress'>
                        <div className='stat-number'>{stats.inProgress}</div>
                        <div className='stat-label'>In Progress</div>
                    </div>
                    <div className='stat-card closed'>
                        <div className='stat-number'>{stats.closed}</div>
                        <div className='stat-label'>Closed</div>
                    </div>
                    <div className='stat-card escalated'>
                        <div className='stat-number'>{stats.escalated}</div>
                        <div className='stat-label'>Escalated</div>
                    </div>
                </div>
            )}

            <div className='filter-row'>
                <button
                    className={`filter-btn ${filter === '' ? 'active' : ''}`}
                    onClick={() => setFilter('')}
                >All</button>
                <button
                    className={`filter-btn ${filter === 'open' ? 'active' : ''}`}
                    onClick={() => setFilter('open')}
                >Open</button>
                <button
                    className={`filter-btn ${filter === 'in_progress' ? 'active' : ''}`}
                    onClick={() => setFilter('in_progress')}
                >In Progress</button>
                <button
                    className={`filter-btn ${filter === 'closed' ? 'active' : ''}`}
                    onClick={() => setFilter('closed')}
                >Closed</button>
                <button
                    className={`filter-btn ${filter === 'escalated' ? 'active' : ''}`}
                    onClick={() => setFilter('escalated')}
                >Escalated</button>
            </div>

            <div className='tickets-section'>
                <div className='tickets-section-header'>
                    All Tickets ({tickets.length})
                </div>

                {loading && <div className='loading'>Loading tickets...</div>}

                {!loading && tickets.length === 0 && (
                    <div className='empty-state'>No tickets found</div>
                )}

                {!loading && tickets.map(ticket => (
                    <Link
                        to={`/admin/tickets/${ticket._id}`}
                        key={ticket._id}
                        className='ticket-item'
                    >
                        <div>
                            <div className='ticket-title'>{ticket.title}</div>
                            <div className='ticket-meta'>
                                {ticket.user?.name} • {ticket.user?.email} • {formatDate(ticket.createdAt)}
                            </div>
                        </div>
                        <div className='ticket-right'>
                            <span className={`status-badge status-${ticket.status}`}>
                                {ticket.status.replace('_', ' ')}
                            </span>
                            {ticket.isEscalated && (
                                <span className='escalated-badge'>Escalated</span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default AdminDashboard;