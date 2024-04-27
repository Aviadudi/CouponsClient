import { AppState } from "./app-state";
import { ActionType } from "./action-type";
import { Action } from "./action";

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

      if (newAppState.allCoupons.length != 0) {
        newAppState.isCouponsToShow = true;
      }else{
        newAppState.isCouponsToShow = false;
      }
      break;

    case ActionType.GetCategories:
      newAppState.categories = action.payload;
      break;

    case ActionType.GetCompanies:
      newAppState.companies = action.payload;
      break;

    case ActionType.FilterByCategory:
      newAppState.filteredCategory = action.payload;
      break;

    case ActionType.FilterByCompanies:
      newAppState.filteredCompanies = action.payload;
      break;

    case ActionType.ShowAllCoupons:
      newAppState.filteredCouponsToShow = newAppState.allCoupons;
      if (newAppState.allCoupons && newAppState.allCoupons.length != 0) {
        newAppState.isCouponsToShow = true;
      }
      break;

    case ActionType.Search:
      newAppState.searchInput = action.payload;
      break;

    case ActionType.ChangeUser:
      let user = action.payload;
      newAppState.user = user;
      break;

    case ActionType.SetCategoryName:
      newAppState.currentCategoryName = action.payload;
      break;

    case ActionType.SetUserLoggedIn:
      newAppState.isUserLoggedIn = action.payload;
      break;
  }

  return newAppState;
}
