import axios from "axios";
import jwtDecode from "jwt-decode";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ILoginCloseModal {
  closeLoginModal: Function;
  setIsLoginSucceeded: Function;
}

function Login(props: ILoginCloseModal) {
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");

  const onLoginClicked = async () => {
    try {
      const response = await axios.post("http://localhost:8080/users/login", {
        username,
        password,
      });
      const serverResponse = response.data;
      let token = "Bearer " + serverResponse.token;
      axios.defaults.headers.common["Authorization"] = token;

      props.closeLoginModal();
      props.setIsLoginSucceeded(true);

    } catch (error: any) {
      alert(error.message);
    }
  };
  return (
    <div className="Login">
      <input
        type="text"
        placeholder="user name"
        onChange={(event) => setUsername(event.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="password"
        onChange={(event) => setPassword(event.target.value)}
      />
      <br />
      <input type="button" value="Login" onClick={onLoginClicked} />
      <input
        type="button"
        value="Cancel"
        onClick={() => props.closeLoginModal()}
      />
    </div>
  );
}
export default Login;
