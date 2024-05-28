import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ControlPanel from './components/ControlPanel';
import Display from './components/Display';
import { ScoreProvider } from './components/ScoreContext';

const App: React.FC = () => {
    return (
        <ScoreProvider>
            <Router>
                <nav>
                    <ul>

                    </ul>
                </nav>
                <Routes>
                    <Route path="/" element={<ControlPanel />} />
                    <Route path="/display" element={<Display />} />
                </Routes>
            </Router>
        </ScoreProvider>
    );
};

export default App;
