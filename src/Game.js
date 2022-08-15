import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import io from "socket.io-client";
import { Chess } from "chess.js";
import Chessboard from "chessboardjsx";
import { useRef, useState } from "react";
import Onboard from "./Onboard";

function Game() {
  const socket = io.connect("https://socket-server-chess.herokuapp.com");
  const [fen, setFen] = useState("start");
  const [gameStarted, setGameStarted] = useState(false);
  let params = useParams();
  let loc = useLocation();
  const chessRef = useRef(new Chess());
  /* eslint-disable no-unused-vars */
  const [playerColor, setPlayerColor] = useState(
    loc.state?.initiate ? "white" : "black"
  );

  // const sendMessage = () => {
  //   console.log(socket);
  //   socket.io.emit("join", params.id);
  // };

  // socket.on("no_of_users", (data) => {
  //   console.log(data);
  //   if (data >= 2) {
  //     setGameStarted(true);
  //   }
  // });

  // useEffect(() => {

  //   socket.on("no_of_users", (data) => {
  //     console.log(data);
  //     if (data >= 2) {
  //       setGameStarted(true);
  //     }
  //   });
  // }, []);

  useEffect(() => {
    socket.emit("join_room", params.gameId);
  }, [params, socket]);

  useEffect(() => {
    // socket.emit("join_room", params.gameId);
    socket.on("no_of_users", (data) => {
      console.log(data);
      if (data.roomsize >= 2 && loc.state?.username.trim()) {
        setGameStarted(true);
      }
    });
    socket.on("move", (data) => {
      console.log("MOVE", data);
      chessRef.current.load(data);
      setFen(data);
    });
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [socket]);

  const handleDrop = (dropObj) => {
    try {
      let move = chessRef.current.move({
        from: dropObj.sourceSquare,
        to: dropObj.targetSquare,
      });

      if (move == null) return;
      if (playerColor == "white" && move.color == "b") return;
      if (playerColor == "black" && move.color == "w") return;

      // if (move.color == "w" && !loc.state?.initiate) return;
      // if (move.color == "b" && loc.state?.initiate) return;

      socket.emit("peice_move", {
        room: params.gameId,
        fen: chessRef.current.fen(),
      });
      setFen(chessRef.current.fen());
    } catch (e) {
      alert(e);
    }
  };

  return (
    <>
      {loc.state?.initiate ? (
        gameStarted ? (
          <>
            {chessRef.current.in_checkmate() && <h1>CheckMate</h1>}
            <div className="chessboard">
              <Chessboard
                calcWidth={(e) => {
                  return e.screenWidth > 1000
                    ? e.screenWidth / 1.8
                    : e.screenWidth / 1.3;
                }}
                onDrop={(dropObj) => handleDrop(dropObj)}
                position={fen}
                orientation={playerColor}
              />
            </div>
            <div>
              Turn: {chessRef.current.turn() === "w" ? "White" : "Black"}
            </div>
          </>
        ) : (
          <WaitingScreen />
        )
      ) : gameStarted ? (
        <>
          {chessRef.current.in_checkmate() && <h1>CheckMate</h1>}
          <div className="chessboard">
            <Chessboard
              calcWidth={(e) => {
                return e.screenWidth > 1000
                  ? e.screenWidth / 1.8
                  : e.screenWidth / 1.3;
              }}
              onDrop={(dropObj) => handleDrop(dropObj)}
              position={fen}
              orientation={playerColor}
            />
          </div>
          <Turn turn={chessRef.current.turn()} />
        </>
      ) : (
        <Onboard setGameStarted={setGameStarted} initiate={false} />
      )}
    </>
  );
}

const WaitingScreen = () => {
  function copy() {
    const el = document.createElement("input");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }

  return (
    <div className="waiting-screen">
      <div>
        <h1>Waiting for the other player to join</h1>

        <div className="link-info">
          <input
            className="input-field link"
            disabled
            value={window.location.href}
          />
          <button onClick={copy} className="start-btn copy-btn">
            Copy
          </button>
        </div>
      </div>

      <div>
        <h3 className="fancy-showoff-text">
          Made with love{" "}
          <span style={{ display: "inline-block", marginBottom: "-10px" }}>
            ❣️
          </span>{" "}
          and Javascript By{" "}
          <a href="https://www.linkedin.com/in/ashishtwr314/">Ashish Tiwari</a>
        </h3>
      </div>
    </div>
  );
};

const Turn = ({ turn }) => {
  if (turn === "w") {
    return (
      <div className="turn">
        <span> Turn:</span> <span className="turn-color white"></span>
      </div>
    );
  } else {
    return (
      <div className="turn">
        Turn: <span className="turn-color black">White</span>
      </div>
    );
  }
};

export default Game;
