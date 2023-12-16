import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppState } from "../../redux/app-state";
import { ActionType } from "../../redux/action-type";
import "./Login.css";

interface ILoginModal {
  closeLoginModal: Function;
  setIsLoginSucceeded: Function;
}

function Login(props: ILoginModal) {
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let user = useSelector((state: AppState) => state.user);
  let dispatch = useDispatch();
  let [passwordType, setPasswordType] = useState("password");

  async function getUserData() {
    try {
      const response = await axios.get("http://localhost:8080/users/byToken");
      let user = response.data;
      dispatch({ type: ActionType.ChangeUser, payload: user });
    } catch (error: any) {
      alert(error.response.data.errorMessage);
    }
  }

  async function onLoginClicked (){
    try {
      const response = await axios.post("http://localhost:8080/users/login", {
        username,
        password,
      });
      const serverResponse = response.data;
      let token = "Bearer " + serverResponse;
      axios.defaults.headers.common["Authorization"] = token;
      localStorage.setItem("token", token);

      getUserData();
      props.closeLoginModal();
      props.setIsLoginSucceeded(true);
      dispatch({ type: ActionType.SetUserLoggedIn, payload: true });

      alert("You've logged in successfully")
    } catch (error: any) {
      alert(error.response.data.errorMessage);
    }
  };

  function handleOnShowPasswordClicked(){
    if(passwordType == "text"){
      setPasswordType("password");
      return;
    }
    setPasswordType("text");
  }

  return (
    <div className="Login">

        <h2 className="signUp-header">Log in</h2>

        <input
          type="text"
          placeholder="User name"
          onChange={(event) => setUsername(event.target.value)}
        />
        <br />
        <input
          type={passwordType}
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <button className="show-pass" onClick={handleOnShowPasswordClicked}><img src={require(`../../images/show-password-16.png`)} alt="show" /></button>
        <br />
        <button type="submit" className="login-btn" onClick={onLoginClicked}>
          Login
        </button>
        {/* <button className="cancel-btn"onClick={() => props.closeLoginModal()}>Cancel</button> */}
        <button className="close-btn" onClick={() => props.closeLoginModal()}>
          X
        </button>

    </div>
  );
}
export default Login;
