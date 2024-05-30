import React, { useEffect, useRef } from "react";
import { useScoreContext } from "./ScoreContext";
import Flag from "react-flagkit";
import "./ControlPanel.css";
import { getData } from "country-list";

const countryCodes = getData().reduce(
  (acc, country) => {
    acc[country.name] = country.code;
    return acc;
  },
  {} as { [key: string]: string },
);

const ControlPanel: React.FC = () => {
  const { player1, setPlayer1, player2, setPlayer2, scores, setScores } =
    useScoreContext();
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3001"); // Adjust the URL as needed

    ws.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "update") {
          setScores(data.scores);
          setPlayer1(data.player1);
          setPlayer2(data.player2);
        }
      } catch (e) {
        console.error("Error parsing message data:", e);
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [setScores, setPlayer1, setPlayer2]);

  const sendUpdate = (data: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  };

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    player: number,
  ) => {
    const { name, value } = e.target;
    if (player === 1) {
      const updatedPlayer1 = { ...player1, [name]: value };
      setPlayer1(updatedPlayer1);
      localStorage.setItem("player1", JSON.stringify(updatedPlayer1));
      sendUpdate({ type: "update", player1: updatedPlayer1, player2, scores });
    } else {
      const updatedPlayer2 = { ...player2, [name]: value };
      setPlayer2(updatedPlayer2);
      localStorage.setItem("player2", JSON.stringify(updatedPlayer2));
      sendUpdate({ type: "update", player1, player2: updatedPlayer2, scores });
    }
  };

  const handleCountryChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    player: number,
  ) => {
    const { value } = e.target;
    if (player === 1) {
      const updatedPlayer1 = { ...player1, country: value };
      setPlayer1(updatedPlayer1);
      localStorage.setItem("player1", JSON.stringify(updatedPlayer1));
      sendUpdate({ type: "update", player1: updatedPlayer1, player2, scores });
    } else {
      const updatedPlayer2 = { ...player2, country: value };
      setPlayer2(updatedPlayer2);
      localStorage.setItem("player2", JSON.stringify(updatedPlayer2));
      sendUpdate({ type: "update", player1, player2: updatedPlayer2, scores });
    }
  };

  const handleScoreChange = (
    boardIndex: number,
    playerIndex: number,
    increment: boolean,
  ) => {
    const newScores = [...scores];
    newScores[boardIndex][playerIndex] = increment
      ? newScores[boardIndex][playerIndex] + 1
      : newScores[boardIndex][playerIndex] - 1;
    setScores(newScores);
    localStorage.setItem("scores", JSON.stringify(newScores));
    sendUpdate({ type: "update", player1, player2, scores: newScores });
  };

  const handleResetScores = (boardIndex: number) => {
    const newScores = [...scores];
    newScores[boardIndex] = [0, 0];
    setScores(newScores);
    localStorage.setItem("scores", JSON.stringify(newScores));
    sendUpdate({ type: "update", player1, player2, scores: newScores });
  };

  return (
    <div className="control-panel">
      <div className="player-info">
        <h3>Player Information</h3>
        <div>
          <label>
            Player 1 Name:
            <input
              type="text"
              name="name"
              value={player1.name}
              onChange={(e) => handleNameChange(e, 1)}
            />
          </label>
          <label>
            Country:
            <select
              value={player1.country}
              onChange={(e) => handleCountryChange(e, 1)}
            >
              {Object.keys(countryCodes).map((countryName) => (
                <option key={countryCodes[countryName]} value={countryName}>
                  {countryName}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Player 2 Name:
            <input
              type="text"
              name="name"
              value={player2.name}
              onChange={(e) => handleNameChange(e, 2)}
            />
          </label>
          <label>
            Country:
            <select
              value={player2.country}
              onChange={(e) => handleCountryChange(e, 2)}
            >
              {Object.keys(countryCodes).map((countryName) => (
                <option key={countryCodes[countryName]} value={countryName}>
                  {countryName}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="scoreboards">
        {scores.map((score, boardIndex) => (
          <div key={boardIndex} className="scoreboard">
            <h4>Game {boardIndex + 1}</h4>
            <div className="scoreboard-header">
              <div className="player">
                <Flag
                  country={countryCodes[player1.country] || "ZA"}
                  size={32}
                />
                <span className="name">{player1.name || "Player 1"}</span>
                <div className="score-container">
                  <div className="score">{score[0]}</div>
                  <div className="controls">
                    <button
                      onClick={() => handleScoreChange(boardIndex, 0, true)}
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleScoreChange(boardIndex, 0, false)}
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="scoreboard-header">
              <div className="player">
                <Flag
                  country={countryCodes[player2.country] || "ZA"}
                  size={32}
                />
                <span className="name">{player2.name || "Player 2"}</span>
                <div className="score-container">
                  <div className="score">{score[1]}</div>
                  <div className="controls">
                    <button
                      onClick={() => handleScoreChange(boardIndex, 1, true)}
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleScoreChange(boardIndex, 1, false)}
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={() => handleResetScores(boardIndex)}>Reset</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ControlPanel;
