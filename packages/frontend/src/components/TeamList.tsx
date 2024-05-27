import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TeamList: React.FC = () => {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/teams');
                setTeams(response.data);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        fetchTeams();
    }, []);

    return (
        <div>
            <h2>Team List</h2>
            <ul>
                {teams.map((team: any) => (
                    <li key={team.id}>{team.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default TeamList;
