import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function Onboard(props) {
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  let { initiate, setGameStarted } = props;

  const startGame = () => {
    if (!username.trim()) {
      return alert("Please enter a username");
    }
    if (initiate) {
      navigate(`/game/${uuidv4()}`, {
        state: { initiate: initiate, username: username },
      });
    } else {
      setGameStarted(true);
    }
  };
  return (
    <>
      <input
        onChange={(e) => setUsername(e.target.value)}
        type="text"
        placeholder="Enter Username"
        className="border"
      />
      <button onClick={() => startGame()}>Start Game</button>
    </>
  );
}

export default Onboard;
