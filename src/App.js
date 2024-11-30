import "./App.css";
import Home from "./pages/Home.js";
import About from "./pages/About.js";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter basename="/AlphaDistWeb">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
