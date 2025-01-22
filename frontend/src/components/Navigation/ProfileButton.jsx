// import { useState, useEffect, useRef } from "react";
// import { useDispatch } from "react-redux";
// import { FaUserCircle } from "react-icons/fa";
// import * as sessionActions from "../../store/session";
// import OpenModalButton from "../OpenModalButton";
// import LoginFormModal from "../LoginFormModal";
// import SignupFormModal from "../SignupFormModal";

// function ProfileButton({ user }) {
//   const dispatch = useDispatch();
//   const [showMenu, setShowMenu] = useState(false);
//   const ulRef = useRef();

//   const toggleMenu = (e) => {
//     e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
//     setShowMenu(!showMenu);
//   };

//   useEffect(() => {
//     if (!showMenu) return;

//     const closeMenu = (e) => {
//       if (!ulRef.current.contains(e.target)) {
//         setShowMenu(false);
//       }
//     };

//     document.addEventListener("click", closeMenu);

//     return () => document.removeEventListener("click", closeMenu);
//   }, [showMenu]);

//   const closeMenu = () => setShowMenu(false);

//   const logout = (e) => {
//     e.preventDefault();
//     dispatch(sessionActions.logout());
//     closeMenu();
//   };

//   const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

//   return (
//     <>
//       <button onClick={toggleMenu}>
//         <FaUserCircle />
//       </button>
//       <ul className={ulClassName} ref={ulRef}>
//         {user ? (
//           <>
//             <li>{user.username}</li>
//             <li>
//               {user.firstName} {user.lastName}
//             </li>
//             <li>{user.email}</li>
//             <li>
//               <button onClick={logout}>Log Out</button>
//             </li>
//           </>
//         ) : (
//           <>
//             <li>
//               <OpenModalButton
//                 buttonText="Log In"
//                 onButtonClick={closeMenu}
//                 modalComponent={<LoginFormModal />}
//               />
//             </li>
//             <li>
//               <OpenModalButton
//                 buttonText="Sign Up"
//                 onButtonClick={closeMenu}
//                 modalComponent={<SignupFormModal />}
//               />
//             </li>
//           </>
//         )}
//       </ul>
//     </>
//   );
// }

// export default ProfileButton;
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars } from "@fortawesome/free-solid-svg-icons";
import * as sessionActions from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import SpotManagement from "../SpotManagement";
import Reviews from "../Reviews";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
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
            <li>
              <OpenModalButton
                buttonText="Manage Spots"
                onButtonClick={closeMenu}
                modalComponent={<SpotManagement />}
                className="modal-button"
              />
            </li>
            <li>
              <OpenModalButton
                buttonText="Manage Reviews"
                onButtonClick={closeMenu}
                modalComponent={<Reviews />}
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
