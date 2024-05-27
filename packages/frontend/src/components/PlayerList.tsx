import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Player } from '../types';

const PlayerList: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [editingPlayer, setEditingPlayer] = useState<number | null>(null);
    const [updatedPlayer, setUpdatedPlayer] = useState<Partial<Player>>({
        id: 0,
        name: '',
        surname: '',
        seeding: 0,
        bsa_bwf_number: '',
        country: ''
    });

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/players');
                setPlayers(response.data);
            } catch (error) {
                console.error('Error fetching players:', error);
            }
        };

        fetchPlayers();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3001/api/players/${id}`);
            setPlayers(players.filter((player) => player.id !== id));
        } catch (error) {
            console.error('Error deleting player:', error);
        }
    };

    const handleEdit = (player: Player) => {
        setEditingPlayer(player.id);
        setUpdatedPlayer({
            name: player.name,
            surname: player.surname,
            seeding: player.seeding,
            bsa_bwf_number: player.bsa_bwf_number,
            country: player.country
        });
    };

    const handleUpdate = async (id: number) => {
        try {
            await axios.put(`http://localhost:3001/api/players/${id}`, updatedPlayer);
            setPlayers(
                players.map((player) => (player.id === id ? { ...player, ...updatedPlayer } : player))
            );
            setEditingPlayer(null);
        } catch (error) {
            console.error('Error updating player:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUpdatedPlayer({ ...updatedPlayer, [name]: value });
    };

    return (
        <div>
            <h2>Player List</h2>
            <ul>
                {players.map((player) => (
                    <li key={player.id}>
                        {editingPlayer === player.id ? (
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    value={updatedPlayer.name}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="surname"
                                    value={updatedPlayer.surname}
                                    onChange={handleChange}
                                />
                                <input
                                    type="number"
                                    name="seeding"
                                    value={updatedPlayer.seeding}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="bsa_bwf_number"
                                    value={updatedPlayer.bsa_bwf_number}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="country"
                                    value={updatedPlayer.country}
                                    onChange={handleChange}
                                />
                                <button onClick={() => handleUpdate(player.id)}>Update</button>
                                <button onClick={() => setEditingPlayer(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                {player.name} {player.surname} - {player.country} (Seeding: {player.seeding}, BSA/BWF Number: {player.bsa_bwf_number})
                                <button onClick={() => handleEdit(player)}>Edit</button>
                                <button onClick={() => handleDelete(player.id)}>Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlayerList;
