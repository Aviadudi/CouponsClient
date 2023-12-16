import { useEffect, useState } from "react";
import axios from "axios";
import Coupon from "../Coupon/Coupon";
import "./CouponsContainer.css";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../redux/action-type";
import { AppState } from "../../redux/app-state";
import CouponForAdmin from "../CouponForAdmin/CouponForAdmin";
import Modal from "react-modal";
import CreateCoupon from "../CreateCoupon/CreateCoupon";

function CouponsContainer() {
  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
      borderRadius: "20px",
      // height: "420px",
      height: "620px",
      width: "350px",
    },
  };

  let dispatch = useDispatch();
  let filteredCoupons = useSelector(
    (state: AppState) => state.filteredCouponsToShow
  );
  let isCouponsToShow = useSelector((state: AppState) => state.isCouponsToShow);
  let currentCategory = useSelector((state: AppState) => state.currentCategory);
  let user = useSelector((state: AppState) => state.user);
  let isUserLoggedIn = useSelector((state: AppState) => state.isUserLoggedIn);
  let [isCreateCouponModalOpen, setIsCreateCouponModalOpen] = useState(false);

  async function fetchCoupons() {
    try {
      const response = await axios.get(
        "http://localhost:8080/coupons/accordingUserType"
      );
      const coupons = response.data;
      dispatch({ type: ActionType.GetCoupons, payload: coupons });
    } catch (error: any) {
      alert(error.response.data.errorMessage);
    }
  }

  function openCreateCouponModal() {
    setIsCreateCouponModalOpen(true);
  }

  function closeCreateCouponModal() {
    let confirmClose = window.confirm(
      "Are you sure you want to close this window? all the information will be deleted. \nYou can save the coupon with the amount of 0 and update or delete it later"
    );
    if (confirmClose) {
      setIsCreateCouponModalOpen(false);
    }
  }

  useEffect(() => {
    if (isUserLoggedIn) {
      fetchCoupons();
    }
  }, [user]);

  return (
    <div className="couponsContainer">
      <div className="head">
        <h2 className="category">{currentCategory}</h2>

        {/* {(user.userType == "ADMIN" || user.userType == "COMPANY") && ( */}
        <button
          className="create-btn"
          onClick={openCreateCouponModal}
        >
          Create new coupon
        </button>
        {/* )} */}
      </div>

      <Modal
        isOpen={isCreateCouponModalOpen}
        onRequestClose={closeCreateCouponModal}
        style={customModalStyles}
      >
        <CreateCoupon
          closeCreateModal={closeCreateCouponModal}
          fetchCoupons={fetchCoupons}
        />
      </Modal>

      {/* return coupons for CUSTOMER */}
      {user.userType === "CUSTOMER" &&
        filteredCoupons.map((coupon) => (
          <Coupon
            key={coupon.id}
            fetchCoupons={fetchCoupons}
            id={coupon.id}
            name={coupon.name}
            description={coupon.description}
            startDate={coupon.startDate}
            endDate={coupon.endDate}
            amount={coupon.amount}
            categoryName={coupon.categoryName}
            categoryId={coupon.categoryId}
            companyName={coupon.companyName}
            companyId={coupon.companyId}
            imageData={coupon.imageData}
            price={coupon.price}
          />
        ))}

      {user.userType === "ADMIN" &&
        filteredCoupons.map((coupon) => (
          <CouponForAdmin
            key={coupon.id}
            fetchCoupons={fetchCoupons}
            id={coupon.id}
            name={coupon.name}
            description={coupon.description}
            startDate={coupon.startDate}
            endDate={coupon.endDate}
            amount={coupon.amount}
            categoryName={coupon.categoryName}
            categoryId={coupon.categoryId}
            companyName={coupon.companyName}
            companyId={coupon.companyId}
            imageData={coupon.imageData}
            price={coupon.price}
          />
        ))}

      {user.userType === "COMPANY" &&
        filteredCoupons.map((coupon) => (
          <CouponForAdmin
            key={coupon.id}
            fetchCoupons={fetchCoupons}
            id={coupon.id}
            name={coupon.name}
            description={coupon.description}
            startDate={coupon.startDate}
            endDate={coupon.endDate}
            amount={coupon.amount}
            categoryName={coupon.categoryName}
            categoryId={coupon.categoryId}
            companyName={coupon.companyName}
            companyId={coupon.companyId}
            imageData={coupon.imageData}
            price={coupon.price}
          />
        ))}
      {!isCouponsToShow && <h1>No Coupons To Show</h1>}
    </div>
  );
}
export default CouponsContainer;
