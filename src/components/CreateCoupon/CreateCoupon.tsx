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

  // coupon? => update coupon
  // empty statement => new coupon
  let [id, setId] = useState(0);
  let [name, setName] = useState("");
  let [description, setdescription] = useState("");
  let [startDate, setStartDate] = useState("");
  let [endDate, setEndDate] = useState("");
  let [amount, setAmount] = useState(0);
  let [categoryId, setCategoryId] = useState(0);
  let [companyId, setCompanyId] = useState(0);
  let [price, setPrice] = useState(0);
  let [selectedImage, setSelectedImage] = useState<File|null>(null);
  let [selectedImage64Base, setSelectedImage64Base] = useState<
    string | undefined | null
  >(null);
  let categories = useSelector((state: AppState) => state.categories);
  let companies = useSelector((state: AppState) => state.companies);
  let user = useSelector((state: AppState) => state.user);

  console.log(coupon);

  async function onCreateClicked() {
    // // Initial image name to default image
    // let imageName = "default.jpg";

    // // If there is an image choosen by the user, change the image name to the file name
    // if (selectedImage != null) {
    //   if (user.userType === "COMPANY") {
    //     imageName = user.companyId + selectedImage.name;
    //   } else {
    //     // The user is admin
    //     imageName = selectedImage.name;
    //   }


    // let formData = new FormData();
    // formData.append(imageName, selectedImage);
    // const filepath = `src/images/${imageName}`;
    // axios.post(`/src/images`, formData);
    // if (selectedImage) {
    //   const reader = new FileReader();
    //   const {current} = selectedImage;
    //   current.file = file;
    //   reader.onload = (e) => {
    //       current.src = e.target.result;
    //   }
    //   reader.readAsDataURL(file);
    // }
    // const reader = new FileReader();
    // reader.readAsDataURL(selectedImage);
    //   reader.onloadend = async (e) => {
    //     const contents = reader.result;
    //     if(contents){
    //   await fetch(contents).then(res =>
    //     fs.writeFileSync(filepath, res)
    //   );
    //   }
    // }
    // }
   
    let sentCoupon: ICoupon = {
      name: name,
      description: description,
      startDate: startDate,
      endDate: endDate,
      amount: amount,
      categoryId: categoryId,
      companyId: companyId,
      price: price,
      id: id,
      categoryName: "",
      companyName: "",
      imageData: selectedImage64Base,
      fetchCoupons: props.fetchCoupons,
    };
    if (coupon) {
      try {
        const response = await axios.put(
          "http://localhost:8080/coupons",
          sentCoupon
        );
        alert("Succeess! Coupon updated successfully!");
        props.fetchCoupons();
      } catch (error: any) {
        alert(error.response.data.errorMessage);
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8080/coupons",
          sentCoupon
        );
        alert("Succeess! Coupon Created successfully!");
        props.fetchCoupons();
      } catch (error: any) {
        alert(error.response.data.errorMessage);
      }
    }
    closeCreateModal();
  }

  function closeCreateModal() {
    props.closeCreateModal();
  }

  function formatDate(date: string): string {
    const formattedDate = moment(date);
    // const formattedDateString = formattedDate.format("DD-MM-YYYY");
    const formattedDateString = formattedDate.format("YYYY-MM-DD");
    return formattedDateString;
  }

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0].size < 1000000) {
      let file: File = event.target.files[0];
      setSelectedImage(file);
      console.log(selectedImage);

      let reader = new FileReader();
      reader.onload = (event) => {
        let base64Image = event.target?.result as string;
        let newImagedata = base64Image.split(",")[1];
        setSelectedImage64Base(newImagedata);

        console.log(selectedImage64Base);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Choose another image, the size must be bellow 1MB");
    }
  };

  function onDeleteImageClicked(){
    setSelectedImage64Base(null)
  }
  useEffect(() => {
    if (coupon) {
      setId(coupon.id);
      setName(coupon.name);
      setdescription(coupon.description);
      setStartDate(coupon.startDate);
      setEndDate(coupon.endDate);
      setAmount(coupon.amount);
      setPrice(coupon.price);
      // //  setSelectedImage(
      setSelectedImage64Base(coupon.imageData);
      for (let index = 0; index < categories.length; index++) {
        if (coupon.categoryName == categories[index].name) {
          setCategoryId(categories[index].id);
        }
      }
      for (let index = 0; index < companies.length; index++) {
        if (coupon.companyName == companies[index].name) {
          setCompanyId(companies[index].id);
        }
      }
    }
  }, []);
  return (
    <div className="create-modal">
      {coupon ? (
        <div className="edit-coupon-title">Update Coupon</div>
      ) : (
        <div>Create Coupon</div>
      )}

      <div className="coupon-data">
        {/* <strong className="coupon-name-admin">{props.name}</strong> */}
        <div>
          <label className="coupon-title">Coupon Title</label>
          <input
            className="input-edit-coupon-title"
            type="text"
            value={name}
            minLength={4}
            maxLength={30}
            onChange={(name) => setName(name.target.value)}
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            className="description-box"
            value={description}
            maxLength={100}
            minLength={10}
            onChange={(description) => setdescription(description.target.value)}
          ></textarea>
        </div>

        <div>
          <label>Start Date:</label>
          <input
            className="edit-date"
            type="date"
            value={formatDate(startDate)}
            onChange={(date) => setStartDate(date.target.value)}
          />
        </div>

        <div>
          <label>End Date:</label>
          <input
            className="edit-date"
            type="date"
            value={formatDate(endDate)}
            onChange={(date) => setEndDate(date.target.value)}
          />
        </div>

        <div>
          <label>Amount:</label>
          <input
            className="edit-number"
            type="number"
            value={amount}
            min={0}
            onChange={(amount) => setAmount(+amount.target.value)}
          />
        </div>

        <div>
          <text>
            <label>Category:</label>
          </text>
          <select
            className="edit-category"
            name="categories"
            id="categories"
            onChange={(category) => setCategoryId(+category.target.value)}
          >
            {coupon ? (
              <option key={categoryId} value={categoryId} selected hidden>
                {coupon.categoryName}
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

        <div>
          <label>Company:</label>
          {user.userType == "ADMIN" && (
            <select
              className="edit-company"
              name="companies"
              id="companies"
              onChange={(company) => setCompanyId(+company.target.value)}
            >
              {coupon ? (
                <option key={companyId} value={companyId} selected hidden>
                  {coupon.companyName}
                </option>
              ) : (
                <option value="category" disabled selected hidden>
                  company
                </option>
              )}
              {/* <option value="company" disabled selected hidden>
                company
              </option> */}
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          )}
          {user.userType == "COMPANY" && "Company Id: " + user.companyId}
        </div>

        <div>
          <label>Price:</label>
          <input
            className="edit-number"
            type="number"
            value={price}
            onChange={(price) => setPrice(+price.target.value)}
          />
        </div>

        <div>
          <label>Add image:</label>
          <input type="file" accept=".jpg" onChange={handleImageSelect} />
        </div>

        {(coupon && coupon.imageData != null && selectedImage64Base != null) && (
          <div>
            current image: <br />
            <img
              className="picture"
              src={`data:image/jpeg;base64,${coupon.imageData}`}
            />
            <br />
            {coupon.imageData != null && <button onClick={onDeleteImageClicked}>Delete Image</button>}
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

        <button onClick={closeCreateModal} className="modal-close-button">
          X
        </button>
      </div>
    </div>
  );
}
export default CreateCoupon;
