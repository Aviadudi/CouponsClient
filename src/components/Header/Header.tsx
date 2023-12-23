import { useState } from "react";
import "./Header.css";
import Modal from "react-modal";
import Login from "../Login/Login";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../redux/action-type";
import SignUp from "../SignUp/SignUp";
import { IUserData } from "../../models/IUserData";
import User from "../User/User";
import jwtDecode from "jwt-decode";
import { AppState } from "../../redux/app-state";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
    borderRadius: "45px",
    height: "270px",
  },
};
Modal.setAppElement("#root");

function Header() {
  let [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  let [isLoginSucceeded, setIsLoginSucceeded] = useState(false);
  let [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  let [isSignUpSucceeded, setIsSignUpSucceeded] = useState(false);
  let user = useSelector((state: AppState) => state.user);
  const navigate = useNavigate();

  let dispatch = useDispatch();

  function openLoginModal() {
    setIsLoginModalOpen(true);
  }

  function closeLoginModal() {
    setIsLoginModalOpen(false);
  }

  function openSignUpModal() {
    setIsSignUpModalOpen(true);
  }

  function closeSignUpModal() {
    setIsSignUpModalOpen(false);
  }

  function onLogoutClicked() {
    setIsLoginSucceeded(false);
    localStorage.removeItem("token");
    let user: IUserData = {
      id: 0,
      userType: "CUSTOMER",
      companyId: 0,
      username: "",
    };
    alert("You've logged out successfully");

    dispatch({ type: ActionType.ChangeUser, payload: user });
    dispatch({ type: ActionType.SetUserLoggedIn, payload: false });
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  }
  function showAllCoupons() {
    navigate("/");
    dispatch({ type: ActionType.FilterByCategory });
    dispatch({ type: ActionType.SetCategoryName, payload: "All coupons" });
  }

  function search(searchInput: string) {
    searchInput = searchInput.toLowerCase();
    dispatch({ type: ActionType.Search, payload: searchInput });
  }

  // function showUsername() {
  //   if (user.username != "") {
  //     return "Hi, " + user.username;
  //   } else {
  //     return "";
  //   }
  // }

  return (
    <section>
      {/* site name */}
      <button className="sitename" onClick={showAllCoupons}>
        Coupons
      </button>

      {/* search-bar */}
      <input
        type="text"
        className="search-bar"
        placeholder="Search coupons"
        onChange={(event) => search(event.target.value)}
      />

      {/* shows user name after successful login*/}
      {/* {<div className="user-name"> {showUsername()}</div>} */}

      {/* login button open modal with "Login" component */}
      {!isLoginSucceeded && (
        <button className="login-button" onClick={openLoginModal}>
          Login
        </button>
      )}

      {/* login modal */}
      <Modal
        isOpen={isLoginModalOpen}
        onRequestClose={closeLoginModal}
        style={customModalStyles}
      >
        <Login
          closeLoginModal={closeLoginModal}
          setIsLoginSucceeded={setIsLoginSucceeded}
        />
      </Modal>

      {/* SignUp button open modal with "SignUp" component */}
      {!isLoginSucceeded && (
        <button className="SignUp-button" onClick={openSignUpModal}>
          Sign up
        </button>
      )}

      {/* SignUp modal */}
      <Modal
        isOpen={isSignUpModalOpen}
        onRequestClose={closeSignUpModal}
        style={customModalStyles}
      >
        <SignUp closeSignupModal={closeSignUpModal} />
      </Modal>

      {isLoginSucceeded && (
        <div className="dropdown-userOptions">
          <button className="dropbtn">
            Hi, {user.username}{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 10"
              fill="none"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="#2667BB"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <div className="dropdown-content">
            {user.userType === "CUSTOMER" && (
              <div>
              <button
                className="dropbtn-option"
                onClick={() => navigate("/account/purchases")}
              >
                My purchases
              </button>
              <button className="dropbtn-option"
              onClick={()=>navigate("/account/settings")}>
                Settings
              </button>
              </div>
            )}
            {user.userType !== "CUSTOMER" && (
              <button
                className="dropbtn-option"
                onClick={() => navigate("/users")}
              >
                Users
              </button>
            )}
            <button className="dropbtn-option" onClick={onLogoutClicked}>
              Log out
            </button>
          </div>
        </div>
      )}
      {/* {isLoginSucceeded && (
        <button
          className="logout-button"
          onClick={onLogoutClicked}
        >
          Logout
        </button>
      )}
      {isLoginSucceeded && (
        <button
          className="my-purchases-button"
        onClick={()=>navigate('/purchases')}
        >
          My Purchases
        </button>
      )} */}
    </section>
  );
}
export default Header;
