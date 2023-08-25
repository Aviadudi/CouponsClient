import { useEffect, useState } from "react";
import { ICoupon } from "../../models/ICoupon";
import axios from "axios";
import Coupon from "../Coupon/Coupon";
import "./CouponsContainer.css"
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../redux/action-type";
import { AppState } from "../../redux/app-state";

function CouponsContainer() {
  let dispatch = useDispatch();
  let coupons = useSelector((state:AppState) => state.coupons);
  // let [coupons, setCoupons] = useState<ICoupon[]>([]);

  async function fetchCoupons() {
    try {
      const response = await axios.get("http://localhost:8080/coupons");
      const coupons = response.data;
      dispatch({type: ActionType.GetProducts, payload:coupons})
    } catch (error: any) {
      alert(error.message);
    }
  }

  // function filterByCategory(category:string){
  //   let filteredCoupons = coupons.filter((coupon) => coupon.categoryName == category);
  //   setCoupons(filteredCoupons);
  // }


  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div className="couponsContainer">
      {coupons.map((coupon) => (
        <Coupon
          key={coupon.id}
          id={coupon.id}
          name={coupon.name}
          description={coupon.description}
          startDate={coupon.startDate}
          endDate={coupon.endDate}
          amount={coupon.amount}
          categoryName={coupon.categoryName}
          companyName={coupon.companyName}
          price={coupon.price}
        />
      ))}
    </div>
  );
}
export default CouponsContainer;

