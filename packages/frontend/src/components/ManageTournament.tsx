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

interface Score {
    match_id: number;
    game_number: number;
    player_bsa_bwf_number: string;
    score: number;
}

const Scoreboard: React.FC = () => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [selectedTournament, setSelectedTournament] = useState<number | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
    const [gameScores, setGameScores] = useState<{ [game: number]: { [key: string]: number } }>({});
    const [currentGame, setCurrentGame] = useState<number>(1);
    const [servingPlayer, setServingPlayer] = useState<string | null>(null);
    const [gameWinners, setGameWinners] = useState<{ [game: number]: string }>({});
    const [matchWinner, setMatchWinner] = useState<string | null>(null);
    const [currentMatchId, setCurrentMatchId] = useState<number | null>(null);

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
        setGameScores((prevGameScores) => {
            const currentGameScores = prevGameScores[currentGame] ?? {};
            const currentScore = currentGameScores[player] ?? 0;
            const newScore = increment ? currentScore + 1 : currentScore - 1;
            const updatedGameScores = {
                ...prevGameScores,
                [currentGame]: {
                    ...currentGameScores,
                    [player]: Math.max(newScore, 0),
                },
            };

            // Check for win conditions
            checkForGameWinner(updatedGameScores);

            return updatedGameScores;
        });

        // Set serving player to the player who scored
        if (increment) {
            setServingPlayer(player);
        }
    };

    const checkForGameWinner = (updatedGameScores: { [game: number]: { [key: string]: number } }) => {
        const currentGameScores = updatedGameScores[currentGame] ?? {};
        const player1Score = currentGameScores[selectedPlayers[0]] ?? 0;
        const player2Score = currentGameScores[selectedPlayers[1]] ?? 0;

        if (player1Score >= 21 && player1Score >= player2Score + 2) {
            handleGameWin(selectedPlayers[0]);
        } else if (player2Score >= 21 && player2Score >= player1Score + 2) {
            handleGameWin(selectedPlayers[1]);
        } else if (player1Score === 30 || player2Score === 30) {
            handleGameWin(player1Score === 30 ? selectedPlayers[0] : selectedPlayers[1]);
        }
    };

    const handleGameWin = (winner: string) => {
        setGameWinners((prevWinners) => {
            const newWinners = { ...prevWinners, [currentGame]: winner };
            const winnerCounts = {
                [selectedPlayers[0]]: Object.values(newWinners).filter((w) => w === selectedPlayers[0]).length,
                [selectedPlayers[1]]: Object.values(newWinners).filter((w) => w === selectedPlayers[1]).length,
            };

            if (winnerCounts[winner] === 2) {
                setMatchWinner(winner);
                alert(`${players.find((p) => p.bsa_bwf_number === winner)?.name} wins the match!`);
            } else {
                // Move to the next game if the winner hasn't won two games yet
                setCurrentGame((prevGame) => prevGame + 1);
                setServingPlayer(null); // Reset serving player for the next game
            }
            return newWinners;
        });
    };

    const handlePlayerSelect = (index: number, bsa_bwf_number: string) => {
        const newSelectedPlayers = [...selectedPlayers];
        newSelectedPlayers[index] = bsa_bwf_number;
        setSelectedPlayers(newSelectedPlayers);
        setGameScores({}); // Reset game scores when players are selected
        setCurrentGame(1); // Reset to the first game
        setServingPlayer(null); // Reset serving player
        setGameWinners({}); // Reset game winners
        setMatchWinner(null); // Reset match winner
    };

    const handleStartMatch = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/tournaments/:tournament_id/matches', {
                tournament_id: selectedTournament,
                player1: selectedPlayers[0],
                player2: selectedPlayers[1],
            });
            setCurrentMatchId(response.data.match_id);
        } catch (error) {
            console.error('Error starting match:', error);
        }
    };

    useEffect(() => {
        if (currentMatchId !== null) {
            const fetchScores = async () => {
                try {
                    const response = await axios.get(`http://localhost:3001/api/tournaments/:tournament_id/matches/${currentMatchId}/scores`);
                    const scores = response.data.reduce((acc: any, score: Score) => {
                        if (!acc[score.game_number]) acc[score.game_number] = {};
                        acc[score.game_number][score.player_bsa_bwf_number] = score.score;
                        return acc;
                    }, {});
                    setGameScores(scores);
                } catch (error) {
                    console.error('Error fetching scores:', error);
                }
            };

            fetchScores();
        }
    }, [currentMatchId]);

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
                    <button onClick={handleStartMatch}>Start Match</button>
                </div>
            )}

            {selectedPlayers.length > 0 && (
                <div>
                    {[1, 2, 3].map((game) => (
                        <div key={game} style={{ color: currentGame === game ? 'black' : 'grey' }}>
                            <h3>Game {game} Scores</h3>
                            {selectedPlayers.map((player) => (
                                <div key={player}>
                                    <p>
                                        {players.find((p) => p.bsa_bwf_number === player)?.name} {players.find((p) => p.bsa_bwf_number === player)?.surname} {servingPlayer === player ? '*' : ''}
                                        <button onClick={() => handleScoreChange(player, true)} disabled={game !== currentGame || !!gameWinners[game]}>+</button>
                                        <span>{(gameScores[game]?.[player] ?? 0).toString()}</span>
                                        <button onClick={() => handleScoreChange(player, false)} disabled={game !== currentGame || !!gameWinners[game]}>-</button>
                                    </p>
                                </div>
                            ))}
                            {gameWinners[game] && (
                                <div>
                                    <h3>Game {game} Winner: {players.find((p) => p.bsa_bwf_number === gameWinners[game])?.name}</h3>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {matchWinner && (
                <div>
                    <h2>Match Winner: {players.find((p) => p.bsa_bwf_number === matchWinner)?.name}</h2>
                </div>
            )}
        </div>
    );
};

export default Scoreboard;
