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
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  let dispatch = useDispatch();
  let filteredCoupons = useSelector(
    (state: AppState) => state.filteredCouponsToShow
  );
  let isCouponsToShow = useSelector((state: AppState) => state.isCouponsToShow);
  let currentCategory = useSelector(
    (state: AppState) => state.filteredCategory
  );
  let currentCategoryName = useSelector(
    (state: AppState) => state.currentCategoryName
  );
  // let currentCategory = useSelector((state: AppState) => state.currentCategory);
  let searchString = useSelector((state: AppState) => state.searchString);
  let user = useSelector((state: AppState) => state.user);
  let isUserLoggedIn = useSelector((state: AppState) => state.isUserLoggedIn);
  let [isCreateCouponModalOpen, setIsCreateCouponModalOpen] = useState(false);
  let [currentPage, setCurrentPage] = useState<number>(1);
  let [pages, setPages] = useState<number>(0);
  let [isFirstPageShown, setIsFirstPageShown] = useState<boolean>(true);
  let [isLastPageShown, setIsLastPageShown] = useState<boolean>(pages == 1);

  async function fetchCoupons() {
    // try {
    //   const response = await axios.get(
    //     "http://localhost:8080/coupons/accordingUserType"
    //   );
    //   const coupons = response.data;
    //   dispatch({ type: ActionType.GetCoupons, payload: coupons });
    // } catch (error: any) {
    //   alert(error.response.data.errorMessage);
    // }

    // console.log(currentCategory);

    // dispatch({type:ActionType.FilterByCategory, payload: 1});
debugger;
    try {
      const response = await axios.get(
        `http://localhost:8080/coupons/byFilters?page=${currentPage}&categoryIds=${currentCategory}`
        // `http://localhost:8080/coupons/byFilters?page=${currentPage}&categoryIds=${currentCategory}&searchString=${searchString}`
      );
      console.log(response);

      let coupons = response.data.coupons;
      setPages(response.data.pages);

      dispatch({ type: ActionType.GetCoupons, payload: coupons });
    } catch (error: any) {
      // alert(error.response.data.errorMessage);
      alert("hi hi hi");
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

  function onPreviousClicked() {
    if (currentPage > 1) {
      let previousePage = currentPage -1;
      setCurrentPage(previousePage);
      checkPage();
    }
  }

  function onNextClicked(){
    if (currentPage < pages){
      let nextPage = currentPage +1;
      setCurrentPage(nextPage);
      checkPage();
    }
  }
  function checkPage(){
    if (currentPage == 1) {
      setIsFirstPageShown(true);
    }else{
      setIsFirstPageShown(false);
    }

    if(currentPage == pages){
      setIsLastPageShown(true);
    } else{
      setIsLastPageShown(false);
    }

  }

  useEffect(() => {
    setCurrentPage(1);
  },[currentCategory])

  useEffect(() => {
    debugger;
    fetchCoupons();
    navigate(`?page=${currentPage}`);
    checkPage();
  }, [user, currentCategory, currentPage, pages]);

  return (
    <div className="couponsContainer">
      <div className="head">
        <h2 className="category">{currentCategoryName}</h2>

        <button onClick={onPreviousClicked} disabled={isFirstPageShown}>previous</button>
        Page {currentPage} of total {pages} Pages
        <button onClick={onNextClicked} disabled={isLastPageShown}>next</button>
        {(user.userType == "ADMIN" || user.userType == "COMPANY") && (
          <button className="create-btn" onClick={openCreateCouponModal}>
            Create new coupon
          </button>
        )}
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
