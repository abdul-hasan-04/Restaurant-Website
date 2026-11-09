import { NavLink } from "react-router";
import {
  LayoutDashboard,
  ShoppingBag,
  Utensils,
  PanelLeft,
  UserRoundCheck,
  UserStar,
  Settings,
  UserCog,
} from "lucide-react";
import { Avatar } from "@makozi/react-user-avatar-generator";
import { useEffect } from "react";

function AdminSidebar({ isOpen, setIsOpen, profile, mobile = false }) {

  return (
    <aside
      className={`
        bg-surface h-full flex flex-col
        border-r border-text/15
        transition-all duration-200 ease-in-out

        ${mobile ? "w-70" : isOpen ? "w-70" : "w-24"}
      `}
    >
      {/* Sidebar header */}
      <div className="h-16 shrink-0 px-6 flex items-center justify-end border-b border-text/5">
        <PanelLeft
          className="w-5 cursor-pointer"
          onClick={() => {
            if (mobile) {
              setIsOpen(false);
            } else {
              setIsOpen(!isOpen);
            }
          }}
        />
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col gap-2 p-6 overflow-y-auto">
        <NavLink
          to="/dashboard/admin"
          end
          className={({ isActive }) =>
            `py-3 px-3 text-sm flex items-center gap-3 rounded-md
            ${isActive ? "bg-text text-background" : ""}`
          }
        >
          <LayoutDashboard className="w-5 shrink-0" />
          {isOpen || mobile ? "Dashboard" : ""}
        </NavLink>

        <NavLink
          to="/dashboard/admin/orders"
          className={({ isActive }) =>
            `py-3 px-3 text-sm flex items-center gap-3 rounded-md
            ${isActive ? "bg-text text-background" : ""}`
          }
        >
          <ShoppingBag className="w-5 shrink-0" />
          {isOpen || mobile ? "Orders" : ""}
        </NavLink>

        <NavLink
          to="/dashboard/admin/menu-items"
          className={({ isActive }) =>
            `py-3 px-3 text-sm flex items-center gap-3 rounded-md
            ${isActive ? "bg-text text-background" : ""}`
          }
        >
          <Utensils className="w-5 shrink-0" />
          {isOpen || mobile ? "Menu Items" : ""}
        </NavLink>
        <NavLink
          to="/dashboard/admin/manage-admin-profile"
          className={({ isActive }) =>
            `py-3 px-3 text-sm flex items-center gap-3 rounded-md
            ${isActive ? "bg-text text-background" : ""}`
          }
        >
          <UserCog className="w-5 shrink-0" />
          {isOpen || mobile ? "Manage Profile" : ""}
        </NavLink>
      </div>

      {/* User information */}
      <div className="bg-background">
        <div className="p-6">
          {isOpen || mobile ? (
            <div className="flex items-center justify-between border rounded-full px-4 py-2">
              <UserRoundCheck className="w-5" />
              <span className="text-sm font-black uppercase">
                {profile?.role}
              </span>
            </div>
          ) : (
            <UserStar className="w-8" />
          )}
        </div>

        <div className="border-b border-text/10" />

        <div className="flex items-center gap-3 p-6">
          <Avatar
            name={profile?.full_name || profile?.email}
            size={35}
            fontSize={13}
            backgroundColor="#60A5FA"
          />

          {(isOpen || mobile) && (
            <>
              <span className="text-sm truncate flex-1">{profile?.email}</span>
              <Settings className="w-5 shrink-0" />
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
