import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CouponsContainer from "./components/CouponsContainer/CouponsContainer";
import AsideMenu from "./components/AsideMenu/AsideMenu";
import Layout from "./components/Layout/Layout";

function App() {
  return (
    <div className="App">
      <Layout/>
    </div>
  );
}

export default App;
