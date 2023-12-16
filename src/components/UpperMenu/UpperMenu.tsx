import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../redux/action-type";
import "./UpperMenu.css";
import { AppState } from "../../redux/app-state";
import { useNavigate } from "react-router-dom";

function UpperMenu() {
  let dispatch = useDispatch();
  let allCoupons = useSelector((state: AppState) => state.allCoupons);
  let couponsToShow = useSelector(
    (state: AppState) => state.filteredCouponsToShow
  );
  
  let Categories = useSelector((state: AppState) => state.categories);
  let navigate = useNavigate();

  function filterByCategory(category: string) {
    dispatch({ type: ActionType.FilterByCategory, payload: category });
    dispatch({ type: ActionType.SetCategoryName, payload: category });
  }

  function showAllCoupons() {
    navigate("/");
    dispatch({ type: ActionType.GetCoupons, payload: allCoupons });
    dispatch({ type: ActionType.SetCategoryName, payload: "All coupons" });
  }

  return (
    <div className="upper-menu">
      <button onClick={() => showAllCoupons()}>
        All Coupons ({allCoupons.length})
      </button>
      {Categories.map((category) => (
        <button onClick={() => filterByCategory(category.name)}>
          {category.name}
        </button>
      ))}
    </div>
  );
}

export default UpperMenu;
