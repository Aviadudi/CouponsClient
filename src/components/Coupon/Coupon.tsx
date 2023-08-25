import "./Coupon.css";
import { ICoupon } from "../../models/ICoupon";
import { useEffect, useState } from "react";
import moment from "moment";

function Coupon(props: ICoupon) {
  let [errorMessage, setErrorMessage] = useState("");
  let [isCouponAvilable, setIsCouponAvilable] = useState(true);
  let [isInputAmountValid, setIsInputAmountValid] = useState(true);

  function handleInputChange(userInputAmount: number) {
    //Add condition to if =>  userInputAmount == Math.E
    if (userInputAmount < 0 || userInputAmount > props.amount) {
      setErrorMessage(`Change Amount`);
      setIsInputAmountValid(false);
    } else {
      setErrorMessage(``);
      setIsInputAmountValid(true);
    }
  }

  function isCouponAvailable() {
    let startDate = new Date(props.startDate);
    let endDate = new Date(props.endDate);
    if(props.amount == 0 || startDate>new Date() || endDate<new Date()){
      setIsCouponAvilable(false);
    }
    else{
      setIsCouponAvilable(true);
    }
  }

useEffect(()=>{
  isCouponAvailable();
})

function formatDate(date: string): string {
  const formattedDate = moment(date);
  const formattedDateString = formattedDate.format('DD/MM/YYYY');
  return formattedDateString
}

  return (
    <div className="coupon-card">
      <div className="coupon-info">
        <strong className="coupon-name">{props.name}</strong>
        <br />
        <strong>Description: </strong>
        {props.description}
        <br />
        <strong>Start Date: </strong>
        {formatDate(props.startDate)}
        <br />
        <strong>End Date: </strong>
        {formatDate(props.endDate)}
        <br />
        <strong>Amount: </strong>
        {props.amount}
        <br />
        <strong>Category: </strong>
        {props.categoryName}
        <br />
        <strong>Company: </strong>
        {props.companyName}
        <br />
        <strong>Price: </strong>
        {props.price + "$"}
        <br />
      </div>
      <div className="purchase">
        <input
          type="number"
          className="amount-to-purchase"
          placeholder="Amount"
          onChange={(event) => handleInputChange(+event.target.value)}
          disabled={!isCouponAvilable}
        />
        <p className="error-message">{errorMessage}</p>
        <button disabled={!isInputAmountValid} className="purchase-button">
          Purchase
        </button>
      </div>
    </div>
  );
}

export default Coupon;
