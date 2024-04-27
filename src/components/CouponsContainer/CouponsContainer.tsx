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
import RangeSlider from "rsuite/RangeSlider";
import "rsuite/dist/rsuite.css";

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
      height: "550px",
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
  let searchInput = useSelector((state: AppState) => state.searchInput);
  let user = useSelector((state: AppState) => state.user);
  let isUserLoggedIn = useSelector((state: AppState) => state.isUserLoggedIn);
  let [isCreateCouponModalOpen, setIsCreateCouponModalOpen] = useState(false);
  let [currentPage, setCurrentPage] = useState<number>(1);
  let [pages, setPages] = useState<number>(0);
  let [isFirstPageShown, setIsFirstPageShown] = useState<boolean>(true);
  let [isLastPageShown, setIsLastPageShown] = useState<boolean>(pages == 1);
  let [minPrice, setMinPrice] = useState<number>(0);
  let [maxPrice, setMaxPrice] = useState<number>(0);
  let [selectedMinPrice, setSelectedMinPrice] = useState(0);
  let [selectedMaxPrice, setSelectedMaxPrice] = useState(0);

  async function fetchCoupons() {
    try {
      const response = await axios.get(
        `http://localhost:8080/coupons/byFilters?page=${currentPage}&categoryIds=${currentCategory}&searchInput=${searchInput}&minPrice=${selectedMinPrice}&maxPrice=${selectedMaxPrice}`
      );
      let coupons = response.data.content;
      setPages(response.data.totalPages);
      dispatch({ type: ActionType.GetCoupons, payload: coupons });
    } catch (error: any) {
      alert(error.response.data.errorMessage);
    }
  }

  function openCreateCouponModal() {
    setIsCreateCouponModalOpen(true);
  }

  function closeCreateCouponModal(confirm?: boolean) {
    if (confirm) {
      setIsCreateCouponModalOpen(false);
    } else {
      confirm = window.confirm(
        "Are you sure you want to close this window? all the information will be deleted. \nYou can save the coupon with the amount of 0 and update or delete it later"
      );
      if (confirm) {
        setIsCreateCouponModalOpen(false);
      }
    }
  }

  function onPreviousClicked() {
    if (currentPage > 1) {
      let previousePage = currentPage - 1;
      setCurrentPage(previousePage);
    }
  }

  function onNextClicked() {
    if (currentPage < pages) {
      let nextPage = currentPage + 1;
      setCurrentPage(nextPage);
    }
  }
  function checkPage() {
    if (currentPage == 1) {
      setIsFirstPageShown(true);
    } else {
      setIsFirstPageShown(false);
    }

    if (currentPage == pages) {
      setIsLastPageShown(true);
    } else {
      setIsLastPageShown(false);
    }
  }

  async function handleRangesChanges(selectedPrices: any) {
    setSelectedMinPrice(selectedPrices[0]);
    setSelectedMaxPrice(selectedPrices[1]);
  }

  async function getMinMaxPrices() {
    try {
      const minResponse = await axios.get(
        "http://localhost:8080/coupons/minPrice"
      );
      const maxResponse = await axios.get(
        "http://localhost:8080/coupons/maxPrice"
      );

      setMinPrice(minResponse.data);
      setMaxPrice(maxResponse.data);

      setSelectedMinPrice(minResponse.data);
      setSelectedMaxPrice(maxResponse.data);
    } catch (error: any) {
      console.error(
        "Error fetching min/max prices:",
        error.response.data.errorMessage
      );
    }
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [user, currentCategory]);

  useEffect(() => {
    getMinMaxPrices();
  }, []);

  useEffect(() => {
    fetchCoupons();
    navigate(`?page=${currentPage}`);
    checkPage();
  }, [user, currentCategory, currentPage, pages, searchInput, isUserLoggedIn]);
  useEffect(() => {
    let timeOutId = setTimeout(() => {
      setCurrentPage(1);
      fetchCoupons();
      navigate(`?page=${currentPage}`);
      checkPage();
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [selectedMinPrice, selectedMaxPrice]);

  return (
    <div className="couponsContainer">
      <div className="head">
        <h2 className="category">{currentCategoryName}</h2>
        {user.userType == "CUSTOMER" && (
          <div className="price-filter">
            <p>Filter by price: </p>
            <RangeSlider
              className="price-slider"
              onChange={handleRangesChanges}
              value={[selectedMinPrice, selectedMaxPrice]}
              min={minPrice}
              max={maxPrice}
            />
          </div>
        )}
        {(user.userType == "ADMIN" || user.userType == "COMPANY") && (
          <button className="create-btn" onClick={openCreateCouponModal}>
            Create new coupon
          </button>
        )}
      </div>

      <Modal
        isOpen={isCreateCouponModalOpen}
        onRequestClose={() => closeCreateCouponModal()}
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

      {(user.userType === "ADMIN" || user.userType === "COMPANY") &&
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

      {!isCouponsToShow && <h3>No Coupons To Show</h3>}
      {isCouponsToShow && (
        <div>
          <button
            className="prev-page-btn"
            onClick={onPreviousClicked}
            disabled={isFirstPageShown}
          >
            previous
          </button>
          Page {currentPage} of total {pages} Pages
          <button
            className="next-page-btn"
            onClick={onNextClicked}
            disabled={isLastPageShown}
          >
            next
          </button>
        </div>
      )}
    </div>
  );
}
export default CouponsContainer;
