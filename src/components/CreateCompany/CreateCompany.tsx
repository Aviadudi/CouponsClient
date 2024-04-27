import { useState } from "react";
import { ICompany } from "../../models/ICompany";
import axios from "axios";

interface ICreateCompany {
  closeCreateModal: Function;
  fetchCompanies:Function;
}
function CreateCompany(props: ICreateCompany) {
  let [company, setCompany] = useState<ICompany>({
    id: 0,
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  function onNameChanged(event: any) {
    setCompany({ ...company, name: event.target.value });
  }
  function onEmailChanged(event: any) {
    setCompany({ ...company, email: event.target.value });
  }
  function onAddressChanged(event: any) {
    setCompany({ ...company, address: event.target.value });
  }
  function onPhoneChanged(event: any) {
    setCompany({ ...company, phone: event.target.value });
  }

  async function onCreateClicked() {
    try {
      const response = await axios.post("http://localhost:8080/companies/", company);

      alert("The company has been successfully created");
      props.fetchCompanies();
      props.closeCreateModal(true);
    } catch (error: any) {
      alert(error.response.data.errorMessage);
    }
  }


  return (
    <div>
      <button onClick={() => props.closeCreateModal()}>X</button>
      <h1>Create Company</h1>
      <label>Company Name</label>
      <input
        type="text"
        placeholder="Enter company name"
        onChange={(event) => onNameChanged(event)}
      />
      <label>Email</label>
      <input
        type="text"
        placeholder="Enter email"
        onChange={(event) => onEmailChanged(event)}
      />
      <label>Address</label>
      <input
        type="text"
        placeholder="Enter address"
        onChange={(event) => onAddressChanged(event)}
      />
      <label>Phone</label>
      <input
        type="text"
        placeholder="Enter Phone"
        onChange={(event) => onPhoneChanged(event)}
      />
      <br />
      <button onClick={onCreateClicked}>Create</button>
    </div>
  );
}
export default CreateCompany;
