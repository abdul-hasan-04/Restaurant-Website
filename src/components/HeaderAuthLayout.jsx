import React, { useEffect, useState } from "react";
import useTheme from "../hooks/useTheme";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { RiHomeSmile2Line } from "react-icons/ri";
import { CiDark, CiLight } from "react-icons/ci";
import useAuth from "../hooks/useAuth";
import { CgLogOut } from "react-icons/cg";
import { IoBagOutline } from "react-icons/io5";
import { Avatar } from "@makozi/react-user-avatar-generator";
import TopLoadingBar from "./TopLoadingBar";
import { BsArrowReturnLeft } from "react-icons/bs";
import logo from "../assets/Minimal_Green_Chef_Hat_Logo-.png";
import {
  LayoutDashboard,
  Menu,
  PanelLeft,
  Settings,
  ShoppingBag,
  User,
  UserRoundCheck,
  UserStar,
  Utensils,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
function HeaderAuthLayout({ isMobileMenuOpen,
  setIsMobileMenuOpen }) {
  const { profile, isLoggedIn, user, isLoading, logout } = useAuth();
  const [isprofileMenuOpen, setIsprofileOpen] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();
  useEffect(() => {
    if (isprofileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isprofileMenuOpen]);
  return (
    <>
      <header className="bg-surface h-16 border-[0.1px] border-text/15 relative z-50">
        <nav className="flex items-center h-full justify-between max-w-400 px-4 md:px-6 lg:px-8 mx-auto">
          {/* logo here */}
          <div className="left_side flex gap-4 items-center">
            {isMobileMenuOpen ? (
              <X
                className="w-8 lg:hidden cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            ) : (
              <Menu
                className="w-8 lg:hidden cursor-pointer"
                onClick={() => setIsMobileMenuOpen(true)}
              />
            )}
            <div className="logo">
              <img
                src={logo}
                alt={"Logo"}
                className="w-20"
              />
            </div>
            {/* home page redirector icon */}
            <Link className="flex text-sm  items-center gap-1" to={"/"}>
              Home {<BsArrowReturnLeft />}
            </Link>
          </div>
          {/* OTHER FEATURE IF NEEDED */}

          <div className="right flex items-center gap-4">
            {theme === "light" ? (
              <CiLight
                className="text-2xl cursor-pointer"
                onClick={toggleTheme}
              />
            ) : (
              <CiDark
                className="text-2xl cursor-pointer"
                onClick={toggleTheme}
              />
            )}
            <div
              className={`avatar hidden sm:block ${isprofileMenuOpen ? "*:border-2 *:border-text" : ""}`}
              onClick={() => setIsprofileOpen(!isprofileMenuOpen)}
            >
              <Avatar
                name={profile?.full_name || profile?.email}
                size={36}
                fontSize={13}
                textColor="text"
                backgroundColor="primary"
                style={{ cursor: "pointer" }}
              />
            </div>
            {isprofileMenuOpen && (
              <div className="profile_menu_dropDown max-w-80 flex flex-col gap-4 items-start right-0 mx-4 md:mx-10 lg:mx-12 top-16 absolute p-3 rounded-md shadow-xl border-text/20 border bg-background z-50">
                <div className="user_profile flex gap-2">
                  <Avatar
                    name={profile?.full_name || user?.user_metadata?.full_name}
                    size={37}
                    fontSize={13}
                    textColor="text"
                    backgroundColor="primary"
                    style={{ cursor: "pointer" }}
                  />
                  {/* user_profile_details.... */}
                  <div className="user_info_text text-xs">
                    <h3 className="font-semibold">{profile?.full_name}</h3>
                    <h2>{profile?.email}</h2>
                  </div>
                </div>
                {/* OTHER OPTIONS LIKE SETTING, PROFILE, DASHBOARD */}
                <div className="border-b border border-text/15 w-full"></div>
                {/* LOGOUT BTN */}
                <button
                  className="hover:bg-surface flex w-full cursor-pointer items-center gap-2 hover:text-red-600 hover:font-semibold py-2 px-6 rounded-full text-text text-[12px]"
                  onClick={() => {
                    if (isLoading) {
                      return <TopLoadingBar loading={isLoading} />;
                    }
                    logout();
                    navigate("auth/login");
                  }}
                >
                  <CgLogOut className="text-xl" /> Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>
      {isprofileMenuOpen && (
        <button
          className="fixed inset-0 z-10"
          onClick={() => setIsprofileOpen(false)}
        ></button>
      )}
    </>
  );
}

export default HeaderAuthLayout;
