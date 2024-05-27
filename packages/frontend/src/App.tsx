import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AddTournament from './components/AddTournament';
import TournamentList from './components/TournamentList';
import ManageTournament from './components/ManageTournament';
import PlayerList from './components/PlayerList';
import AddPlayer from './components/AddPlayer';
import AddTeam from './components/AddTeam';
import Scoreboard from './components/Scoreboard';
import PlayerProfile from './components/PlayerProfile';

const App: React.FC = () => {
    return (
        <Router>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Tournament List</Link>
                    </li>
                    <li>
                        <Link to="/add-tournament">Add Tournament</Link>
                    </li>
                    <li>
                        <Link to="/players">Player List</Link>
                    </li>
                    <li>
                        <Link to="/add-player">Add Player</Link>
                    </li>
                    <li>
                        <Link to="/add-team">Add Team</Link>
                    </li>
                    <li>
                        <Link to="/scoreboard">Scoreboard</Link>
                    </li>
                    <li>
                        <Link to="/player-profile">Player Profile</Link>
                    </li>
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={<TournamentList />} />
                <Route path="/add-tournament" element={<AddTournament />} />
                <Route path="/tournaments/:tournament_id" element={<ManageTournament />} />
                <Route path="/players" element={<PlayerList />} />
                <Route path="/add-player" element={<AddPlayer />} />
                <Route path="/add-team" element={<AddTeam />} />
                <Route path="/scoreboard" element={<Scoreboard />} />
                <Route path="/player-profile" element={<PlayerProfile />} />
            </Routes>
        </Router>
    );
};

export default App;
