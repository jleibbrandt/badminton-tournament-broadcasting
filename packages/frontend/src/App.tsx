import React from 'react';
import Scoreboard from './components/Scoreboard';
import PlayerProfile from './components/PlayerProfile';
import TournamentSetup from './components/TournamentSetup';

const App: React.FC = () => {
    return (
        <div>
            <TournamentSetup />
            <Scoreboard />
            <PlayerProfile />
        </div>
    );
};

export default App;
