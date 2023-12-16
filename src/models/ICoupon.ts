export interface ICoupon{
    id:number;
    name:string;
    description:string;
    startDate:string;
    endDate:string;
    amount:number;
    categoryName:string;
    categoryId:number;
    companyName:string;
    companyId:number;
    price:number;
    imageData?: string|null;
    fetchCoupons:Function;
}