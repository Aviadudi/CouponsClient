import "./Coupon.css";
import { ICoupon } from "../../models/ICoupon";
import { useState } from "react";
import moment from "moment";
import axios from "axios";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/app-state";

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
    validateInputAmount(userInputAmount);
    setPurchaseAmount(userInputAmount);
  }

  async function onPurchaseClicked() {
    if (!isUserLoggedIn) {
      alert("please log in first");
    } else if (purchaseAmount == 0) {
      alert("Please choose amount");
    } else {
      let confirm = window.confirm(
        "Are you sure you want to buy `" + props.name + "` coupon"
      );
      if (confirm) {
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
  }

  function formatDate(date: string): string {
    const formattedDate = moment(date);
    const formattedDateString = formattedDate.format("DD/MM/YYYY");
    return formattedDateString;
  }
  let imageDataByte64 = props.imageData;
  let imageDataUrl = `data:image/jpeg;base64,${imageDataByte64}`;

  return (
    <div className="coupon-card">
      <div className="image-div">
        {props.imageData != null ? (
          <img className="picture" src={`${imageDataUrl}`} />
        ) : (
          <img
            className="picture"
            src={require(`../../images/defaultCouponImage.jpg`)}
          />
        )}
      </div>
      <div className="coupon-info">
        <span className="coupon-name">
          <strong>{props.name}</strong>
        </span>{" "}
        <span className="description">{props.description}</span>
        <span className="company-name">{props.companyName}</span> <br />

        <span className="end-date">End Date: {formatDate(props.endDate)} </span>
        <br />
        <span className="add-amount-txt">Add Amount:</span>
        <input
          type="number"
          className="amount-to-purchase"
          min={0}
          max={props.amount}
          step={1}
          value={purchaseAmount}
          onChange={(event) => onInputChanged(+event.target.value)}
        />
        <span className="amount-left">left: {props.amount}</span>
        <p className="error-message">{errorMessage}</p>
      </div>
      <span className="price">{props.price + "$"}</span>
      <p className="total-price">
        {purchaseAmount > 0 && purchaseAmount <= props.amount && (
          <div>Total price: {purchaseAmount * props.price}$</div>
        )}
      </p>
      <button
        disabled={
          !isInputAmountValid || !isAvailable || user.userType != "CUSTOMER"
        }
        className="purchase-button"
        onClick={onPurchaseClicked}
      >
        Purchase
      </button>
    </div>
  );
}

export default Coupon;
