import { useSelector } from "react-redux";
import { AppState } from "../../redux/app-state";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Purchases.css";
import Coupon from "../Coupon/Coupon";
import moment from "moment";

interface IPurchase {
  id: number;
  amount: number;
  price: number;
  purchaseDate: string;
  couponId: number;
}

function Purchases() {
  let user = useSelector((state: AppState) => state.user);
  let coupons = useSelector((state: AppState) => state.allCoupons);
  let [purchases, setPurchases] = useState<IPurchase[]>([]);

  async function fetchPurchases() {

    const response = await axios.get(
      "http://localhost:8080/purchases/byUserId?id=" + user.id
    );
    console.log(response.data);
    setPurchases(response.data);
    // console.log(purchases);
  }

  useEffect(() => {
    fetchPurchases();
  }, []);

  function formatDate(date: string): string {
    const formattedDate = moment(date);
    const formattedDateString = formattedDate.format('DD/MM/YYYY');
    return formattedDateString
  }

  return (
    <div className="purchases">
        <h1>My Purchases</h1> <br />
      <table className="purchases-table">
        <tr className="purchases-header">
          <td>Id</td>
          <td>Coupon name</td>
          <td>Description</td>
          <td>Amount</td>
          <td>Total price</td>
          <td>Date</td>
        </tr>
      {purchases.map((purchase) => (
          <tr className="purchase-line">
            <td>{purchase.id}</td>
            <td>
              {coupons.find((coupon) => coupon.id == purchase.couponId)?.name}
            </td>
            <td>
              {
                coupons.find((coupon) => coupon.id == purchase.couponId)
                  ?.description
              }
            </td>
            <td>{purchase.amount}</td>
            <td>{purchase.price}</td>
            <td>{formatDate(purchase.purchaseDate)}</td>
          </tr>
          ))}
        </table>
    </div>
  );
}

export default Purchases;
