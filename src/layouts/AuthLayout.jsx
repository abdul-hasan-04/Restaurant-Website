
import React, { useState } from "react";
import { Outlet } from "react-router";
import HeaderAuthLayout from "../components/HeaderAuthLayout";

function AuthLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <HeaderAuthLayout
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />

            <Outlet
                context={{
                    isMobileMenuOpen,
                    setIsMobileMenuOpen,
                }}
            />
        </>
    );
}

export default AuthLayout;
