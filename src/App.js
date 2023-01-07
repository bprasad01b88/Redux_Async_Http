import Cart from "./components/Cart/Cart";
import { useDispatch, useSelector } from "react-redux";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { useEffect } from "react";
import { uiActions } from "./store/ui-slice";
import Notification from "./components/UI/Notification";
import { fetchCartData } from "./store/cart-actions";

let isInitial = true;
function App() {
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch]);

  const sendCartData = async () => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "sending....",
        message: "Sending Cart Data...",
      })
    );
    const response = await fetch(
      "https://react-http-6b4a6.firebaseio.com/cart.json",
      {
        method: "PUT",
        body: JSON.stringify(cart),
      }
    );
    if (!response.ok) {
      throw new Error("Sending Cart Data failed !...");
    }
    dispatch(
      uiActions.showNotification({
        status: "success",
        title: "Success....",
        message: "Sending Cart Data Successfull...",
      })
    );
  };
  useEffect(() => {
    if (isInitial) {
      isInitial = false;
      return;
    }
    if (cart.changed) {
      sendCartData().catch((error) => {
        dispatch(
          uiActions.showNotification({
            status: "error",
            title: "Error....",
            message: "Sending Cart Data Failed...",
          })
        );
      });
    }
  }, [cart, dispatch]);

  return (
    <>
      <Layout>
        {notification && (
          <Notification
            status={notification.status}
            title={notification.title}
            message={notification.message}
          />
        )}
        {showCart && <Cart />}
        <Products />
      </Layout>
    </>
  );
}

export default App;
