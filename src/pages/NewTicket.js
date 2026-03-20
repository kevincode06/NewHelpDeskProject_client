import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { createTicket } from '../services/api';
import './NewTicket.css';


function NewTicket() {
    const [title, setTitle ] = useState('');
    const [message, setMessage ] = useState('');
    const [error, setError ] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await createTicket({ title, message});
         navigate(`/tickets/${data._id}`);
        } catch (err) {
            setError(err.response?.data.message || 'Failed to create ticket');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className='new-ticket-container'>
            <div className='new-ticket-header'>
                <h1 className='new-ticket-tittle'>Create New Ticket</h1>
                <p className='new-ticket-subtitle'>Describe your issue and our AI will assist you</p>
            </div>

            <div className='new-ticket-card'>
                <div className='ai-notice'>Our AI assistant will response to your ticket instantly</div>

                {error && <div className='error-message'> {error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className='form-field'>
                        <label className='form-label'>Title</label>
                        <input 
                        type='text'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className='form-input'
                        placeholder='Brief summary of your'
                        required
                        />
                    </div>


                    <div className='form-field'>
                        <label className='form-label'>Message</label>
                        <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className='form-textarea'
                        placeholder='Describe your issue in detail...'
                        required
                        />
                    </div>


                    <div className='form-actions'>
                        <Link to='/dashboard' className='cancel-button'>Cancel</Link>
                        <button type='submit' className='submit-button' disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Ticket' }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


export default NewTicket;