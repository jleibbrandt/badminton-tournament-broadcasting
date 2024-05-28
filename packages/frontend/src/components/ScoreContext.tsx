import React, { createContext, useContext, useState, useEffect } from 'react';

interface Player {
    name: string;
    country: string;
}

interface ScoreContextProps {
    player1: Player;
    setPlayer1: React.Dispatch<React.SetStateAction<Player>>;
    player2: Player;
    setPlayer2: React.Dispatch<React.SetStateAction<Player>>;
    scores: number[][];
    setScores: React.Dispatch<React.SetStateAction<number[][]>>;
}

const ScoreContext = createContext<ScoreContextProps | undefined>(undefined);

export const ScoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [player1, setPlayer1] = useState<Player>({ name: '', country: 'South Africa' });
    const [player2, setPlayer2] = useState<Player>({ name: '', country: 'South Africa' });
    const [scores, setScores] = useState<number[][]>([
        [0, 0],
        [0, 0],
        [0, 0],
    ]);

    useEffect(() => {
        const savedScores = localStorage.getItem('scores');
        if (savedScores) {
            setScores(JSON.parse(savedScores));
        }
        const savedPlayer1 = localStorage.getItem('player1');
        const savedPlayer2 = localStorage.getItem('player2');
        if (savedPlayer1) {
            setPlayer1(JSON.parse(savedPlayer1));
        }
        if (savedPlayer2) {
            setPlayer2(JSON.parse(savedPlayer2));
        }

        const handleStorageChange = () => {
            const updatedScores = localStorage.getItem('scores');
            if (updatedScores) {
                setScores(JSON.parse(updatedScores));
            }
            const updatedPlayer1 = localStorage.getItem('player1');
            const updatedPlayer2 = localStorage.getItem('player2');
            if (updatedPlayer1) {
                setPlayer1(JSON.parse(updatedPlayer1));
            }
            if (updatedPlayer2) {
                setPlayer2(JSON.parse(updatedPlayer2));
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <ScoreContext.Provider value={{ player1, setPlayer1, player2, setPlayer2, scores, setScores }}>
            {children}
        </ScoreContext.Provider>
    );
};

export const useScoreContext = () => {
    const context = useContext(ScoreContext);
    if (context === undefined) {
        throw new Error('useScoreContext must be used within a ScoreProvider');
    }
    return context;
};
