import React from "react";
import "../App.css";
import FrontImage from "../extras/FrontImage";
import Navbar from "../extras/NavBar/Navbar";
import ItemList from "../extras/ItemList";
import axios from "axios";
const Home = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-grow">
        <FrontImage />
      </div>
      <ItemList></ItemList>
    </div>
  );
};

export default Home;
