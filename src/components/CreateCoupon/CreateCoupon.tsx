import { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/app-state";
import moment from "moment";
import axios from "axios";
import { ICoupon } from "../../models/ICoupon";
import "./CreateCoupon.css";

interface ICreateCoupon {
  closeCreateModal: Function;
  fetchCoupons: Function;
  coupon?: ICoupon;
}

function CreateCoupon(props: ICreateCoupon) {
  let [coupon, setCoupon] = useState<ICoupon | undefined>(props.coupon);
  let [categoryId, setCategoryId] = useState(0);
  let [companyId, setCompanyId] = useState(0);
  let [selectedImage64Base, setSelectedImage64Base] = useState<
    string | undefined | null
  >(null);
  let categories = useSelector((state: AppState) => state.categories);
  let companies = useSelector((state: AppState) => state.companies);
  let user = useSelector((state: AppState) => state.user);
  let [editedCoupon, setEditedCoupon] = useState<ICoupon>({
    id: 0,
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    amount: 0,
    price: 0,
    imageData: null,
    categoryId: 0,
    companyId: 0,
    companyName: "",
    categoryName: "",
    fetchCoupons: props.fetchCoupons,
  });

  console.log(coupon);

  async function onCreateClicked() {

    let response;
    if (coupon) {
      try {
        response = await axios.put("http://localhost:8080/coupons", editedCoupon);
        alert("Succeess! Coupon updated successfully!");
        props.fetchCoupons();
      } catch (error: any) {
        alert(error.response.data.errorMessage);
      }
    } else {
      try {
        response = await axios.post(
          "http://localhost:8080/coupons",
          editedCoupon
        );
        alert("Succeess! Coupon Created successfully!");
        props.fetchCoupons();
      } catch (error: any) {
        alert(error.response.data.errorMessage);
      }
    }

    if (response?.status == 200) {
      props.closeCreateModal(true);
    }
  }

  function onCategoryChanged(event: any) {
    setEditedCoupon({ ...editedCoupon, categoryId: +event.target.value });
  }

  function onCompanyChanged(event: any) {
    setEditedCoupon({ ...editedCoupon, companyId: +event.target.value });
  }
  function onNameChanged(event:any){
    setEditedCoupon({ ...editedCoupon, name: event.target.value });
  }
  function onDescriptionChanged(event:any){
    setEditedCoupon({ ...editedCoupon, description: event.target.value });
  }
  function onStartDateChanged(event:any){
    setEditedCoupon({ ...editedCoupon, startDate: event.target.value });
  }
  function onEndDateChanged(event:any){
    setEditedCoupon({ ...editedCoupon, endDate: event.target.value });
  }
  function onAmountChanged(event:any){
    setEditedCoupon({ ...editedCoupon, amount: event.target.value });
  }
  function onPriceChanged(event:any){
    setEditedCoupon({ ...editedCoupon, price: event.target.value });
  }


  function formatDate(date: string): string {
    const formattedDate = moment(date);
    const formattedDateString = formattedDate.format("YYYY-MM-DD");
    return formattedDateString;
  }

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0].size < 1000000) {
      let file: File = event.target.files[0];

      let reader = new FileReader();
      reader.onload = (event) => {
        let base64Image = event.target?.result as string;
        let newImagedata = base64Image.split(",")[1];
        setSelectedImage64Base(newImagedata);
        setEditedCoupon({...editedCoupon, imageData:newImagedata});
      };
      reader.readAsDataURL(file);
    } else {
      alert("Choose another image, the size must be bellow 1MB");
    }
  };

  function onDeleteImageClicked() {
    setSelectedImage64Base(null);
  }

  useEffect(() => {
    if (coupon) {
      setEditedCoupon({
        ...editedCoupon,
        id: coupon.id,
        name: coupon.name,
        description: coupon.description,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        amount: coupon.amount,
        price: coupon.price,
        imageData: coupon.imageData,
        categoryId: coupon.categoryId,
        companyId: coupon.companyId,
        companyName: coupon.companyName,
        categoryName: coupon.categoryName,
        fetchCoupons: coupon.fetchCoupons,
      });
    }
  }, []);

  return (
    <div className="create-modal">
      {coupon ? (
        <h3 className="edit-coupon-title">Update Coupon</h3>
      ) : (
        <h3>Create Coupon</h3>
      )}

      <div className="coupon-data">
        <div>
          <label className="coupon-title">Coupon Title</label>
          <input
            className="input-edit-coupon-title"
            type="text"
            value={editedCoupon.name}
            minLength={4}
            maxLength={30}
            onChange={(name) => onNameChanged(name)}
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            className="description-box"
            value={editedCoupon.description}
            maxLength={100}
            minLength={10}
            onChange={(description) => onDescriptionChanged(description)}
          ></textarea>
        </div>
        <table>
          <tr>
            <td>
              <div>
                <label>Start Date:</label>
                <input
                  className="edit-date"
                  type="date"
                  value={formatDate(editedCoupon.startDate)}
                  onChange={(date) => onStartDateChanged(date)}
                />
              </div>
            </td>
            <td>
              <div>
                <label>End Date:</label>
                <input
                  className="edit-date"
                  type="date"
                  value={formatDate(editedCoupon.endDate)}
                  onChange={(date) => onEndDateChanged(date)}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div>
                <label>Amount:</label>
                <input
                  className="edit-number"
                  type="number"
                  value={editedCoupon.amount}
                  min={0}
                  onChange={(amount) => onAmountChanged(amount)}
                />
              </div>
            </td>
            <td>
              <div>
                <text>
                  <label>Category:</label>
                </text>
                <select
                  className="edit-category"
                  name="categories"
                  id="categories"
                  onChange={(event) => onCategoryChanged(event)}
                >
                  {coupon ? (
                    <option key={categoryId} value={categoryId} selected hidden>
                      {editedCoupon.categoryName}
                    </option>
                  ) : (
                    <option value="category" disabled selected hidden>
                      category
                    </option>
                  )}

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div>
                <label>Company:</label>
                {user.userType == "ADMIN" && (
                  <select
                    className="edit-company"
                    name="companies"
                    id="companies"
                    onChange={(event) => onCompanyChanged(event)}
                  >
                    {coupon ? (
                      <option key={companyId} value={companyId} selected hidden>
                        {editedCoupon.companyName}
                      </option>
                    ) : (
                      <option value="category" disabled selected hidden>
                        company
                      </option>
                    )}
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                )}
                {user.userType == "COMPANY" && "Company Id: " + user.companyId}
              </div>
            </td>
            <td>
              <div>
                <label>Price:</label>
                <input
                  className="edit-number"
                  type="number"
                  value={editedCoupon.price}
                  onChange={(price) => onPriceChanged(price)}
                />
              </div>
            </td>
          </tr>
        </table>
        <div className="add-image">
          <label>Add image:</label>
          <input type="file" accept=".jpg" onChange={handleImageSelect} />
        </div>

        {coupon && coupon.imageData != null && selectedImage64Base != null && (
          <div>
            current image: <br />
            <img
              className="picture"
              src={`data:image/jpeg;base64,${editedCoupon.imageData}`}
            />
            <br />
            {coupon.imageData != null && (
              <button onClick={onDeleteImageClicked}>Delete Image</button>
            )}
          </div>
        )}
        {coupon ? (
          <button className="modal-create-btn" onClick={onCreateClicked}>
            Update
          </button>
        ) : (
          <button className="modal-create-btn" onClick={onCreateClicked}>
            Create
          </button>
        )}

        <button
          onClick={() => props.closeCreateModal()}
          className="modal-close-button"
        >
          X
        </button>
      </div>
    </div>
  );
}
export default CreateCoupon;
