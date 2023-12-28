import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../redux/action-type";
import "./UpperMenu.css";
import { AppState } from "../../redux/app-state";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ICategory } from "../../models/ICategory";

function UpperMenu() {
  let dispatch = useDispatch();
  let allCoupons = useSelector((state: AppState) => state.allCoupons);
  let couponsToShow = useSelector(
    (state: AppState) => state.filteredCouponsToShow
  );
  let allCategories = useSelector((state: AppState) => state.categories);

  
  let Categories = useSelector((state: AppState) => state.categories);
  let navigate = useNavigate();


  function filterByCategory(category: ICategory) {
    dispatch({ type: ActionType.FilterByCategory, payload: category.id });
    dispatch({ type: ActionType.SetCategoryName, payload: category.name });
    dispatch({ type: ActionType.Search, payload: "" });
  }

  function showAllCoupons() {
    navigate("/");
    dispatch({ type: ActionType.GetCoupons, payload: allCoupons });
    dispatch({ type: ActionType.FilterByCategory, payload: -1 });
    dispatch({ type: ActionType.SetCategoryName, payload: "All Coupons" });
    dispatch({ type: ActionType.Search, payload: "" });

  }

  return (
    <div className="upper-menu">
      <button onClick={() => showAllCoupons()}>
        All Coupons
      </button>
      {Categories.map((category) => (
        <button onClick={() => filterByCategory(category)}>
          {category.name}
        </button>
      ))}
    </div>
  );
}

export default UpperMenu;
