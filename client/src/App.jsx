import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Createrecipes from "./pages/Createrecipes";
import Savedrecipes from "./pages/Savedrecipes";
import Authentication from "./pages/Authentication";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/createrecipes" element={<Createrecipes />} />
          <Route path="/savedrecipes" element={<Savedrecipes />} />
          <Route path="/auth" element={<Authentication />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
