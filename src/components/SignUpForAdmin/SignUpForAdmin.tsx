import { useState } from "react";
import { IUserData } from "../../models/IUserData";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/app-state";

interface SignUpForAdmin {
  closeSignupForAdminModal: Function;
}

function SignUpForAdmin(props: SignUpForAdmin) {
  let [newUser, setNewUser] = useState<IUserData>();
  let companies = useSelector((state:AppState) => state.companies);


  return (
    <div>
      <form>
        <h1>Create new user</h1>
        <label>
          User Name: <input type="text" required/>
        </label>
        <label>
          Password: <input type="password" required/>
        </label>
        <label>
          Email: <input type="email" required/>
        </label>
        <label>Company:</label>
      </form>
    </div>
  );
}
export default SignUpForAdmin;
