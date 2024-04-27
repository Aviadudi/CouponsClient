import "./SignUpForAdmin.css";
import { useState } from "react";
import { IUserData } from "../../models/IUserData";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/app-state";
import axios from "axios";

interface SignUpForAdmin {
  closeSignupForAdminModal: Function;
}

function SignUpForAdmin(props: SignUpForAdmin) {
  let [newUser, setNewUser] = useState<IUserData>({
    id: 0,
    username: "",
    userType: "",
    email: "",
    password: "",
    companyId: 0,
  });
  let companies = useSelector((state: AppState) => state.companies);
  let usersTypes = ["ADMIN", "COMPANY", "CUSTOMER"];

  function onUserNameChanged(event: any) {
    setNewUser({ ...newUser, username: event.target.value });
  }
  function onPasswordChanged(event: any) {
    setNewUser({ ...newUser, password: event.target.value });
  }
  function onEmailChanged(event: any) {
    setNewUser({ ...newUser, email: event.target.value });
  }
  function onUserTypeChanged(event: any) {
    setNewUser({ ...newUser, userType: event.target.value });
    console.log(newUser);
  }
  function onCompanyChanged(event: any) {
    setNewUser({ ...newUser, companyId: +event.target.value });
  }

  async function onCreateNewUserClicked() {
    console.log(newUser);
    try {
      const response = await axios.post(
        "http://localhost:8080/users/admin",
        newUser
      );
      props.closeSignupForAdminModal(true);
    } catch (error: any) {
      alert(error.response.data.errorMessage);
    }
  }

  return (
    <div className="sign-up-for-admin">
      <button onClick={()=>props.closeSignupForAdminModal()}>X</button>
      <form>
        <h1>Create new user</h1>
        <label>
          User Name: <input type="text" required onChange={onUserNameChanged} />
        </label>
        <label>
          Password:{" "}
          <input type="password" required onChange={onPasswordChanged} />
        </label>
        <label>
          Email: <input type="email" required onChange={onEmailChanged} />
        </label>
        <label>User Type: </label>
        {usersTypes.map((usertype) => (
          <label className="user-type-radio">
            <input
              type="radio"
              value={usertype}
              required
              onChange={onUserTypeChanged}
              name="userType"
            />
            {usertype}
          </label>
        ))}
        <div className="company-select">
          {newUser.userType == "COMPANY" && (
            <div>
              <label>Company:</label>
              <select
                className="edit-company"
                name="companies"
                id="companies"
                onChange={onCompanyChanged}
              >
                <option value="" hidden selected disabled>
                  Company
                </option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          type="button"
          className="create-new-user-btn"
          onClick={onCreateNewUserClicked}
        >
          Create new user
        </button>
      </form>
    </div>
  );
}
export default SignUpForAdmin;
