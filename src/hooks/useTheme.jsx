import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

import React from 'react'

function useTheme() {
  return (
    useContext(ThemeContext)
  )
}

export default useTheme