import { useDispatch } from "react-redux";
import "./AsideMenu.css";
import { ActionType } from "../../redux/action-type";

function AsideMenu(){

    let dispatch = useDispatch();
    function filterByCategory(category:string){
        dispatch({type: ActionType.FilterByCategory, payload:category});
    }
    function showAllCoupons(){
        dispatch({type: ActionType.ShowAllCoupons})
    }
    return(
        <div className="AsideMenu">
            <p>Menu</p>
            <button onClick={()=>showAllCoupons()}>All Coupons</button> <br />
            <button onClick={()=>filterByCategory('Spa')}>Spa</button><br />
            <button onClick={()=>filterByCategory('Food')}>Food</button>

        </div>
    )
}

export default AsideMenu;