import React, { useContext } from 'react'
import { cartContext } from '../context/CartContext'

function UseCart() {
  return (
    useContext(cartContext)
  )
}

export default UseCart