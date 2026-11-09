import { createContext, useEffect, useReducer } from "react";

export const cartContext = createContext([]);
import { initialState, reducer } from "../utils/cartReducer";
import { getCartItem, getOrCreateCart } from "../services/cartServices";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";

function CartProvider({children}) {
  const [state,dispatch] = useReducer(reducer,initialState);
  const {user} = useAuth();
  const values = {
     state,
     dispatch
  }
  useEffect(() => {
    let isCancelled = false;
    const fetchCartItems = async () => {
        try {
          if(!user?.id) return;
          const cart = await getOrCreateCart(user?.id);
          const cartITems = await getCartItem(cart.id);
          if(!isCancelled){
             dispatch({
               type : "SET_CART",
               payload : cartITems
             })
          }
        } catch (error) {
          if(!isCancelled){
             toast.error(error.message);
          }
        }
    }
     if (user?.id) {
    fetchCartItems();
  }
    return () => isCancelled = true
  },[user?.id])
  return (
    <cartContext.Provider value={values}>
        {children}
    </cartContext.Provider>
  )
}

export default CartProvider