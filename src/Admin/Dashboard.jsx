
import React, { useState } from "react";
import { Outlet, useOutletContext } from "react-router";
import useAuth from "../hooks/useAuth";
import AdminSidebar from "../components/AdminSideBar";

function Dashboard() {
  const { profile } = useAuth();

  // Desktop sidebar has its own independent state
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  // Mobile sidebar state comes from HeaderAuthLayout
  const {
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useOutletContext();
  return (
    <main className="flex min-h-[calc(100vh-64px)]">

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:block shrink-0 h-[calc(100vh-64px)]">
        <AdminSidebar
          isOpen={isSideBarOpen}
          setIsOpen={setIsSideBarOpen}
          profile={profile}
        />
      </aside>

      {/* MOBILE SIDEBAR */}
      <div
        className={`
          lg:hidden fixed top-16 left-0 z-50
          h-[calc(100vh-64px)]
          transition-transform duration-200 ease-in-out
          ${isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }
        `}
      >
        <AdminSidebar
          isOpen={true}
          setIsOpen={setIsMobileMenuOpen}
          profile={profile}
          mobile={true}
        />
      </div>

      {/* MOBILE BACKDROP */}
      {isMobileMenuOpen && (
        <button
          aria-label="Close navigation menu"
          className="lg:hidden fixed inset-0 top-16 bg-black/40 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* DASHBOARD CONTENT */}
      <section className="
        flex-1 min-w-0
        bg-background
        h-[calc(100vh-64px)]
        overflow-y-auto
        p-4 md:p-6 lg:p-8
      ">
        <Outlet />
      </section>

    </main>
  );
}

export default Dashboard;
