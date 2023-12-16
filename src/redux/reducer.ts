import { AppState } from "./app-state";
import { ActionType } from "./action-type";
import { Action } from "./action";
import { ICoupon } from "../models/ICoupon";

let appState = new AppState();

export function reduce(
  oldAppState: AppState = appState,
  action: Action
): AppState {
  const newAppState = { ...oldAppState };

  switch (action.type) {
    case ActionType.GetCoupons:
      newAppState.allCoupons = action.payload;
      newAppState.filteredCouponsToShow = newAppState.allCoupons;
      // Filter coupons for Customer
      // if (newAppState.allCoupons && newAppState.user.userType === "CUSTOMER") {
      //   newAppState.couponsFilteredByUserType = newAppState.allCoupons.filter(
      //     (coupon) =>
      //       new Date(coupon.startDate) < new Date() &&
      //       new Date(coupon.endDate) > new Date()
      //   );
      // }
      // // Show all coupons for Admin
      // // TODO change the admin to company and filter by user company
      // else if (
      //   newAppState.allCoupons &&
      //   newAppState.user.userType === "ADMIN"
      // ) {
      //   newAppState.couponsFilteredByUserType = newAppState.allCoupons;
      // }
      // // Show all coupons (if admin)
      // else {
      //   newAppState.couponsFilteredByUserType = newAppState.allCoupons;
      // }

      if (newAppState.allCoupons.length != 0) {
        newAppState.isCouponsToShow = true;
      }

      // newAppState.filteredCouponsToShow = newAppState.couponsFilteredByUserType;
      break;

    case ActionType.GetCategories:
      newAppState.categories = action.payload;
      break;

    case ActionType.GetCompanies:
      newAppState.companies = action.payload;
      break;
      
    case ActionType.FilterByCategory:
      let coupons = newAppState.allCoupons;
      let filteredCoupons;
      if (action.payload) {
        filteredCoupons = coupons.filter(
          (coupon) => coupon.categoryName == action.payload
        );
      } else {
        filteredCoupons = coupons;
      }
      if (filteredCoupons && filteredCoupons.length == 0) {
        newAppState.isCouponsToShow = false;
      } else {
        newAppState.isCouponsToShow = true;
      }
      newAppState.filteredCouponsToShow = filteredCoupons;
      break;

    case ActionType.ShowAllCoupons:
      newAppState.filteredCouponsToShow = newAppState.allCoupons;
      if (newAppState.allCoupons && newAppState.allCoupons.length != 0) {
        newAppState.isCouponsToShow = true;
      }
      break;

    case ActionType.Search:
      let searchInput = action.payload;
      if (searchInput == "") {
        newAppState.filteredCouponsToShow = newAppState.allCoupons;
      } else {
        let filteredCoupons;
        filteredCoupons = newAppState.allCoupons.filter(
          (coupon) =>
            coupon.name.toLowerCase().includes(searchInput) ||
            coupon.description.toLowerCase().includes(searchInput) ||
            coupon.categoryName.toLowerCase().includes(searchInput) ||
            coupon.companyName.toLowerCase().includes(searchInput)
        );
        newAppState.filteredCouponsToShow = filteredCoupons;
      }
      break;

    case ActionType.ChangeUser:
      let user = action.payload;
      newAppState.user = user;
      // if (newAppState.user.userType == "ADMIN") {
      //   newAppState.couponsFilteredByUserType = newAppState.allCoupons;
      //   newAppState.filteredCouponsToShow =
      //     newAppState.couponsFilteredByUserType;
      // }
      break;

    // case ActionType.SucceessPurchase:
    //   let amount = action.payload.amount;
    //   let couponId = action.payload.couponId;
    // newAppState.couponsFilteredByUserType[couponId].amount = amount;
    // newAppState.couponsFilteredByUserType = [
    //   ...newAppState.couponsFilteredByUserType,
    // ];
    // break;

    case ActionType.SetCategoryName:
      newAppState.currentCategory = action.payload;
      break;

    case ActionType.SetUserLoggedIn:
      newAppState.isUserLoggedIn = action.payload;
      break;
  }

  return newAppState;
}
