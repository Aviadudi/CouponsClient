import { useSelector } from "react-redux";
import "./UserSettings.css";
import { AppState } from "../../redux/app-state";
import { useState } from "react";
import { IUserData } from "../../models/IUserData";
import axios from "axios";

function UserSettings() {
  let user = useSelector((state: AppState) => state.user);
  let [newPassword, setNewPassword] = useState("");
  let [passwordType, setPasswordType] = useState("password");
  let [isValidPassword, setIsValidPassword] = useState<boolean>(false);
  let passwordPattern = useSelector((state: AppState) => state.passwordPattern);

  function onNewPasswordChanged(event: any) {
    let enteredNewPassword = event.target.value;
    if (passwordPattern.test(enteredNewPassword)) {
      setIsValidPassword(true);
    } else {
      setIsValidPassword(false);
    }
    setNewPassword(enteredNewPassword);
  }

  async function onSavePasswordClickd() {
    let editedUser: IUserData = user;
    editedUser = { ...editedUser, password: newPassword };
    let response = await saveEditedUser(editedUser);
    if (response?.status === 200) {
      alert("Password changed successfully");
      setNewPassword("");
    }
  }

  async function saveEditedUser(editedUser: IUserData) {
    try {
      const response = await axios.put(
        "http://localhost:8080/users",
        editedUser
      );
      return response;
    } catch (error: any) {
      alert(error.response.data.errorMessage);
    }
  }

  function onShowPasswordClicked() {
    if (passwordType == "text") {
      setPasswordType("password");
      return;
    }
    setPasswordType("text");
  }

  return (
    <div className="user-settings">
      <table>
        <tr>
          <td>
            <span className="new-password">New Password:</span>
          </td>
          <td>
            <input
              className="password-input"
              type={passwordType}
              placeholder="Enter new Password"
              value={newPassword}
              onChange={onNewPasswordChanged}
            />
            <button className="show-pass" onClick={onShowPasswordClicked}>
              <img
                src={require(`../../images/show-password-16.png`)}
                alt="show"
              />
            </button>
          </td>
          <td>
            <button className="save-btn" onClick={onSavePasswordClickd}>
              Save
            </button>
          </td>
        </tr>
        <tr>
          <td></td>
          {!isValidPassword && newPassword != "" && (
            <td>
              <p>
                • Password must be 8-12 characters long,
                <br />• one digit (0-9),
                <br />• one lowercase letter (a-z),
                <br />• one uppercase letter (A-Z)
              </p>
            </td>
          )}
        </tr>
      </table>
    </div>
  );
}
export default UserSettings;
