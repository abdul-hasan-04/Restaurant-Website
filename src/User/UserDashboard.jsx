import React, { useEffect, useOptimistic, useRef, useState } from 'react'
import useAuth from '../hooks/useAuth'
import { NavLink, Outlet, useOutletContext } from 'react-router';
import { CircleUserIcon, Heart, HomeIcon, LayoutDashboard, Menu, PanelLeft, Settings, ShoppingBag, ShoppingCart, SquareText, User, UserRoundCheck, UserShield, UserStar, Utensils, X } from 'lucide-react';
import { Avatar } from '@makozi/react-user-avatar-generator';
import UserSideBar from './UserSideBar';
function UserDashboard() {
  const { profile } = useAuth();
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
   const {isMobileMenuOpen,setIsMobileMenuOpen} = useOutletContext();
  return (
    <main className='flex min-h-[calc(100vh-64px)]'>
          <aside className='h-[calc(100vh-64px)] hidden lg:block'>
          <UserSideBar
          isOpen={isSideBarOpen}
          setIsOpen={setIsSideBarOpen}
          />
          </aside>

          <aside
        className={`
          lg:hidden fixed top-16 h-[calc(100vh-64px)] bottom-0 left-0 z-50
          transition-transform duration-400 ease-in-out
          ${isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }
        `}
      >
        <UserSideBar
          isOpen={true}
          setIsOpen={setIsMobileMenuOpen}
          profile={profile}
          mobile={true}
        />
      </aside>
        <div className="MainBar w-full bg-background lg:col-span-3 p-8 md:p-6 lg:p-8 overflow-y-auto h-[calc(100vh-68px)]">
          {/* CONTENT GOES HERE */}
          <Outlet />
        </div>
    </main>
  )
}

export default UserDashboard