import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTicketById, addMessage } from '../services/api';
import './TicketDetail.css';


function TicketDetail () {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reply, setReply] = useState('');
    const [sending, setSending] = useState(false);
    const messageEndRef = useRef(null);
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
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth'});
    }, [ticket]); 


    const handleReply = async (e) => {
        e.preventDefault(); 
        if (!reply.trim()) return;
        setSending(true);


        try {
            const { data } = await addMessage(id, { content: reply });
            setTicket(data);
            setReply('');
        } catch (err) {
            setError('Failed to send message');
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
        if (sender === 'ai') return 'AI Assistant';
        if (sender === 'admin') return 'Support Agent';
        return 'You';
    };

    if (loading) return <div className='loading'>Loading ticket...</div>;
    if (error) return <div className='loading'>{error}</div>;
    if (!ticket) return <div className='loading'>Ticket not found</div>;


    return (
        <div className='ticket-detail-container'>
            <Link to='/dashboard' className='back-link'>Back to Dashboard</Link>

            <div className='ticket-detail-header'>
                <div>
                    <h1 className='ticket-title'>{ticket.title}</h1>
                    <div className='ticket-info'>
                        <span className={`status-badge status-${ticket.status}`}>
                            {ticket.status.replace('_','')}
                        </span>
                        {ticket.isEscalated && (
                            <span className='escalated-badge'>Escalated</span>
                        )}
                        <span className='ticket-date'>
                            Create {formatDate(ticket.createdAt)}
                        </span>
                    </div>
                </div>
            </div>


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
                <div ref={messageEndRef} />
            </div>

            {ticket.status !== 'closed' ? (
                <div className='reply-section'>
                    <p className='reply-title'> Reply to this ticket</p>
                    <form onSubmit={handleReply}>
                        <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            className='reply-textarea'
                            placeholder='Type your message here...'
                            required
                        />
                        <button
                            type='submit'
                            className='reply-button'
                            disabled={sending}
                        >
                            {sending ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className='closed-notice'>
                     This ticket is closed
                </div>
            )}
        </div>
    );
}

export default TicketDetail;