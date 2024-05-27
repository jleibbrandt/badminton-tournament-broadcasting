import React, { useState } from 'react';
import axios from 'axios';

const AddTournament: React.FC = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/tournaments', { name, type });
            alert('Tournament created successfully!');
            setName('');
            setType('');
        } catch (error) {
            console.error('Error creating tournament:', error);
            alert('Failed to create tournament.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Tournament</h2>
            <input
                type="text"
                placeholder="Tournament Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Tournament Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
            />
            <button type="submit">Add Tournament</button>
        </form>
    );
};

export default AddTournament;
