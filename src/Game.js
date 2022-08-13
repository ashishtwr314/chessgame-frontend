import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import io from "socket.io-client";
import { Chess } from "chess.js";
import Chessboard from "chessboardjsx";
import { useRef, useState } from "react";
import Onboard from "./Onboard";

function Game() {
  const socket = io.connect("https://chessgame-backend.vercel.app");
  const [fen, setFen] = useState("start");
  const [gameStarted, setGameStarted] = useState(false);
  let params = useParams();
  let loc = useLocation();
  const chessRef = useRef(new Chess());
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
  }, [socket]);

  const handleDrop = (dropObj) => {
    let move = chessRef.current.move({
      from: dropObj.sourceSquare,
      to: dropObj.targetSquare,
    });

    if (move == null) return;
    socket.emit("peice_move", {
      room: params.gameId,
      fen: chessRef.current.fen(),
    });
    setFen(chessRef.current.fen());
  };

  return (
    <>
      {loc.state?.initiate ? (
        gameStarted ? (
          <>
            {chessRef.current.in_checkmate() && <h1>CheckMate</h1>}
            <Chessboard
              onDrop={(dropObj) => handleDrop(dropObj)}
              position={fen}
              orientation={playerColor}
            />
            <div>
              Turn: {chessRef.current.turn() === "w" ? "White" : "Black"}
            </div>
          </>
        ) : (
          <h1>WAit</h1>
        )
      ) : gameStarted ? (
        <>
          {chessRef.current.in_checkmate() && <h1>CheckMate</h1>}
          <Chessboard
            onDrop={(dropObj) => handleDrop(dropObj)}
            position={fen}
            orientation={playerColor}
          />
          <div>Turn: {chessRef.current.turn() === "w" ? "White" : "Black"}</div>
        </>
      ) : (
        <Onboard setGameStarted={setGameStarted} initiate={false} />
      )}
    </>
  );
}

// const ChessGame = ({ handleDrop, fen, playerColor, chessRef }) => {
//   return (

//   );
// };

export default Game;
