import React, { useEffect, useState } from "react";
import { navbarStyles } from "../assets/dummyStyles.js";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Award, LogIn, LogOut, X, Menu } from "lucide-react";
import logo from '../assets/logo_embedded.svg'

const Navbar = ({ logoSrc }) => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setmenuOpen] = useState(false);

  //   use effect hook to change the login state
  useEffect(() => {
    try {
      const u = localStorage.getItem("authToken");
      setLoggedIn(!!u);
    } catch (e) {
      setLoggedIn(false);
    }

    const handler = (ev) => {
      const detailUser = ev?.detail?.user ?? null;
      setLoggedIn(!!detailUser);
    };
    window.addEventListener("authChanged", handler);

    return () => window.removeEventListener("authChanged", handler);
  }, []);
  // Logout function
  const handleLogout = () => {
    try {
      localStorage.removeItem("authtoken");
      localStorage.clear();
    } catch (error) {}
    window.dispatchEvent(
      new CustomEvent("authChanged", { detail: { user: null } })
    );
    setmenuOpen(false);
    try {
      navigate("/login");
    } catch (error) {
      window.location.href = "/login";
    }
  };
  return (
    <nav className={navbarStyles.nav}>
      <div
        style={{
          backgroundImage: navbarStyles.decorativePatternBackground,
        }}
        className={navbarStyles.decorativePattern}
      ></div>
      <div className={navbarStyles.bubble1}></div>
      <div className={navbarStyles.bubble2}></div>
      <div className={navbarStyles.bubble3}></div>
      <div className={navbarStyles.container}>
        <div className={navbarStyles.logoContainer}>
          <Link to="/" className={navbarStyles.logoButton}>
            <div className={navbarStyles.logoInner}>
              <img
                src={
                  logoSrc ||
                  logo
                }
                alt="QuizMaster logo"
                className={navbarStyles.logoImage}
              />
            </div>
          </Link>
        </div>
        <div className={navbarStyles.titleContainer}>
          <div className={navbarStyles.titleBackground}>
            <h1 className={navbarStyles.titleText}>APlus Learnings</h1>
          </div>
        </div>

        <div className={navbarStyles.desktopButtonsContainer}>
          <NavLink to="/result" className={navbarStyles.resultsButton}>
            <Award className={navbarStyles.buttonIcon} />
            My Result
          </NavLink>
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className={navbarStyles.logoutButton}
            >
              <LogOut className={navbarStyles.buttonIcon} />
              Logout
            </button>
          ) : (
            <NavLink to="/login" className={navbarStyles.loginButton}>
              <LogIn className={navbarStyles.buttonIcon} />
              Login
            </NavLink>
          )}
        </div>
        <div className={navbarStyles.mobileMenuContainer}>
          <button
            onClick={() => setmenuOpen((s) => !s)}
            className={navbarStyles.menuToggleButton}
          >
            {menuOpen ? (
              <X className={navbarStyles.menuIcon} />
            ) : (
              <Menu className={navbarStyles.menuIcon} />
            )}
          </button>
        </div>
        {menuOpen && (
          <div className={navbarStyles.mobileMenuPanel}>
            <ul className={navbarStyles.mobileMenuList}>
              <li>
                <NavLink
                  className={navbarStyles.mobileMenuItem}
                  to="/result"
                  onClick={() => setmenuOpen(false)}
                >
                  <Award className={navbarStyles.mobileMenuIcon} />
                  My Result
                </NavLink>
              </li>
              {loggedIn ? (
                <li>
                  <button
                    className={navbarStyles.mobileMenuItem}
                    type="button"
                    onClick={handleLogout}
                  >
                    <LogOut className={navbarStyles.mobileMenuIcon} />
                  </button>
                </li>
              ) : (
                <li>
                  <NavLink
                    className={navbarStyles.mobileMenuItem}
                    to="/login"
                    onClick={() => setmenuOpen(false)}
                  >
                    <LogIn className={navbarStyles.mobileMenuIcon} /> Login
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      <style className={navbarStyles.animations}></style>
    </nav>
  );
};

export default Navbar;
