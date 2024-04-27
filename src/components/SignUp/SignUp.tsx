import axios from "axios";
import { useState } from "react";
import "./SignUp.css";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/app-state";

interface ISignUpModal {
  closeSignupModal: Function;
}

function SignUp(props: ISignUpModal) {
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [reEnteredPassword, setReEnteredPassword] = useState("");
  let [email, setEmail] = useState("");
  let [isPasswordsMatch, setIsPasswordsMatch] = useState(false);
  let [isValidPassword, setIsValidPassword] = useState(false);
  let passwordPattern = useSelector((state: AppState) => state.passwordPattern);

  function onPasswordChanged(event: any) {
    let enteredNewPassword = event.target.value;
    if (passwordPattern.test(enteredNewPassword)) {
      setIsValidPassword(true);
    } else {
      setIsValidPassword(false);
    }
    setPassword(enteredNewPassword);
  }

  const onSignupClicked = async () => {
    try {
      const response = await axios.post("http://localhost:8080/users", {
        username,
        password,
        email,
      });

      props.closeSignupModal();
    } catch (error: any) {
      alert(error.response.data.errorMessage);
    }
  };

  function onReEnteredPassword(event: any) {
    let reEnteredPassword = event.target.value;
    if (reEnteredPassword == password) {
      setIsPasswordsMatch(true);
    } else {
      setIsPasswordsMatch(false);
    }
    setReEnteredPassword(reEnteredPassword);
  }

  return (
    <div className="SignUp">
      <h3 className="signUp-header">Sign Up and start saving today!</h3>
      <table>
        <tr>
          <td>
            <input
              type="text"
              placeholder="User name"
              onChange={(event) => setUsername(event.target.value)}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              onChange={(event) => onPasswordChanged(event)}
            />
            <input
              type="password"
              placeholder="ReEnter Password"
              onChange={(event) => onReEnteredPassword(event)}
            />
            <br />
            <input
              type="email"
              placeholder="Email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </td>
          <td>
            {" "}
            {(!isValidPassword && password != "") && (
              <p className="password-requirements">
                • Password must be 8-12 characters long,
                <br />• one digit (0-9),
                <br />• one lowercase letter (a-z),
                <br />• one uppercase letter (A-Z)
              </p>
            )}
            {(isValidPassword && reEnteredPassword != "" && !isPasswordsMatch) &&(
              <p>• The passwords do not match</p>
            ) }
          </td>
          <br />
        </tr>
      </table>
      <button className="sign-up-btn" onClick={onSignupClicked}>
        Sign up
      </button>{" "}
      <br />
      <button className="close-btn" onClick={() => props.closeSignupModal()}>
        X
      </button>
    </div>
  );
}

export default SignUp;
