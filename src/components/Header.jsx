import React, { useEffect, useState } from 'react'
import useTheme from '../hooks/useTheme';
import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import { CiCircleMinus, CiDark, CiLight } from 'react-icons/ci';
import { FaBars, FaShoppingBag } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import { Avatar } from '@makozi/react-user-avatar-generator';
import { IoCloseSharp } from 'react-icons/io5';
import { CgLogOut } from 'react-icons/cg';
import TopLoadingBar from './TopLoadingBar';
import { CircleMinus, CirclePlus, PlusIcon, ShoppingBag, ShoppingCartPlus, Trash, Utensils, UtensilsIcon, X } from 'lucide-react';
import { deleteCartItem, getCartItem, getOrCreateCart, updateCartItem } from '../services/cartServices';
import { toast } from 'react-toastify';
import UseCart from '../hooks/UseCart';
import supabase from '../lib/supabase';
import logo from "../assets/Minimal_Green_Chef_Hat_Logo-.png"
import { signInWithGoogle } from '../services/authServices';
import { FcGoogle } from 'react-icons/fc';
function Header() {
  const { profile, isLoggedIn, user, isLoading, logout } = useAuth();
  const [isprofileMenuOpen, setIsprofileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartMenuOpen, setIsCartMenuOpen] = useState(false);
  const [onCheckout, setOnCheckout] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { state, dispatch } = UseCart();
  const navigate = useNavigate();

  // total price //

  const total = state.cart.reduce((acc, current) => acc + current.quantity * current.menu_items.price, 0)
  useEffect(() => {
    if (isCartMenuOpen || isprofileMenuOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = ""
    }
  }, [isCartMenuOpen, isprofileMenuOpen]);


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


  const handleDeleteCartItem = async item => {
    dispatch({
      type: "DELETE_ITEM",
      payload: item.menu_items.id
    })
    try {
      await deleteCartItem(item.id)
    } catch (error) {
      // ROLL_BACK DELETE_ITEM //
      dispatch({
        type: "ROLL_BACK_UPDATE_QUANTITY",
        payload: item
      })
    }
  }

  const handleClearCart = async () => {
    dispatch({
      type: "CLEAR_CART",
      payload: []
    });
    const cart = await getOrCreateCart(user.id)
    try {
        await supabase.from("carts")
      .delete()
      .eq("user_id", user?.id);
      await supabase.from("cart_items")
        .delete()
        .eq("cart_id", cart.id)
    } catch (error) {
      dispatch({
        type: "ROLL_BACK_CLEAR",
        payload: state.cart
      })
    }
  }

  const handleSignWithGoogle = async () => {
    await signInWithGoogle();
  }
  return (
    <>
      <header className='h-16 bg-surface text-text shadow'>
        <nav className='max-w-7xl w-full mx-auto flex items-center justify-between h-full relative px-4 md:px-10 lg:px-12'>
          {/* logo left */}
          <div className="logo flex items-center">
            <img onClick={() => navigate("/")} src={logo} alt="logo-png" className='w-14 md:w-18 h-auto cursor-pointer' />
            <h2 className='font-semibold'>Villet Chef</h2>
          </div>
          {/* arge_screens_navigation */}
          <div className="navigation_links hidden *:transition-all *:text-sm *:py-0.5 *:px-3 *:duration-100 sm:flex gap-2">
            <NavLink to={"/"} className={({ isActive }) => isActive ? "bg-text/5 font-semibold rounded-full" : ""}>Home</NavLink>
            <NavLink to={"/about"} className={({ isActive }) => isActive ? "bg-text/5 font-semibold rounded-full" : ""}>About</NavLink>
            <NavLink to={"/menu"} className={({ isActive }) => isActive ? "bg-text/5 font-semibold rounded-full" : ""}>Menu</NavLink>
            <NavLink to={"/contact"} className={({ isActive }) => isActive ? "bg-text/5 font-semibold rounded-full" : ""}>Contact</NavLink>
          </div>
          {/* Other Header Elements [signup and login button, toggletheme, shopping_cart icon, profile Icon based on Authenticated or not] */}
          <div className="right_side flex items-center gap-4">
            {theme === "light" ? <CiLight className='text-2xl cursor-pointer' onClick={toggleTheme} /> : <CiDark className='text-2xl cursor-pointer' onClick={toggleTheme} />}
            {isLoggedIn ? (
              <>
                <div className="shopping_bag_container relative" onClick={() => setIsCartMenuOpen(true)}>
                  <FaShoppingBag className='cursor-pointer text-xl' />
                  <span className="count_cart_lenght text-background -top-3 -right-2 bg-text w-4 h-4 absolute text-xs rounded-full flex items-center justify-center text-center font-black">{state.cart.length}</span>
                </div>
                {/* ONLY IN LARGE SCREENS */}
                <div className={`avatar  ${isprofileMenuOpen ? "*:border-2 *:border-text" : ""}`} onClick={() => setIsprofileOpen(!isprofileMenuOpen)}>
                  <Avatar name={profile?.full_name} backgroundColor={"primary"} textColor='text' />
                </div>
                {/* HUMBUGER MENU FOR ONLY SMALL SCREENS  */}
                {isprofileMenuOpen && (
                  <div className="profile_menu_dropDown flex flex-col gap-1 md:max-w-sm w-full items-start  md:right-0 right-0  md:mx-10 lg:mx-12 top-16 absolute p-3 rounded-md shadow-xl border-text/20 border bg-background z-50">
                    <div className='user_profile flex gap-2'>
                      <Avatar name={profile?.full_name} backgroundColor={"primary"} textColor='text' />
                      {/* user_profile_details.... */}
                      <div className="user_info_text text-xs">
                        <h3 className='font-semibold'>{profile?.full_name}</h3>
                        <h2>{profile?.email}</h2>
                      </div>
                    </div>
                    <div className="border-b border border-text/15 w-full"></div>
                    {/* OTHER OPTIONS LIKE SETTING, PROFILE, DASHBOARD */}
                    <div className="lg:hidden flex flex-col *:flex-1 w-full">
                      <Link className='hover:bg-surface cursor-pointer w-full items-center gap-2 hover:font-semibold py-2 px-6 rounded-full text-text text-[12px]' to={"/"} onClick={() => setIsprofileOpen(false)}>Home</Link>
                      <Link className='hover:bg-surface cursor-pointer w-full items-center gap-2 hover:font-semibold py-2 px-6 rounded-full text-text text-[12px]' to={"/about"} onClick={() => setIsprofileOpen(false)}>About</Link>
                      <Link className='hover:bg-surface cursor-pointer w-full items-center gap-2 hover:font-semibold py-2 px-6 rounded-full text-text text-[12px]' to={"/menu"} onClick={() => setIsprofileOpen(false)}>Menu</Link>
                      <Link className='hover:bg-surface cursor-pointer w-full items-center gap-2 hover:font-semibold py-2 px-6 rounded-full text-text text-[12px]' to={"/contact"} onClick={() => setIsprofileOpen(false)}>Contact</Link>
                      <div className="border-b border border-text/15 w-full"></div>
                    </div>
                    <Link className='hover:bg-surface cursor-pointer w-full items-center gap-2 hover:font-semibold py-2 px-6 rounded-full text-text text-[12px]' to={`/dashboard/${profile?.role == "admin" ? "admin" : "user"}`}>Dashboard</Link>
                    <Link className='hover:bg-surface cursor-pointer w-full items-center gap-2 hover:font-semibold py-2 px-6 rounded-full text-text text-[12px]' to={`/dashboard/${profile?.role == "admin" ? "admin" : "user"}/${profile?.role === "admin" ? "/manage-admin-profile" : "/manage-user-profile"}`}>Profile Management</Link>
                    {profile?.role === "admin" && <Link className='hover:bg-surface cursor-pointer w-full items-center gap-2 hover:font-semibold py-2 px-6 rounded-full text-text text-[12px]' to={`/dashboard/${profile?.role == "admin" ? "admin" : "user"}/${profile.role === "admin" ? "/menu-items" : "/menu"}`}>{profile.role === "admin" ? "Menu-Management" : "Menu"}</Link>}
                    <Link className='hover:bg-surface cursor-pointer w-full items-center gap-2 hover:font-semibold py-2 px-6 rounded-full text-text text-[12px]' to={`/dashboard/${profile?.role == "admin" ? "admin" : "user"}/${profile?.role === "admin" ? "/orders" : "/orders"}`}>{profile?.role === "admin" ? "Orders-Management" : "Your Order"}</Link>
                    {profile?.role === "customer" && <Link className='hover:bg-surface cursor-pointer w-full items-center gap-2 hover:font-semibold py-2 px-6 rounded-full text-text text-[12px]' to={"/dashboard/user/favorite-meals"}>Your Fav Meals</Link>}
                    {/* LOGOUT BTN */}
                    <button className='hover:bg-surface flex w-full cursor-pointer items-center gap-2 hover:text-red-600 hover:font-semibold py-2 px-6 rounded-full text-text text-[12px]' onClick={() => {
                      if (isLoading) {
                        return <TopLoadingBar loading={isLoading} />
                      }
                      logout();
                      navigate("auth/login")
                    }}><CgLogOut className='text-xl' /> Logout</button>
                  </div>
                )}
              </>
            ) : (
              // signup or login buttons //
              <>
                <div className="btns_container hidden lg:flex items-center gap-4 text-xs *:cursor-pointer">
                  <Link to={"auth/login"} className='hover:bg-surface py-1 px-3 border rounded-full'>Sign In</Link>
                  <Link to={"auth/register"} className='bg-text text-background py-1 px-3 rounded-full'>Get Started</Link>
                </div>
                <button className='text-xs cursor-pointer bg-background border border-text/20 px-2 py-1.5 rounded-full flex items-center gap-2' onClick={handleSignWithGoogle}>SignIn With Google <FcGoogle className='text-lg' /></button>
                {isMobileMenuOpen ? <IoCloseSharp className='sm:hidden text-lg' onClick={() => setIsMobileMenuOpen(false)} /> : <FaBars className='sm:hidden text-lg' onClick={() => setIsMobileMenuOpen(true)} />}
              </>
            )
            }
          </div>
          {/* MOBILE MENU */}
          {isMobileMenuOpen && (
            <div className="mobile_menu bg-background flex flex-col gap-3 sm:hidden absolute mx-4 border border-text/20 top-18 p-2 right-0 left-0 rounded-md z-50">
              {/* website navigation links, e.g #home,#about,#contact */}
              <div className="links flex flex-col gap-4 *:py-2 *:px-4 *:hover:bg-text/5 *:text-sm *:rounded-full ">
                <NavLink onClick={() => setIsMobileMenuOpen(false)} to={"/"} className={({ isActive }) => isActive ? "bg-text/5 font-semibold rounded-full" : ""}>Home</NavLink>
                <NavLink onClick={() => setIsMobileMenuOpen(false)} to={"/about"} className={({ isActive }) => isActive ? "bg-text/5 font-semibold rounded-full" : ""}>About</NavLink>
                <NavLink onClick={() => setIsMobileMenuOpen(false)} to={"/menu"} className={({ isActive }) => isActive ? "bg-text/5 font-semibold rounded-full" : ""}>Menu</NavLink>
                <NavLink onClick={() => setIsMobileMenuOpen(false)} to={"/contact"} className={({ isActive }) => isActive ? "bg-text/5 font-semibold rounded-full" : ""}>Contact</NavLink>
              </div>
              <div className="border-b border border-text/15 w-full"></div>
              <div className="btns_container flex flex-col *:w-full lg:hidden items-center gap-2.5 text-sm *:cursor-pointer">
                <Link to={"auth/login"} className='hover:bg-surface text-center py-2 px-3 border rounded-full'>Sign In</Link>
                <Link to={"auth/register"} className='bg-text text-center text-background py-2 px-3 rounded-full'>Get Started</Link>
                <button className='text-xs cursor-pointer bg-background border border-text/20 px-2 py-1.5 rounded-full flex items-center gap-2' onClick={handleSignWithGoogle}>SignIn With Google <FcGoogle className='text-lg' /></button>
              </div>
            </div>
          )}
        </nav>
        {/* overlay button remover */}
        {isprofileMenuOpen && (
          <button className='fixed inset-0 z-10' onClick={() => setIsprofileOpen(false)}></button>
        )}
      </header>

      <div className={`cart_menu flex flex-col fixed  inset-y-0 overflow-hidden right-0 bg-surface w-full h-full lg:w-lg z-50 overflow-y-auto transition-transform ease-in-out transform duration-300 ${isCartMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="top h-16 flex items-center justify-between px-4">
          <h2 className='font-bold'>Your Cart</h2>
          <div className="right flex items-center gap-2">
            <span className='text-sm font-black'>{state.cart.length}</span>
            <X className='w-5 cursor-pointer' onClick={() => setIsCartMenuOpen(false)} />
          </div>
        </div>
        <div className="border-b border-text/50"></div>
        <div className="cart_body min-h-0 flex-1">
          {state.cart.length === 0 ? (
            <div className="cart_empty h-[calc(100vh-68px)] flex flex-col items-center justify-center gap-4">
              <div className="icon_container bg-background border border-border px-4 py-2 rounded">
                <ShoppingBag />
              </div>
              <div className="text flex flex-col gap-8 max-w-72 items-center justify-center text-center">
                <h2 className='font-black text-balance md:text-lg'>Your cart is empty</h2>
                <p className='text-text/60 text-xs'>You haven’t added any items yet. Browse our menu to get started!</p>
                <Link to={"/menu"} className='flex items-center gap-3 bg-text font-black md:text-sm text-background px-3.5 rounded-full text-xs py-1' onClick={() => setIsCartMenuOpen(false)}>Explore Menus <Utensils className='w-5' /></Link>

              </div>
            </div>
          ) : (
            <div className="cart_items_wrapper p-4 flex flex-col gap-4">
              {
                state.cart.map((item) => (
                  <div key={item.id ?? item.menu_item_id} className='flex flex-col gap-4'>
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
            </div>
          )}
        </div>
        {state.cart.length > 0 && (
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
                  className={`absolute inset-y-0 left-0 bg-on-primary  transition-all duration-400 ${onCheckout ? "w-full" : "w-0"
                    }`}
                />
              </button>

              <button type='button' className='text-xs text-text/60 cursor-pointer' onClick={handleClearCart}>Clear cart</button>
            </div>
          </div>

        )}
      </div>
      {isCartMenuOpen && (
        <button className='bg-card/10 fixed inset-0 backdrop-blur-[2px] z-40' onClick={() => setIsCartMenuOpen(false)}></button>
      )}
    </>
  )
}

export default Header