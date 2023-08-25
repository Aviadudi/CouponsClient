import { AppState } from "./app-state";
import { ActionType } from "./action-type";
import { Action } from "./action";

let appState = new AppState();

export function reduce(oldAppState: AppState = appState, action: Action): AppState {
    const newAppState = { ...oldAppState };

    switch (action.type) {
        case ActionType.GetProducts:
            newAppState.allCoupons = action.payload;
            newAppState.coupons = newAppState.allCoupons;
            break;
        case ActionType.FilterByCategory:
            let coupons = newAppState.allCoupons;
            let filteredCoupons = coupons.filter((coupon) => coupon.categoryName == action.payload);
            newAppState.coupons = filteredCoupons;
            break;
        case ActionType.ShowAllCoupons:
            newAppState.coupons = newAppState.allCoupons;
    }

    return newAppState;
}