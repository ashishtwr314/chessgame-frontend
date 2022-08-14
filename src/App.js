import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./Game";
import Onboard from "./Onboard";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Onboard initiate={true} />} />
          <Route path="/game/:gameId" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
