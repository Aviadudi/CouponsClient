import "./CompaniesPage.css";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../redux/app-state";
import { useEffect, useState } from "react";
import { ICompany } from "../../models/ICompany";
import React from "react";
import axios from "axios";
import { ActionType } from "../../redux/action-type";
import Modal from "react-modal";
import CreateCompany from "../CreateCompany/CreateCompany";

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
    borderRadius: "45px",
    height: "370px",
  },
};

function CompaniesPage() {
  let dispatch = useDispatch();
  let companies = useSelector((state: AppState) => state.companies);
  let user = useSelector((state: AppState) => state.user);
  let [isAdmin, setIsAdmin] = useState<boolean>(false);
  let [isEditing, setIsEditing] = useState<boolean>(false);
  let [isEdited, setIsEdited] = useState<boolean>(false);
  let [editedCompany, setEditedCompany] = useState<ICompany>({
    id: 0,
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  let [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  function onEditClick(company: ICompany) {
    setEditedCompany(company);
    setIsEditing(true);
  }

  function onNameChanged(event: any) {
    setEditedCompany({ ...editedCompany, name: event.target.value });
    setIsEdited(true);
  }

  function onEmailChanged(event: any) {
    setEditedCompany({ ...editedCompany, email: event.target.value });
    setIsEdited(true);
  }

  function onAddressChanged(event: any) {
    setEditedCompany({ ...editedCompany, address: event.target.value });
    setIsEdited(true);
  }

  function onPhoneChanged(event: any) {
    setEditedCompany({ ...editedCompany, phone: event.target.value });
    setIsEdited(true);
  }

  function onCloseEditClicked(confirm?: boolean) {
    if (confirm || !isEdited) {
      setIsEditing(false);
      setIsEdited(false);
    }
    else if (isEdited) {
      let confirmClose = window.confirm(
        "Are you sure you want to close this window? all the information will be deleted"
      );
      if (confirmClose == true) {
        setIsEditing(false);
        setIsEdited(false);
      }
    }
  }

  async function onSaveClickd() {
    try {
      const response = await axios.put(
        "http://localhost:8080/companies",
        editedCompany
      );
      alert("The company has been successfully edited");
      fetchCompanies();
      onCloseEditClicked(true);
    } catch (error: any) {
      alert(error.response.data.errorMessage);
    }
  }

  function onCreateCompanyClicked() {
    setIsCreateModalOpen(true);
  }

  function closeCreateModal(confirm?: boolean) {
    if (confirm) {
      setIsCreateModalOpen(false);
    } else {
      confirm = window.confirm("Are you sure you want to exit?");
      if (confirm) {
        setIsCreateModalOpen(false);
      }
    }
  }

  async function fetchCompanies() {
    try {
      const response = await axios.get("http://localhost:8080/companies");
      const companies = response.data;
      dispatch({ type: ActionType.GetCompanies, payload: companies });
    } catch (error: any) {
      alert(error.response.data.errorMessage);
    }
  }

  useEffect(() => {
    if (user.userType == "ADMIN") {
      setIsAdmin(true);
    }
  });

  return (
    <div>
      <button className="create-btn" onClick={onCreateCompanyClicked}>Create Company</button>
      <table className="companies-page">
        <tr className="companies-table-header">
          <td>Id</td>
          <td>Company Name</td>
          <td>Email</td>
          <td>Address</td>
          <td>Phone</td>
          <td></td>
        </tr>

        {companies.map((company) => (
          <React.Fragment key={company.id}>
            <tr>
              <td>{company.id}</td>
              <td>{company.name}</td>
              <td>{company.email}</td>
              <td>{company.address}</td>
              <td>{company.phone}</td>
              {isAdmin && (
                <td>
                  <button className="edit-btn" onClick={() => onEditClick(company)}>Edit</button>
                </td>
              )}
            </tr>
            {isEditing && company.id == editedCompany?.id && (
              <tr>
                <td></td>
                <td>
                  <input
                    className="input-name"
                    type="text"
                    value={editedCompany.name}
                    onChange={(event) => onNameChanged(event)}
                  />
                </td>
                <td>
                  <input
                    className="input-email"
                    type="text"
                    value={editedCompany.email}
                    onChange={(event) => onEmailChanged(event)}
                  />
                </td>
                <td>
                  <input
                    className="input-address"
                    type="text"
                    value={editedCompany.address}
                    onChange={(event) => onAddressChanged(event)}
                  />
                </td>
                <td>
                  <input
                    className="input-phone"
                    type="text"
                    value={editedCompany.phone}
                    onChange={(event) => onPhoneChanged(event)}
                  />
                </td>
                <td>
                  <button className="save-btn" onClick={onSaveClickd}>save</button>
                  <button className="cancel-btn" onClick={() => onCloseEditClicked()}>cancel</button>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </table>

      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={() => closeCreateModal}
        style={customModalStyles}
      >
        <CreateCompany
          closeCreateModal={closeCreateModal}
          fetchCompanies={fetchCompanies}
        />
      </Modal>
    </div>
  );
}
export default CompaniesPage;
