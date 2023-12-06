import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Navbar = () => {
  return (
    <>
      <header className="App-header">
        <h1>
          <Link to="/">Logo</Link>
        </h1>
        <ul className="header-list">
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="service">Service</Link>
          </li>
          <li>
            <Link to="contact_us">Contact Us</Link>
          </li>
          <li>
            <Link to="login">Login</Link>
          </li>
        </ul>
      </header>
    </>
  );
};

export default Navbar;
