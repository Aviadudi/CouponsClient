import { useState } from "react";
import "./Header.css";
import Modal from "react-modal";
import Login from "../Login/Login";

const customLoginStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
Modal.setAppElement("#root");

function Header() {
  let [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  let [isLoginSucceeded, setIsLoginSucceeded] = useState(false);

  function openLoginModal() {
    setLoginModalIsOpen(true);
  }

  function closeLoginModal() {
    setLoginModalIsOpen(false);
  }

  return (
    <section className="header">
      {/* login button open modal with "Login" component */}
      {!isLoginSucceeded && (
        <button className="login-button" onClick={openLoginModal}>
          Login
        </button>
      )}
      {/* shows user name after successful login*/}
      {isLoginSucceeded && "username"}
      <Modal
        isOpen={loginModalIsOpen}
        onRequestClose={closeLoginModal}
        style={customLoginStyles}
      >
        <Login
          closeLoginModal={closeLoginModal}
          setIsLoginSucceeded={setIsLoginSucceeded}
        />
      </Modal>

      <div className="sitename">Coupon's Site</div>
      {/* <input type="text" className="search-bar" placeholder="Search" /> */}
    </section>
  );
}
export default Header;
