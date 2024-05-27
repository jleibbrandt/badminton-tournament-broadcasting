import React, { useEffect, useState } from 'react';

const Scoreboard: React.FC = () => {
    const [score, setScore] = useState({ player1: 0, player2: 0 });

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3001');
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setScore(data.score);
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <div>
            <h2>Scoreboard</h2>
            <p>Player 1: {score.player1}</p>
            <p>Player 2: {score.player2}</p>
        </div>
    );
};

export default Scoreboard;
