import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Layout from "./components/Layout/Layout";
import axios from "axios";
import { ActionType } from "./redux/action-type";
import { useEffect } from "react";
import { AppState } from "./redux/app-state";

function App() {
  console.log("started");

  let dispatch = useDispatch();
  let isUserLoggedIn = useSelector((state: AppState) => state.isUserLoggedIn);
  let user = useSelector((state: AppState) => state.user);

  async function fetchCategories() {
    try {
      const response = await axios.get("http://localhost:8080/categories");
      const categories = response.data;
      dispatch({ type: ActionType.GetCategories, payload: categories });
    } catch (error: any) {
      alert(error.response.data.errorMessage);
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

  async function getUserData() {
    try {
      const response = await axios.get("http://localhost:8080/users/byToken");
      let user = response.data;
      dispatch({ type: ActionType.ChangeUser, payload: user });
    } catch (error: any) {
      alert(error.response.data.errorMessage);
    }
  }

  useEffect(() => {
    let localStoredToken = localStorage.getItem("token");
    if(localStoredToken && isUserLoggedIn == false){
      axios.defaults.headers.common["Authorization"] = localStoredToken;
      getUserData();
      dispatch({ type: ActionType.SetUserLoggedIn, payload: true });
    }
    if (isUserLoggedIn && user.userType === "ADMIN") {
      fetchCompanies();
    }
    fetchCategories();
  }, [user]);

  return (
    <div className="App">
      <Layout />
    </div>
  );
}

export default App;
