import React, { useEffect, useRef } from 'react';
import { useScoreContext } from './ScoreContext';
import Flag from 'react-flagkit';
import './Scoreboard.css';
import { getData } from 'country-list';

const countryCodes = getData().reduce((acc, country) => {
    acc[country.name] = country.code;
    return acc;
}, {} as { [key: string]: string });

const Display: React.FC = () => {
    const { player1, player2, scores, setScores, setPlayer1, setPlayer2 } = useScoreContext();
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:3001'); // Adjust the URL as needed

        ws.current.onopen = () => {
            console.log('WebSocket connection established');
        };

        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'update') {
                    setScores(data.scores);
                    setPlayer1(data.player1);
                    setPlayer2(data.player2);
                }
            } catch (e) {
                console.error('Error parsing message data:', e);
            }
        };

        return () => {
            ws.current?.close();
        };
    }, [setScores, setPlayer1, setPlayer2]);

    return (
        <div className="display-container">
            <div className="display-scoreboard">
                <div className="player-info">
                    <Flag country={countryCodes[player1.country] || 'ZA'} size={32} />
                    <span className="name">{player1.name || 'Player 1'}</span>
                    <div className="score-container">
                        {scores.map((score, index) => (
                            <span key={index} className="score">{score[0]}</span>
                        ))}
                    </div>
                </div>
                <div className="player-info">
                    <Flag country={countryCodes[player2.country] || 'ZA'} size={32} />
                    <span className="name">{player2.name || 'Player 2'}</span>
                    <div className="score-container">
                        {scores.map((score, index) => (
                            <span key={index} className="score">{score[1]}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Display;
