import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Layout from "./components/Layout/Layout";
import axios from "axios";
import { ActionType } from "./redux/action-type";
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppState } from "./redux/app-state";

function App() {
  console.log("started");

  let dispatch = useDispatch();
  let isUserLoggedIn = useSelector((state: AppState) => state.isUserLoggedIn);
  let user = useSelector((state: AppState) => state.user);

  async function fetchCoupons() {
    try {
      const response = await axios.get("http://localhost:8080/coupons");
      const coupons = response.data;
      dispatch({ type: ActionType.GetCoupons, payload: coupons });
    } catch (error: any) {
      alert(error.response.data.errorMessage);
    }
  }

  async function fetchCategories() {
    try {
      const response = await axios.get("http://localhost:8080/categories");
      const categories = response.data;
      dispatch({ type: ActionType.GetCategories, payload: categories });
    } catch (error: any) {
      alert(error.response.data.errorMessage);
    }
  }

  async function fetchCopanies() {
    try {
      const response = await axios.get("http://localhost:8080/companies");
      const companies = response.data;
      dispatch({ type: ActionType.GetCompanies, payload: companies });
    } catch (error: any) {
      alert(error.response.data.errorMessage);
    }
  }

  useEffect(() => {
    if (!isUserLoggedIn) {
      fetchCoupons();
    }
    if (isUserLoggedIn && user.userType === "ADMIN") {
      fetchCopanies();
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
