import "./CouponForAdmin.css";
import { ICoupon } from "../../models/ICoupon";
import { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import Modal from "react-modal";
import CreateCoupon from "../CreateCoupon/CreateCoupon";
import Coupon from "../Coupon/Coupon";

function CouponForAdmin(props: ICoupon) {
  const customUpdateModalStyles = {
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
  const customPreviewModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
      borderRadius: "20px",
      padding: "0",
    },
  };
  Modal.setAppElement("#root");

  let [isCouponAvailable, setIsCouponAvailable] = useState(true);
  let [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  let [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  async function onDeleteClicked() {
    let confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      try {
        const response = await axios.delete(
          "http://localhost:8080/coupons/" + props.id
        );
      } catch (error: any) {
        alert(error.response.data.errorMessage);
      }
      props.fetchCoupons();
      alert("Coupon deleted.");
    } else {
      alert("Delete canceled.");
    }
  }

  function onUpdateClicked() {
    openUpdateModal();
  }

  function openUpdateModal() {
    setIsUpdateModalOpen(true);
  }

  function closeUpdateModal(confirm?: boolean) {
    if (confirm) {
      setIsUpdateModalOpen(false);
    } else {
      let confirmClose = window.confirm(
        "Are you sure you want to close this window? all the information will be deleted"
      );
      if (confirmClose) {
        setIsUpdateModalOpen(false);
      }
    }
  }

  function onPreviewClicked() {
    setIsPreviewModalOpen(true);
  }
  function closePreviewModal() {
    setIsPreviewModalOpen(false);
  }

  function isCouponAvailableCheck() {
    let startDate = new Date(props.startDate);
    let endDate = new Date(props.endDate);
    if (props.amount === 0 || startDate > new Date() || endDate < new Date()) {
      setIsCouponAvailable(false);
    } else {
      setIsCouponAvailable(true);
    }
  }

  useEffect(() => {
    isCouponAvailableCheck();
  });


  function formatDate(date: string): string {
    const formattedDate = moment(date);
    const formattedDateString = formattedDate.format("YYYY-MM-DD");
    return formattedDateString;
  }

  return (
    <div className="coupon-card-admin">
      <div className="coupon-info-admin">
        <strong className="coupon-name-admin">{props.name}</strong>
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
      {!isCouponAvailable && (
        <div className="error-message-admin">
          This coupon is not available for sell
        </div>
      )}
      {isCouponAvailable && (
        <div className="valid-message-admin">
          This coupon is available for sell
        </div>
      )}
      <button className="update-btn" onClick={onUpdateClicked}>
        update
      </button>
      <button className="delete-btn" onClick={onDeleteClicked}>
        delete
      </button>
      <button className="preview-btn" onClick={onPreviewClicked}>
        preview
      </button>

      {/* update coupon modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onRequestClose={()=>closeUpdateModal}
        style={customUpdateModalStyles}
      >
        <CreateCoupon
          closeCreateModal={closeUpdateModal}
          fetchCoupons={props.fetchCoupons}
          coupon={props}
        />
      </Modal>

      {/* preview coupon modal  */}
      <Modal
        isOpen={isPreviewModalOpen}
        onRequestClose={closePreviewModal}
        style={customPreviewModalStyles}
      >
        <Coupon
          id={props.id}
          name={props.name}
          description={props.description}
          startDate={props.startDate}
          endDate={props.endDate}
          amount={props.amount}
          categoryName={props.categoryName}
          categoryId={props.categoryId}
          companyName={props.companyName}
          companyId={props.companyId}
          price={props.price}
          imageData={props.imageData}
          fetchCoupons={props.fetchCoupons}
        />
      </Modal>
    </div>
  );
}

export default CouponForAdmin;
