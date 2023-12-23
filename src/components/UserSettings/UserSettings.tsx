import { useSelector } from "react-redux";
import "./UserSettings.css";
import { AppState } from "../../redux/app-state";
import { useState } from "react";
import { IUserData } from "../../models/IUserData";
import axios from "axios";

function UserSettings() {
  let user = useSelector((state: AppState) => state.user);
  let [newPassword, setNewPassword] = useState("");

  function onNewPasswordChanged(event: any) {
    setNewPassword(event.target.value);
  }

  async function onSavePasswordClickd(event: any) {
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

  return (
    <div className="user-settings">
      <table>
        <tr>
          <td>New Password</td>
          <td>
            <input
              type="text"
              placeholder="Enter new Password"
              value={newPassword}
              onChange={onNewPasswordChanged}
            />
          </td>
          <td>
            <button onClick={onSavePasswordClickd}>Save</button>
          </td>
        </tr>
      </table>
    </div>
  );
}
export default UserSettings;
