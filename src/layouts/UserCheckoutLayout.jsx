import React from 'react'
import HeaderAuthLayout from '../components/HeaderAuthLayout'
import { Navigate, Outlet } from 'react-router'
import UseCart from '../hooks/UseCart'

function UserCheckoutLayout({children}) {
  const {state} = UseCart();
  if(state.cart.length === 0) {
     return <Navigate to={"/"} replace/>
  }
  return (
    <main>
       {children}
    </main>
  )
}

export default UserCheckoutLayout