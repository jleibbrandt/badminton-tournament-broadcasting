import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Player {
    bsa_bwf_number: string;
    name: string;
    surname: string;
    country: string;
    seeding: number;
}

interface Tournament {
    id: number;
    name: string;
    type: string;
}

const Scoreboard: React.FC = () => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [selectedTournament, setSelectedTournament] = useState<number | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
    const [scores, setScores] = useState<{ [key: string]: number }>({});
    const [servingPlayer, setServingPlayer] = useState<string | null>(null);

    useEffect(() => {
        // Fetch tournaments
        const fetchTournaments = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/tournaments');
                setTournaments(response.data);
            } catch (error) {
                console.error('Error fetching tournaments:', error);
            }
        };

        fetchTournaments();
    }, []);

    useEffect(() => {
        if (selectedTournament !== null) {
            // Fetch players for the selected tournament
            const fetchPlayers = async () => {
                try {
                    const response = await axios.get(`http://localhost:3001/api/tournaments/${selectedTournament}/players`);
                    setPlayers(response.data);
                } catch (error) {
                    console.error('Error fetching players:', error);
                }
            };

            fetchPlayers();
        }
    }, [selectedTournament]);

    const handleScoreChange = (player: string, increment: boolean) => {
        setScores((prevScores) => {
            const newScore = prevScores[player] + (increment ? 1 : -1);
            return { ...prevScores, [player]: Math.max(newScore, 0) };
        });

        // Set serving player to the player who scored
        if (increment) {
            setServingPlayer(player);
        }
    };

    const handlePlayerSelect = (index: number, bsa_bwf_number: string) => {
        const newSelectedPlayers = [...selectedPlayers];
        newSelectedPlayers[index] = bsa_bwf_number;
        setSelectedPlayers(newSelectedPlayers);
    };

    return (
        <div>
            <h2>Scoreboard</h2>
            <div>
                <label htmlFor="tournamentSelect">Select Tournament:</label>
                <select
                    id="tournamentSelect"
                    onChange={(e) => setSelectedTournament(Number(e.target.value))}
                    value={selectedTournament ?? ''}
                >
                    <option value="" disabled>Select a tournament</option>
                    {tournaments.map((tournament) => (
                        <option key={tournament.id} value={tournament.id}>
                            {tournament.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedTournament !== null && players.length > 0 && (
                <div>
                    <h3>Select Players</h3>
                    <div>
                        <label>Player 1:</label>
                        <select
                            onChange={(e) => handlePlayerSelect(0, e.target.value)}
                            value={selectedPlayers[0] ?? ''}
                        >
                            <option value="" disabled>Select Player 1</option>
                            {players.map((player) => (
                                <option key={player.bsa_bwf_number} value={player.bsa_bwf_number}>
                                    {player.name} {player.surname}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Player 2:</label>
                        <select
                            onChange={(e) => handlePlayerSelect(1, e.target.value)}
                            value={selectedPlayers[1] ?? ''}
                        >
                            <option value="" disabled>Select Player 2</option>
                            {players.map((player) => (
                                <option key={player.bsa_bwf_number} value={player.bsa_bwf_number}>
                                    {player.name} {player.surname}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {selectedPlayers.length > 0 && (
                <div>
                    <h3>Scores</h3>
                    {selectedPlayers.map((player) => (
                        <div key={player}>
                            <p>
                                {players.find((p) => p.bsa_bwf_number === player)?.name} {players.find((p) => p.bsa_bwf_number === player)?.surname} {servingPlayer === player ? '*' : ''}
                                <button onClick={() => handleScoreChange(player, true)}>+</button>
                                <span>{scores[player] ?? 0}</span>
                                <button onClick={() => handleScoreChange(player, false)}>-</button>
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Scoreboard;
