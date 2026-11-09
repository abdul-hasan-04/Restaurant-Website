import React from 'react'
import useAuth from '../hooks/useAuth'
import { Navigate, Outlet } from 'react-router';
import TopLoadingBar from './TopLoadingBar';
import { toast } from 'react-toastify';

function UnAuthenticatedRoutes() {
  const {isLoggedIn,profile, isLoading,user} = useAuth();
  if(isLoading){
    return <TopLoadingBar loading={isLoading}/>
  }

  if(isLoggedIn) {
     if(profile?.role == "admin"){
       return <Navigate to={"/dashboard/admin"} replace/>
     }else{
        return <Navigate to={"/dashboard/user"} replace/>
     }
  }

  return <Outlet/>

}

export default UnAuthenticatedRoutes