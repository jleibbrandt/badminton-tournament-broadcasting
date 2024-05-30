import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TournamentList: React.FC = () => {
  const [tournaments, setTournaments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/tournaments",
        );
        setTournaments(response.data);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      }
    };

    fetchTournaments();
  }, []);

  return (
    <div>
      <h2>Tournament List</h2>
      <ul>
        {tournaments.map((tournament: any) => (
          <li key={tournament.id}>
            {tournament.name} - {tournament.type}
            <button onClick={() => navigate(`/tournaments/${tournament.id}`)}>
              Manage
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TournamentList;
