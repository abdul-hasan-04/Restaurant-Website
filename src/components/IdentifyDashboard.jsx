import React from 'react'
import useAuth from '../hooks/useAuth'
import TopLoadingBar from './TopLoadingBar';
import { Navigate } from 'react-router';

function IdentifyDashboard() {
  const {profile,isLoading} = useAuth();
  if(isLoading){
    return <TopLoadingBar loading={isLoading}/>
  }
  if(profile?.role =="admin" || "superAdmin"){
    return <Navigate to={"/dashboard/admin"} replace/>
  }

  return <Navigate to={"/dashboard/user"} replace/>
}

export default IdentifyDashboard