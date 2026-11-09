import { CircleMinus, CircleOff, CirclePlus, Trash } from 'lucide-react'
import React, { useState } from 'react'
import UseCart from '../hooks/UseCart'
import { toast } from 'react-toastify';
import { deleteCartItem, getOrCreateCart, updateCartItem } from '../services/cartServices';
import useAuth from '../hooks/useAuth';
import supabase from '../lib/supabase';
import { useNavigate } from 'react-router';

function UserCartPage() {
  const { state, dispatch } = UseCart();
  const [onCheckout,setOnCheckout] = useState(false);
  const {user} = useAuth();
  const navigate = useNavigate();
  const quantityIncrease = async item => {
    dispatch({
      type: "INCREASE_QUANTITY",
      payload: item.menu_item_id
    })
    try {
      await updateCartItem(item.id, item.quantity + 1)
    } catch (error) {
      // ROLL_BACK QUANTITY UPDATE //
      dispatch({
        type: "ROLL_BACK_UPDATE_QUANTITY",
        payload: item.menu_items.id
      })
    }
  }


  const handleDeleteCartItem = async item => {
    dispatch({
      type: "DELETE_ITEM",
      payload: item.menu_items.id
    })
    try {
      await deleteCartItem(item.id);
    } catch (error) {
      // ROLL_BACK DELETE_ITEM //
      dispatch({
        type: "ROLL_BACK_UPDATE_QUANTITY",
        payload: item
      })
    }
  }

  const quantityDescrease = async item => {
    dispatch({
      type: "DECREASE_QUANTITY",
      payload: item.menu_item_id
    })
    try {
      await updateCartItem(item.id, item.quantity - 1)
    } catch (error) {
      // ROLL_BACK QUANTITY UPDATE //
      dispatch({
        type: "ROLL_BACK_UPDATE_QUANTITY",
        payload: item.menu_items.id
      })
    }
  }



  const handleClearCart = async () => {
    dispatch({
      type: "CLEAR_CART",
      payload: []
    });
    const cart = await getOrCreateCart(user.id);
    try {
      await supabase.from("cart_items")
        .delete()
        .eq("cart_id", cart.id);
        toast.success("Cart cleared.")
    } catch (error) {
      dispatch({
        type: "ROLL_BACK_CLEAR",
        payload: state.cart
      })
    }
  }

  const total = state.cart.reduce((acc,curr) => acc + curr.quantity * curr.menu_items.price ,0)
  return (
    <div className="cart_items_wrapper p-4 flex flex-col gap-4">
      {
        state.cart.map((item,index) => (
          <div key={index} className='flex flex-col gap-4'>
            <div className="cart_item flex md:flex-row items-start md:items-center md:justify-between flex-col gap-4">
              <div className="left flex sm:items-center gap-4 flex-col sm:flex-row w-full">
                <img src={item?.menu_items?.image_url} alt={item?.menu_items?.name} className='h-40 md:h-20 w-full sm:w-28 object-cover rounded-md shadow' />
                <div className="item_info flex flex-col gap-1">
                  <h2 className='font-semibold'>{item?.menu_items?.name}</h2>
                  <p className='text-xs md:text-[13.5px] text-text/70 capitalize'>{item?.menu_items?.description?.split(" ").slice(0, 3).join(" ")}</p>
                  <h3 className='font-black'>{`$${(item?.menu_items?.price * item.quantity).toFixed(2)}`}</h3>
                </div>
              </div>
              <div className="right flex items-center gap-4">
                <div className="quantity flex bg-card px-4 py-1 rounded-full gap-3 shadow-2xl">
                  <button disabled={item?.quantity === 1} className='disabled:opacity-30 cursor-pointer select-none disabled:cursor-not-allowed text-danger' onClick={() => quantityDescrease(item)}><CircleMinus className='w-5' /></button>
                  <h2 className={`${item?.quantity === 1 ? "text-text/40" : ""} font-semibold`}>{item?.quantity}</h2>
                  <button onClick={() => quantityIncrease(item)} className='cursor-pointer select-none'><CirclePlus className='w-5 text-success' /></button>
                </div>
                <button className='cursor-pointer' onClick={() => handleDeleteCartItem(item)}><Trash className='w-4' /></button>
              </div>
            </div>
            <div className="border-b border-text/10"></div>
          </div>
        ))
      }
      {state.cart.length > 0 ? (
        <div className="bottom bg-background  p-4">
          <div className="total_container flex items-center justify-between">
            <h2 className='text-base md:text-[16px] text-text/80 font-light'>Subtotal</h2>
            <h1 className="total_price text-[18px] md:text-xl lg:text-2xl">${total.toFixed(2)}</h1>
          </div>
          <div className="actions flex flex-col gap-4 mt-4">

            <button
              type="button"
              onClick={() => navigate(`/dashboard/user/checkout/${user?.id}`)}
              onMouseOver={() => setOnCheckout(true)}
              onMouseOut={() => setOnCheckout(false)}
              className="text-sm md:text-[15px] lg:text-[16px] cursor-pointer bg-primary-hover text-background px-4 py-2 relative overflow-hidden rounded-full"
            >
              <span className="relative z-10 font-semibold">Checkout</span>

              <div
                className={`absolute inset-y-0 left-0 bg-success cursor-pointer transition-all duration-400 ${onCheckout ? "w-full" : "w-0"
                  }`}
              />
            </button>

            <button type='button' className='text-xs text-text/60 cursor-pointer' onClick={handleClearCart}>Clear cart</button>
          </div>
        </div>

      ) :(
        <div className="emptyCart flex flex-col items-center justify-center gap-4">
          <CircleOff className='text-2xl md:text-3xl lg:text-4xl'/>
          <h2 className='text-xs md:text-sm text-text/70'>Unfortunately, we couldn’t locate your order cart. Thank you for your patience.</h2>
        </div>
      )
    }
    </div>
  )
}

export default UserCartPage