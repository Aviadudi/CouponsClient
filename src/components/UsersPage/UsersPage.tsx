import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/app-state";
import { IUserData } from "../../models/IUserData";
import "./UsersPage.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import SignUpForAdmin from "../SignUpForAdmin/SignUpForAdmin";

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
    borderRadius: "20px",
    height: "350px",
    width: "350px",
  },
};

function UsersPage() {
  const navigate = useNavigate();
  let [users, setUsers] = useState<IUserData[]>([]);
  let currentUser = useSelector((state: AppState) => state.user);
  let isUserLoggedIn = useSelector((state: AppState) => state.isUserLoggedIn);
  let companies = useSelector((state: AppState) => state.companies);
  let [isEditing, setIsEditing] = useState(false);
  let [isChangingPassword, setIsChangingPassword] = useState(false);
  let [editedUser, setEditedUser] = useState<IUserData>({
    id: 0,
    username: "",
    userType: "",
    email: "",
    password: "",
    companyId: 0,
  });
  let [isAdmin, setIsAdmin] = useState(false);
  let [isCompany, setIsCompany] = useState(false);
  let userTypes = ["ADMIN", "COMPANY", "CUSTOMER"];
  let [isCreatingNewUser, setIsCreatingNewUser] = useState(false);
  let [passwordType, setPasswordType] = useState("password");

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

  function onEditClick(user: IUserData) {
    console.log(editedUser);
    initializeEditedUserData("EDIT", user);
    setIsEditing(true);
    setIsChangingPassword(false);
    console.log(editedUser);
  }

  function onCancleClickd() {
    initializeEditedUserData();
    setIsEditing(false);
    setIsChangingPassword(false);
    setPasswordType("password");
  }

  function onChangePasswordClickd(user: IUserData) {
    initializeEditedUserData("EDIT", user);
    setIsChangingPassword(true);
    setIsEditing(false);
    console.log(editedUser);
  }

  function initializeEditedUserData(action?: string, user?: IUserData) {
    let initialEditedUser: IUserData;

    if (action == "EDIT" && user) {
      initialEditedUser = {
        id: user.id,
        userType: user.userType,
        username: user.username,
        email: user.email,
        password: "",
        companyId: user.companyId | 0,
      };
    } else {
      initialEditedUser = {
        id: 0,
        username: "",
        userType: "",
        email: "",
        password: "",
        companyId: 0,
      };
    }
    setEditedUser(initialEditedUser);
  }

  function onTypeChanged(event: any) {
    let userType: string = event.target.value;
    let companyId: number;
    if (event.target.value == "COMPANY") {
      companyId = companies[0].id;
    } else {
      companyId = 0;
    }
    setEditedUser({ ...editedUser, userType: userType, companyId: companyId });
  }

  function onUserNameChanged(event: any) {
    setEditedUser({ ...editedUser, username: event.target.value });
  }

  function onEmailChanged(event: any) {
    setEditedUser({ ...editedUser, email: event.target.value });
  }

  function onCompanyChanged(event: any) {
    setEditedUser({ ...editedUser, companyId: +event.target.value });
  }

  function onPasswordChanged(event: any) {
    setEditedUser({ ...editedUser, password: event.target.value });
  }

  function onSaveClickd() {
    saveEditedUser();
  }

  async function saveEditedUser() {
    try {
      const response = await axios.put(
        "http://localhost:8080/users",
        editedUser
      );

      if (response.status == 200) {
        onCancleClickd();
        alert("Password changed successfully!");
      }
    } catch (error: any) {
      alert(error.response.data.errorMessage);
    }
  }

  function closeSignupForAdminModal(confirm?: boolean) {
    if (confirm) {
      setIsCreatingNewUser(false);
    }
    let confirmCancel = window.confirm(
      "Are you sure you want to cancel creating new user?"
    );
    if (confirmCancel) {
      setIsCreatingNewUser(false);
    }
  }

  function onShowPasswordClicked() {
    if (passwordType == "text") {
      setPasswordType("password");
      return;
    }
    setPasswordType("text");
  }

  useEffect(() => {
    if (isUserLoggedIn) {
      fetchUsers();
    } else {
      setUsers([]);
      navigate("/");
    }
    if (currentUser.userType == userTypes[0]) {
      setIsAdmin(true);
    } else if (currentUser.userType == userTypes[1]) {
      setIsCompany(true);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [isEditing]);

  return (
    <div className="users-page">
      {isAdmin && (
        <button
          className="create-user-btn"
          onClick={() => setIsCreatingNewUser(true)}
        >
          Create new user
        </button>
      )}
      <table className="users-table">
        <tr className="users-table-header">
          <td>Id</td>
          <td>User Name</td>
          <td>Email</td>
          <td>Company</td>
          <td>Type</td>
          {isAdmin && <td></td>}
          {(isAdmin || isCompany) && <td></td>}
        </tr>

        {users.map((user) => (
          <React.Fragment key={user.id}>
            <tr>
              <td className="id-column">{user.id}</td>
              <td className="username-column">{user.username}</td>
              <td className="email-column">{user.email}</td>
              <td className="company-column">
                {user.companyId && getCompanyName(user.companyId)}
              </td>
              <td>{user.userType}</td>
              {isAdmin && (
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => onEditClick(user)}
                  >
                    Edit
                  </button>
                </td>
              )}
              <td>
                {(isAdmin || isCompany) && !isChangingPassword && (
                  <span>
                    <button
                      className="change-btn"
                      onClick={() => onChangePasswordClickd(user)}
                    >
                      Change Password
                    </button>
                  </span>
                )}
                {isChangingPassword && editedUser?.id === user.id && (
                  <div>
                    <input
                      type={passwordType}
                      placeholder="Enter new Password"
                      onChange={onPasswordChanged}
                    />
                    <button
                      className="show-pass"
                      onClick={onShowPasswordClicked}
                    >
                      <img
                        src={require(`../../images/show-password-16.png`)}
                        alt="show"
                      />
                    </button>

                    <br />
                    <button className="save-btn" onClick={onSaveClickd}>save</button>
                    <button className="cancel-btn" onClick={onCancleClickd}>cancel</button>
                  </div>
                )}
              </td>
            </tr>
            {isAdmin && isEditing && editedUser?.id === user.id && (
              <tr className="editing-row">
                <td></td>
                <td className="input-username">
                  <input
                    className="input-username"
                    type="text"
                    defaultValue={user.username}
                    onChange={onUserNameChanged}
                  />
                </td>
                <td className="input-username">
                  <input
                    className="input-email"
                    type="text"
                    defaultValue={user.email}
                    onChange={onEmailChanged}
                  />
                </td>
                <td>
                  {editedUser.userType == "COMPANY" && (
                    <select
                      className="edit-company"
                      name="companies"
                      id="companies"
                      value={editedUser.companyId}
                      onChange={onCompanyChanged}
                    >
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td>
                  <select
                    className="edit-user-type"
                    name="edit-type"
                    id="edit-type"
                    onChange={onTypeChanged}
                  >
                    <option
                      key={user.userType}
                      value={user.userType}
                      selected
                      hidden
                    >
                      {user.userType}
                    </option>
                    {userTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button className="save-btn" onClick={onSaveClickd}>
                    Save
                  </button>
                  <button className="cancel-btn" onClick={onCancleClickd}>
                    Cancel
                  </button>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </table>
      {/* SignUp modal */}
      <Modal
        isOpen={isCreatingNewUser}
        onRequestClose={() => closeSignupForAdminModal()}
        style={customModalStyles}
      >
        <SignUpForAdmin closeSignupForAdminModal={closeSignupForAdminModal} />
      </Modal>
    </div>
  );
}
export default UsersPage;
