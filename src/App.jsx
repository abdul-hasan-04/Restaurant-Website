import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router'
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import MenuRestaurant from "./pages/MenuRestaurant";
import Contact from "./pages/Contact";
import UnAuthenticatedRoutes from './components/UnAuthenticatedRoutes';
import PublicLayout from './layouts/PublicLayout';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './Admin/Dashboard';
import UserDashboard from './User/UserDashboard';
import AuthLayout from './layouts/AuthLayout';
import OverView from './Admin/OverView';
import Orders from './Admin/Orders';
import MenuItems from './Admin/MenuItems';
import UserFavouriteMenus from './User/UserFavouriteMenus';
import UserCartPage from './User/UserCartPage';
import UserOrdePage from './User/UserOrdePage';
import HomeDashbaordUser from './User/HomeDashbaordUser';
import ErrorPage from './components/PageNotFound';
import IdentifyDashboard from './components/IdentifyDashboard';
import CheckoutOrder from './User/CheckoutOrder';
import UserCheckoutLayout from './layouts/UserCheckoutLayout';
import ManageProfile from './Admin/ManageProfile';
function App() {
   return (
      <div className="app">
         <main>
            <Routes>

               {/* PUBLIC ROUTES EVERY USER CAN VISIT */}
               <Route element={<PublicLayout />}>
                  <Route path='/' element={<HomePage />} />
                  <Route path='/about'element={<AboutUs />}/>
                  <Route path='/menu' element={<MenuRestaurant />} />
                  <Route path='/contact' element={<Contact />} />
               </Route>
               {/* AUTHENTICATED ROUTES // AUTH PAGE || SIGNUP AND LOGIN */}
               <Route element={<UnAuthenticatedRoutes />}>
                  <Route
                     path="auth/register"
                     element={<AuthPage />}
                  />

                  <Route
                     path="auth/login"
                     element={<AuthPage isLoggin={true} />}
                  />
               </Route>
               {/* PROTECTED ROUTES */}

               <Route element={<AuthLayout/>}>
                  <Route path='/dashboard' element={<IdentifyDashboard/>}/>
                  {/* Dashbaord Big Route that wraps every page route inside user Dashbaord */}
                  <Route path="/dashboard/user"
                     element={
                        <ProtectedRoute adminOnly={false}>
                           <UserDashboard />
                        </ProtectedRoute>
                     }>

                     {/* childe routes for user route */}
                     <Route index element={<HomeDashbaordUser />} />
                     <Route path="orders" element={<UserOrdePage />} />
                     <Route path="cart" element={<UserCartPage />} />
                     <Route path="favorite-meals" element={<UserFavouriteMenus />} />
                     <Route path="manage-user-profile" element={<ManageProfile />} />
                     <Route path="checkout/:cart_id" element={<UserCheckoutLayout>
                         <CheckoutOrder/>
                     </UserCheckoutLayout>} />

                  </Route>

                  {/* Dashbaord Big Route that wraps every page route inside Admin Dashbaord */}
                  <Route
                     path="/dashboard/admin"
                     element={
                        <ProtectedRoute adminOnly>
                           <Dashboard />
                        </ProtectedRoute>
                     }
                  >
                     {/* child routes for admin route */}
                     <Route index element={<OverView />} />
                     <Route path='orders' element={<Orders />}></Route>
                     <Route path='menu-items' element={<MenuItems />} />
                     <Route path='manage-admin-profile' element={<ManageProfile />} />
                  </Route>

               </Route>
                 <Route path="*" element={<ErrorPage />} />
            </Routes>
         </main>
      </div>
   )
}

export default App