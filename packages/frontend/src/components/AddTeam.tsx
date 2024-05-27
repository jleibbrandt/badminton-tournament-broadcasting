import React, { useState } from 'react';
import axios from 'axios';

const AddTeam: React.FC = () => {
    const [name, setName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/teams', { name });
            alert('Team added successfully!');
        } catch (error) {
            console.error('Error adding team:', error);
            alert('Failed to add team.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Team</h2>
            <input
                type="text"
                placeholder="Team Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <button type="submit">Add Team</button>
        </form>
    );
};

export default AddTeam;
