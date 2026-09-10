import "./App.css";
import React from "react";
import NavBar from "./Navbar";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Routes from "./Routes";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <NavBar />
                <Routes />
            </BrowserRouter>
        </div>
    );
}

export default App;
