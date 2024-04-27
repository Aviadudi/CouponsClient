import { ICategory } from "../models/ICategory";
import { ICompany } from "../models/ICompany";
import { ICoupon } from "../models/ICoupon";
import { IUserData } from "../models/IUserData";

export class AppState {
  public allCoupons: ICoupon[] = [];
  public filteredCouponsToShow: ICoupon[] = [];
  public user: IUserData = {
    id: 0,
    userType: "CUSTOMER",
    companyId: 0,
    username: "",
  };
  public categories: ICategory[] = [];
  public companies: ICompany[] = [];
  public filteredCategory: number = -1;
  public filteredCompanies: number[] = [];
  public searchInput: string = "";
  public isUserLoggedIn: boolean = false;
  public isCouponsToShow: boolean = false;
  public currentCategoryName: string = "All Coupons";
  public passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,12}$/;
}
