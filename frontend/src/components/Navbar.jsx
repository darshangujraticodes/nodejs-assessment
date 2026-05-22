import React from "react";
import { NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

const Navbar = () => {
  const { role, token, logout } = useAuth();

  const navigate = useNavigate();

  //logout function
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="container">
        <div className="navWrapper">
          <div className="menuWrapper">
            <ul>
              <li>
                <NavLink className="menuLink" to="/">
                  Home
                </NavLink>
              </li>

              {/* SHOW ONLY IF NOT LOGGED IN */}
              {!token && (
                <>
                  <li>
                    <NavLink className="menuLink" to="/login">
                      Login
                    </NavLink>
                  </li>

                  <li>
                    <NavLink className="menuLink" to="/register">
                      Register
                    </NavLink>
                  </li>
                </>
              )}

              {/* ONLY ADMIN */}
              {role === "admin" && (
                <li>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                </li>
              )}

              {/* 🔥 SHOW LOGOUT IF LOGGED IN */}
              {token && (
                <li>
                  <button className="menuLink" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
