import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars } from "@fortawesome/free-solid-svg-icons";
import * as sessionActions from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;
    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const handleManageSpots = () => {
    history.push("/spots/manage");
    closeMenu();
  };

  const handleManageReviews = () => {
    alert("Feature coming soon!");
    closeMenu();
  };

  return (
    <div className="profile-container">
      <button onClick={toggleMenu} className="profile-button">
        <FontAwesomeIcon icon={faBars} className="menu-icon" />
        <FontAwesomeIcon icon={faUser} className="profile-icon" />
      </button>
      <ul
        className={`profile-dropdown${showMenu ? "" : " hidden"}`}
        ref={ulRef}
      >
        {user ? (
          <>
            <li>Hello, {user.firstName}</li>
            <li>{user.email}</li>
            <li>
              <button onClick={handleManageSpots}>Manage Spots</button>
            </li>
            <li>
              <button onClick={handleManageReviews}>Manage Reviews</button>
            </li>
            <li>
              <button onClick={logout} className="logout-button">
                Log Out
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <OpenModalButton
                buttonText="Log In"
                onButtonClick={closeMenu}
                modalComponent={<LoginFormModal />}
                className="modal-button"
              />
            </li>
            <li>
              <OpenModalButton
                buttonText="Sign Up"
                onButtonClick={closeMenu}
                modalComponent={<SignupFormModal />}
                className="modal-button"
              />
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;
