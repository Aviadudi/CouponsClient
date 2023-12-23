import "./Coupon.css";
import { ICoupon } from "../../models/ICoupon";
import { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../redux/action-type";
import { AppState } from "../../redux/app-state";
import User from "../User/User";

function Coupon(props: ICoupon) {
  let [errorMessage, setErrorMessage] = useState("");
  let [isAvailable, setIsAvailable] = useState(true);
  let [isInputAmountValid, setIsInputAmountValid] = useState(true);
  let [purchaseAmount, setPurchaseAmount] = useState(0);
  let isUserLoggedIn = useSelector((state: AppState) => state.isUserLoggedIn);
  let user = useSelector((state: AppState) => state.user);

  function validateInputAmount(userInputAmount: number) {
    if (userInputAmount < 0 || userInputAmount > props.amount) {
      setErrorMessage(`Change Amount`);
      setIsInputAmountValid(false);
    } else {
      setErrorMessage(``);
      setIsInputAmountValid(true);
    }
  }

  function onInputChanged(userInputAmount: number) {
    // TODO Add condition to if =>  userInputAmount == Math.E
    validateInputAmount(userInputAmount);
    setPurchaseAmount(userInputAmount);
  }

  async function onPurchaseClicked() {
    if (!isUserLoggedIn) {
      alert("please log in first");
    } else if (purchaseAmount == 0) {
      alert("Please choose amount");
    } else {
      let couponId = props.id;
      let amount = purchaseAmount;
      try {
        const response = await axios.post("http://localhost:8080/purchases", {
          couponId,
          amount,
        });
        alert("Succeess! Thank you for shoping with us!");
        setPurchaseAmount(0);
        props.fetchCoupons();
      } catch (error: any) {
        alert(error.response.data.errorMessage);
      }
    }
  }

  function isCouponAvailable() {
    let startDate = new Date(props.startDate);
    let endDate = new Date(props.endDate);
    if (props.amount == 0 || startDate > new Date() || endDate < new Date()) {
      setIsAvailable(false);
    } else {
      setIsAvailable(true);
    }
  }

  useEffect(() => {
    isCouponAvailable();
  });

  function formatDate(date: string): string {
    const formattedDate = moment(date);
    const formattedDateString = formattedDate.format("DD/MM/YYYY");
    return formattedDateString;
  }
  let imageDataByte64 = props.imageData;
  let imageDataUrl = `data:image/jpeg;base64,${imageDataByte64}`;

  return (
    <div className="coupon-card">
      <div className="coupon-info">
        {props.imageData != null ? (
          <img className="picture" src={`${imageDataUrl}`} />
        ) : (
          <img className="picture" src={require(`../../images/defaultCouponImage.jpg`)} />
        )}
        <span className="coupon-name">
          <strong>{props.name}</strong>
        </span>{" "}
        <span className="description">{props.description}</span>
        <span className="company-name">{props.companyName}</span> <br />
        {/* <strong>Start Date: </strong> {formatDate(props.startDate)} <br /> */}
        <span className="end-date">End Date: {formatDate(props.endDate)} </span>
        {/* <strong>Amount: </strong> {props.amount} <br /> */}
        {/* <strong>Category: </strong> {props.categoryName} <br /> */}
      </div>
      <span className="add-amount-txt">Add Amount:</span>
      <input
        type="number"
        className="amount-to-purchase"
        // placeholder="Add Amount"
        min={0}
        max={props.amount}
        step={1}
        value={purchaseAmount}
        onChange={(event) => onInputChanged(+event.target.value)}
        disabled={!isAvailable}
      />
      <span className="amount-left">left: {props.amount}</span>
      <p className="error-message">{errorMessage}</p>
      <span className="price">{props.price + "$"}</span>
      <p className="total-price">
        {isAvailable &&
          purchaseAmount > 0 &&
          purchaseAmount <= props.amount && (
            <div>Total price: {purchaseAmount * props.price}$</div>
          )}
      </p>
      <button
        disabled={!isInputAmountValid || !isAvailable || (user.userType!="CUSTOMER")}
        className="purchase-button"
        onClick={onPurchaseClicked}
      >
        Purchase
      </button>
    </div>
  );
}

export default Coupon;
