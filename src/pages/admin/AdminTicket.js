import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTicketById, updateTicketStatus, adminReply} from '../../services/api';
import './AdminTicket.css';


function AdminTicket() {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const messagesEndRef = useRef(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const { data } = await getTicketById(id);
                setTicket(data);
            } catch (err) {
                setError('Failed to load ticket');
            } finally {
                setLoading(false);
            }
        };
        fetchTicket();
    }, [id]);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [ticket]);

    const handleStatusChange = async (newStatus) => {
        try {
            const { data } = await updateTicketStatus(id, newStatus);
            setTicket(data);
            setSuccess('Status updated successfully');
            setTimeout(() => setSuccess(''), 3000); 
        } catch (err) {
            setError('Failed to update status');
        }
    };


    const handleReply = async (e) => {
        e.preventDefault();
        if (!reply.trim()) return;
        setSending(true);


        try {
            const { data } = await adminReply(id, reply);
            setTicket(data);
            setReply('');
            setSuccess('Reply sent successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to send reply');
        } finally {
            setSending(false);
        }
    };

    const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
        month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};


    const getSenderLabel = (sender) => {
        if (sender === 'ai') return 'Ai Assistant';
        if (sender === 'admin') return 'Support Agent';
        return 'User';
    };

    if (loading) return <div className='loading'>Loading ticket...</div>;
    if (!ticket) return <div className='loading'>Ticket not found</div>;


    return (
        <div className='admin-ticket-container'>
            <Link to='/admin' className='back-link'>← Back to Dashboard</Link>

            <div className='admin-ticket-header'>
                <div>
                    <h1 className='ticket-title'>{ticket.title}</h1>
                    <div className='ticket-info'>
                        <span className={`status-badge status-${ticket.status}`}>
                            {ticket.status.replace('_', ' ')}
                        </span>
                        {ticket.isEscalated && (
                            <span className='escalated-badge'>Escalated</span>
                        )}
                    </div>
                    <div className='ticket-user-info'>
                        {ticket.user?.name} • {ticket.user?.email}
                    </div>
                </div>

                <div className='admin-actions'>
                    <div className='action-label'>Update Status</div>
                    <select
                        className='status-select'
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                    >
                        <option value='open'>Open</option>
                        <option value='in_progress'>In Progress</option>
                        <option value='closed'>Closed</option>
                    </select>
                </div>
            </div>

            {success && <div className='success-message'>{success}</div>}
            {error && <div className='error-message'>{error}</div>}

            <div className='messages-container'>
                {ticket.messages.map((msg, index) => (
                    <div key={index} className={`message message-${msg.sender}`}>
                        <div className='message-sender'>
                            {getSenderLabel(msg.sender)}
                        </div>
                        <div className='message-bubble'>
                            {msg.content}
                        </div>
                        <div className='message-time'>
                            {formatDate(msg.createdAt)}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className='reply-section'>
                <p className='reply-title'>Reply as Support Agent</p>
                <form onSubmit={handleReply}>
                    <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        className='reply-textarea'
                        placeholder='Type your reply here...'
                        required
                    />
                    <button
                        type='submit'
                        className='reply-button'
                        disabled={sending}
                    >
                        {sending ? 'Sending...' : 'Send Reply'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminTicket;