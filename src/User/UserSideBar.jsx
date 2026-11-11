import { Avatar } from '@makozi/react-user-avatar-generator'
import { Heart, HomeIcon, PanelLeft, Settings, ShoppingCart, SquareText, UserRoundCheck, UserStar, Utensils } from 'lucide-react'
import React from 'react'
import useAuth from '../hooks/useAuth'
import UseCart from '../hooks/UseCart';
import { NavLink } from 'react-router';

function UserSideBar({ isOpen, setIsOpen, mobile = false}) {
    const {profile} = useAuth();
    const {state} = UseCart();

    const handleNavigate = () => {
  if (mobile) {
    setIsOpen(false);
  }
};
  return (
    <div>
          {/* SIDE BAR */}
          <aside className={`bg-surface flex-col flex transition-[width] ease-in-out duration-200 border-[0.1px] h-[calc(100vh-68px)] border-text/15 ${mobile ? "w-70" : isOpen ? "w-70" : "w-24"}`}>
            <div className="header border border-text/5 shrink-0 h-16 p-8 flex items-center justify-center relative">
             {!mobile && (
                <PanelLeft className={`absolute cursor-pointer w-4 ${isOpen ? "right-4" : ""}`} onClick={() => setIsOpen(!isOpen)} />
              )}
            </div>
            <div className="links_container flex-1 font-black flex flex-col gap-2 min-h-0 p-8  overflow-y-auto">
              {/* link item */}
              <NavLink to={"/dashboard/user"}
                onClick={handleNavigate}
                end
                className={({ isActive }) => `py-2 text-sm px-2 flex items-center gap-3 rounded-md  ${isActive ? "bg-text font-semibold text-background" : ""}`}> <HomeIcon className='w-4' /> {isOpen ? "Home" : ""} </NavLink>
              <NavLink

                to={"/menu"}
                className={({ isActive }) =>
                  `py-2 text-sm px-2 flex items-center gap-3 font-black rounded-md ${isActive ? "bg-text font-semibold text-background" : ""
                  }`
                }
              >
                <Utensils className='w-4' />
                {isOpen ? "Browse Menus" : ""}
              </NavLink>
              <NavLink
               onClick={handleNavigate}
                to={"/dashboard/user/orders"}
                className={({ isActive }) =>
                  `py-2 text-sm px-2 flex items-center gap-3 font-black rounded-md ${isActive ? "bg-text font-semibold text-background" : ""
                  }`
                }
              >
                <SquareText className='w-4' />
                {isOpen ? "My Orders" : ""}
              </NavLink>
              <NavLink
               onClick={handleNavigate}
                to={"/dashboard/user/cart"}
                className={({ isActive }) =>
                  `py-2 text-sm px-2 flex items-center  relative gap-3 font-black rounded-md ${isActive ? "bg-text font-semibold text-background" : ""
                  }`
                }
              >
                <ShoppingCart className='w-4' />
                <span className='absolute top-1/2 -translate-y-1/2 right-2 bg-text text-background w-5 h-5 text-xs flex items-center justify-center rounded-full'>{state.cart.length ?? 0}</span>
                {isOpen ? "My Cart" : ""}
              </NavLink>
              <NavLink
                onClick={handleNavigate}
                to={"/dashboard/user/favorite-meals"}
                className={({ isActive }) =>
                  `py-2 text-sm px-2 flex items-center gap-3 font-black rounded-md ${isActive ? "bg-text font-semibold text-background" : ""
                  }`
                }
              >
                <Heart className='w-4' />
                {isOpen ? "Favorites" : ""}
              </NavLink>
            </div>
            <div className="bg-background">
              <div className="wrapper p-6">
                {isOpen ? (
                  <div className="role_bar_shape items-center  px-4 py-1 rounded-full justify-between border flex">
                    <UserRoundCheck className='h-auto' />
                    <h2 className='font-black text-xs uppercase'>{profile?.role}</h2>
                  </div>
                ) : <UserStar className='w-10 cursor-pointer' />
                }
              </div>
              <div className="border-b border-text/10"></div>
              <div className="user_profile_container flex p-6 items-center gap-2">
                <div className="avatar_icon">
                  <Avatar name={profile?.full_name || profile?.email} size={35} fontSize={13} backgroundColor="#60A5FA" style={{ cursor: "pointer" }} />
                </div>
                {isOpen && (
                  <>
                    <h2 className="user_email text-sm truncate">{profile?.email}</h2>
                    <Settings className='w-5 shrink-0 cursor-pointer' />
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
  )
}

export default UserSideBar