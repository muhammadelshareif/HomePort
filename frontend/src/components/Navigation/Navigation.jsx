import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnchor } from "@fortawesome/free-solid-svg-icons";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className="navigation-container">
      <div className="nav-content">
        <NavLink to="/" className="logo-container">
          <FontAwesomeIcon icon={faAnchor} className="logo-icon" />
          <span className="logo-text">HomePort</span>
        </NavLink>

        <div className="nav-links">
          {sessionUser && (
            <NavLink to="/spots/new" className="create-spot-button">
              Create a New Spot
            </NavLink>
          )}
          {isLoaded && <ProfileButton user={sessionUser} />}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
