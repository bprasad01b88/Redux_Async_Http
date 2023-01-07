import { cartActions } from "./cart-slice";
import { uiActions } from "./ui-slice";

export const fetchCartData = () => {
    return async dispatch => {
        const fetchData = async () => {
            const response = await fetch( "https://react-http-6b4a6.firebaseio.com/cart.json");

            if(!response.ok){
                 throw new Error("Cound Not Fetch Cart Data");
            }

            const data = await response.json();
            
            return data;
        }

        try {
           const cartData = await fetchData()
           dispatch(cartActions.replaceCart({
            items : cartData.items || [],
            totalQuantity : cartData.totalQuantity
           }))
        } catch (error) {
            dispatch(
                uiActions.showNotification({
                    status : 'error',
                    title : 'Error!...',
                    message : 'Fetching Cart Data Failed'
                })
            )
        }
    }
}