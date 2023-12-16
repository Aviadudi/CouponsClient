import axios from "axios";
import { useState } from "react";
import "./SignUp.css";

interface ISignUpModal {
  closeSignupModal: Function;
}

function SignUp(props: ISignUpModal) {
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [reEnteredPassword, setReEnteredPassword] = useState("");
  let [email, setEmail] = useState("");
  let [isPasswordsMatch, setIsPasswordsMatch] = useState(true);

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

  function onPasswordChanged() {}

  function onReEnteredPassword() {
    if (reEnteredPassword != password) {
      setIsPasswordsMatch(false);
    } else {
      setIsPasswordsMatch(true);
    }
  }

  return (
    <div className="SignUp">
      <h2 className="signUp-header">Sign Up and start saving today!</h2>
      <input
        type="text"
        placeholder="User name"
        onChange={(event) => setUsername(event.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        onChange={(event) => setPassword(event.target.value)}
      />
      <br />
      <input
        type="email"
        placeholder="Email"
        onChange={(event) => setEmail(event.target.value)}
      />
      <br />
      <button className = "sign-up-btn" onClick={onSignupClicked}>Sign up</button> <br />
      {/* <button className = "cancel-btn" onClick={() => props.closeSignupModal()}>Cancel</button> */}
      <button className = "close-btn"onClick={()=>props.closeSignupModal()}>X</button>
    </div>
  );
}

export default SignUp;
