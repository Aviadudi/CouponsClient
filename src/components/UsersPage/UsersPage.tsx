import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/app-state";
import { error } from "console";
import { IUserData } from "../../models/IUserData";
import "./UsersPage.css";
import React from "react";
import { render } from "@testing-library/react";

function UsersPage() {
  let [users, setUsers] = useState<IUserData[]>([]);
  let currentUser = useSelector((state: AppState) => state.user);
  let isUserLoggedIn = useSelector((state: AppState) => state.isUserLoggedIn);
  let companies = useSelector((state: AppState) => state.companies);
  let [isEditing, setIsEditing] = useState(false);
  // let [editedUser, setEditedUser] = useState<IUserData>();
  let [editedName, setEditedName] = useState(currentUser.username);
  let [editedEmail, setEditedEmail] = useState(currentUser.email);
  let [editedPassword, setEditedPassword] = useState("");
  let [editedUserType, setEditedUserType] = useState(currentUser.userType);
  let [editedUser, setEditedUser] = useState<IUserData>({
    id: 0,
    username: "",
    userType: "",
    email: "",
    password: "",
    companyId: 0,
  });
  let [editBtnTxt, setEditBtnTxt] = useState("Edit");

  // let editedUser: IUserData = {
  //   id: 0,
  //   username: "",
  //   userType: "",
  //   email: "",
  //   password: "",
  //   companyId: 0,
  // };

  async function fetchUsers() {
    try {
      let response;
      if (currentUser.userType == "ADMIN") {
        response = await axios.get("http://localhost:8080/users");
      } else {
        response = await axios.get(
          "http://localhost:8080/users//byCompanyId?id=" + currentUser.companyId
        );
      }
      setUsers(response.data);
    } catch (error: any) {
      alert(error.response.data.errorMessage);
    }
  }

  function getCompanyName(companyId: number) {
    let company = companies.find((company) => company.id == companyId);
    return company?.name;
  }

  function handleEditClick(user: IUserData) {
    let editedUser = {
      id: user.id,
      userType: editedUserType,
      username: editedName,
      email: editedEmail,
      password: editedPassword,
      companyId: user.companyId,
    };
    setEditedUser(editedUser);
    changeEditingStatus();
    changeEditBtnTxt();
  }

  function changeEditBtnTxt() {
    if (editBtnTxt == "Edit") {
      setEditBtnTxt("Cancle");
      return;
    }
    setEditBtnTxt("Edit");
  }

  function changeEditingStatus() {
    if (isEditing == true) {
      setIsEditing(false);
      setEditedUser({...editedUser, id:0,});
      return;
    }
    setIsEditing(true);
  }

  function handleSave() {
    saveEditedUser();
    fetchUsers();
    setIsEditing(false);
  }

  function saveEditedUser() {}

  useEffect(() => {
    if (isUserLoggedIn) {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, []);

  return (
    <div>
      <table className="users-table">
        <tr>
          <td>Id</td>
          <td>User Name</td>
          <td>Email</td>
          <td>Company</td>
          <td>Type</td>
          <td></td>
        </tr>

        {users.map((user) => (
          <React.Fragment key={user.id}>
            <tr>
              <td className="id-column">{user.id}</td>
              <td className="username-column">{user.username}</td>
              <td className="email-column">{user.email}</td>
              <td className="company-column">
                {getCompanyName(user.companyId)}
              </td>
              <td>{user.userType}</td>
              <td>
                {editedUser?.id !== user.id && <button onClick={() => handleEditClick(user)}>
                  {"Edit"}
                </button>}
              </td>
            </tr>
            {isEditing && editedUser?.id === user.id && (
              <tr className="editing-row">
                <td></td>
                <td className="input-username">
                  <input
                    className="input-username"
                    type="text"
                    defaultValue={user.username}
                    onChange={(username) =>
                      setEditedName(username.target.value)
                    }
                  />
                </td>
                <td className="input-username">
                  <input
                    className="input-email"
                    type="text"
                    defaultValue={user.email}
                    onChange={(email) => setEditedEmail(email.target.value)}
                  />
                </td>
                <td></td>
                <td></td>
                <td>
                  <button onClick={handleSave}>Save</button>
                  <button onClick={changeEditingStatus}>Cencle</button>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </table>
    </div>
  );
}
export default UsersPage;
