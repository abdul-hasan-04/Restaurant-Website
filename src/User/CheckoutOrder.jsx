import { AArrowDown, CartonIcon, Check, CreditCardCheck, ShoppingCart, TruckElectric, X } from 'lucide-react'
import React, { useState } from 'react'
import UseCart from '../hooks/UseCart'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import { createOrder, createOrderItem } from '../services/orderServices';
import TopLoadingBar from '../components/TopLoadingBar';
import ProgressLoadingBar from '../components/ProgressLoadingBar';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { FaBox, FaBoxOpen, FaCartShopping } from 'react-icons/fa6';
import { FaShoppingCart } from 'react-icons/fa';
import { BiErrorCircle } from 'react-icons/bi';
import { replace, useNavigate } from 'react-router';
import supabase from '../lib/supabase';
import { getOrCreateCart } from '../services/cartServices';
function CheckoutOrder() {
  const { state, dispatch } = UseCart();
  const { user } = useAuth();
  const total = state.cart.reduce((acc, curr) => acc + curr.quantity * curr.menu_items.price, 0);
  const [isCheckoutMode, setCheckoutMode] = useState();
  const [isLoading, setLoading] = useState(false);
  const [isOrderSuccess, setOrdersucces] = useState(false)
  const [isOrderFail, setOrderFail] = useState(false);
  const navigate = useNavigate();
  const { reset, formState: { errors }, handleSubmit, register, } = useForm();


  const clearCart = async () => {
    dispatch({
      type: "CLEAR_CART",
      payload: []
    });
    const cart = await getOrCreateCart(user.id);
    try {
      await supabase.from("carts")
      .delete()
      .eq("user_id", user?.id);
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
    navigate("/", replace);
  }
  const formSubmission = async orderCheckoutData => {
    const orderInfoData = {
      customer_phone: orderCheckoutData.customer_phone,
      delivery_address: orderCheckoutData.delivery_address,
      total_amount: total,
      user_id: user?.id
    }
    setLoading(true);
    setOrderFail(false);
    setOrdersucces(false);
    await new Promise((resolve) => setTimeout((resolve), 5000))
    try {
      const data = await createOrder(orderInfoData);
      const orderItemsData = state.cart.map((item) => ({
        order_id: data.id,
        menu_item_id: item.menu_item_id ?? item.menu_items.id,
        item_name: item.menu_items.name,
        price: item.menu_items.price,
        quantity: item.quantity
      }));

      console.log(
        "ORDER ITEMS PAYLOAD:",
        JSON.stringify(orderItemsData, null, 2)
      );

      await createOrderItem(orderItemsData);
      setOrdersucces(true);
      setTimeout(() => {
        clearCart();
      }, 2000);
    } catch (error) {
      toast.error("Failed to record order");
      setOrderFail(false)
    } finally {
      setLoading(false);
      setOrderFail(false);
    }

  }

  const formError = () => {
    toast.error("Please fill required fields to proceed checkout", { position: "bottom-right" })
  }
  return (
    <div className="checkout_order_container">
      <h2 className='flex items-center gap-4 font-semibold'>Checkout Order <CreditCardCheck /></h2>
      <div className="items_container max-w-4xl mt-4 overflow-x-auto">
        <table className='border-collapse border border-border w-full'>
          <thead>
            <tr>
              <th className='border border-gray-400 p-2 text-left'>Item</th>
              <th className='border border-gray-400 p-2 text-left'>Image</th>
              <th className='border border-gray-400 p-2 text-left'>Price</th>
              <th className='border border-gray-400 p-2 text-left'>Quantity</th>
              <th className='border border-gray-400 p-2 text-left'>Total</th>
            </tr>

          </thead>
          <tbody>
            {state.cart.map((item) => (
              <tr key={item.id}>
                <td className='text-sm border border-gray-400 p-2 text-left'>{item.menu_items.name}</td>
                <td className='border-b border border-gray-400 p-2 text-left'>
                  <img src={item.menu_items.image_url} alt={item.menu_items.name} className='w-10 h-10 object-cover' />
                </td>
                <td className='text-sm border border-gray-400 p-2 text-left'>{item.menu_items.price}</td>
                <td className='text-sm border border-gray-400 p-2 text-left'>{item.quantity}</td>
                <td className='text-sm border border-gray-400 p-2 text-left'>${(item.quantity * item.menu_items.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="total flex gap-4 justify-end mt-4">
          <h2>Total</h2>
          <h3 className="total_content font-black">${(total).toFixed(2)}</h3>
        </div>

        <button className='bg-primary text-white text-sm px-2 rounded cursor-pointer font-black py-2' onClick={() => setCheckoutMode(true)}>Proceed to checkout</button>
      </div>
      {isCheckoutMode && (
        <div className="modal_container fixed inset-0 bg-surface/25 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="content bg-text text-background p-4 rounded tex-text max-w-xl z-50 w-[90%]">
            {isLoading ? (
              <div className="loadin_container">
                <ProgressLoadingBar loading={isLoading} />
                <h2 className='text-sm font-semibold mt-4'>Processing your order...</h2>
              </div>
            ) : isOrderFail ? (
              <div className="error_order flex flex-col items-center justify-center gap-2">
                <BiErrorCircle className='text-3xl text-red-600' />
                <h2 className='font-black'>Order Failed</h2>
                <p className='text-xs text-background/55'>We couldn’t place your order. Please try again.</p>
              </div>
            ) : isOrderSuccess ? (
              <div className="success_container flex flex-col gap-8  h-fit justify-center">
                <div className="message flex flex-col items-center justify-center gap-2 text-center max-w-md mx-auto">
                  <h2 className='text-center font-black'>Order Placed Successfully!</h2>
                  <p className='text-xs text-background/65'>Thank you for your order. Your delicious food is being prepared. We'll keep you updated on your order status.</p>
                </div>
                <div className="order_succes mb-4">
                  <div className="border-b-3 border-border/10 border-dashed flex justify-between items-center relative">
                    <IoCheckmarkCircle className=' absolute top-1/2 bg-success/40 rounded-full text-4xl p-1 -translate-y-1/2 left-1/2 -translate-x-1/2' />
                    <FaShoppingCart className='text-3xl absolute top-1/2 -translate-y-1/2 left-0 bg-primary/40 text-bakground flex items-center justify-center p-1 rounded-full' />
                    <FaBoxOpen className='text-3xl absolute top-1/2 -translate-y-1/2 right-0 bg-primary/40 text-bakground flex items-center justify-center p-1 rounded-full' />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="header flex items-center justify-between">
                  <h2 className='font-black text-lg'>Checkout Form</h2>
                  <X className='cursor-pointer' onClick={() => setCheckoutMode(false)} />
                </div>
                <form className='flex  items-start gap-4 mt-4 flex-col' onSubmit={handleSubmit(formSubmission, formError)}>
                  <div className="inputs_container flex-col flex gap-4 md:flex-row md:items-center w-full">
                    <div className="input flex flex-col gap-1 flex-1">
                      <label htmlFor="delivery_address">Delivery Address</label>
                      <input type="text" placeholder='Delivery address'
                        className='border outline-none focus:border-2  border-card/45 bg-non rounded px-3 py-0.5 block '
                        {...register("delivery_address", {
                          required: "This field is required"
                        })}
                      />
                      <p className="erro_message text-xs text-red-600">{errors?.delivery_address?.message}</p>
                    </div>
                    <div className="input flex flex-col gap-1 flex-1">
                      <label htmlFor="customer_phone">Customer Phone</label>
                      <input type="text" placeholder='Phone number'
                        className='border outline-none focus:border-2 border-card/45 bg-none rounded px-3 py-0.5 block '
                        {...register("customer_phone", {
                          required: "This field is required",
                          pattern: {
                            value: /^[0-9]{9,15}$/,
                            message: "Phone number must contain 9–15 digits",
                          }
                        })}
                      />
                      <p className="erro_message text-xs text-red-600">{errors?.customer_phone?.message}</p>
                    </div>
                  </div>
                  <div className="btns flex items-center gap-4 flex-row">
                    <button type='button' className='text-sm text-red-500 cursor-pointer' onClick={() => setCheckoutMode(false)}>Cancel</button>
                    <button type='submit' className='bg-primary px-2 py-1.5 shadow-xl cursor-pointer text-xs md:text-sm rounded text-white'>Confirm Payment</button>
                  </div>
                </form>
              </>
            )
            }
          </div>
          {isCheckoutMode && (
            <button className='fixed inset-0 bg-surface/10 z-40' onClick={() => setCheckoutMode(false)}></button>
          )}
        </div>
      )}
    </div>
  )
}

export default CheckoutOrder