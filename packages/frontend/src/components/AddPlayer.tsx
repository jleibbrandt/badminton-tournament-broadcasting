import React, { useState } from 'react';
import axios from 'axios';
import { getData } from 'country-list';

let countries = getData();
const sortedCountries = [
    { code: 'ZA', name: 'South Africa' },
    ...countries.filter(country => country.code !== 'ZA')
];

const AddPlayer: React.FC = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [seeding, setSeeding] = useState('');
    const [bsaBwfNumber, setBsaBwfNumber] = useState('');
    const [country, setCountry] = useState(''); // Initialize with empty string

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting player:', { name, surname, seeding, bsaBwfNumber, country });
        try {
            await axios.post('http://localhost:3001/api/players', {
                name,
                surname,
                seeding: parseInt(seeding, 10),
                bsa_bwf_number: bsaBwfNumber,
                country
            });
            alert('Player added successfully!');
        } catch (error) {
            console.error('Error adding player:', error);
            alert('Failed to add player.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Player</h2>
            <input
                type="text"
                placeholder="First Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Last Name"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Seeding"
                value={seeding}
                onChange={(e) => setSeeding(e.target.value)}
            />
            <input
                type="text"
                placeholder="BSA/BWF Number"
                value={bsaBwfNumber}
                onChange={(e) => setBsaBwfNumber(e.target.value)}
                required
            />
            <select value={country} onChange={(e) => setCountry(e.target.value)} required>
                <option value="" disabled>Select Country</option>
                {sortedCountries.map((country) => (
                    <option key={country.code} value={country.name}>{country.name}</option>
                ))}
            </select>
            <button type="submit">Add Player</button>
        </form>
    );
};

export default AddPlayer;
