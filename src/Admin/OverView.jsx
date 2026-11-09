import { ChevronRight, ClipboardClock, ShoppingBag, Users, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { CgHomeAlt } from "react-icons/cg";
import { Link } from "react-router";
import useAuth from "../hooks/useAuth";
import { getAllOrders } from "../services/orderServices";
import { toast } from "react-toastify";
import supabase from "../lib/supabase";

function OverView() {
   const [orders,setOrders] = useState([]);
   const [menuItems,setMenuItems] = useState([]);
   const [customers,setCustomers] = useState([]);
   const {user} = useAuth();
   useEffect(() => {
      let isCancelled = false;
      const fetchOrders = async () => {
         try {
            const {data} = await getAllOrders();
            if(isCancelled) return;
            setOrders(data)
         } catch (error) {
             if(isCancelled) return;
             toast.error("Failed to fetch orders");
         }
      }
      fetchOrders();
      return () => isCancelled = true
   },[user?.id]);

   useEffect(() => {
        let isCancelled = false;
      const fetchUsers = async () => {
         try {
            const {data} = await supabase.from("users").select("*")
            if(isCancelled) return;
            setCustomers(data)
         } catch (error) {
             if(isCancelled) return;
             toast.error("Failed to fetch customers");
         }
      }
      fetchUsers();
      return () => isCancelled = true
   },[user?.id]);

   useEffect(() => {
        let isCancelled = false;
      const fetchUsers = async () => {
         try {
            const {data} = await supabase.from("menu_items").select("*")
            if(isCancelled) return;
            setMenuItems(data)
         } catch (error) {
             if(isCancelled) return;
             toast.error("Failed to fetch menu items");
         }
      }
      fetchUsers();
      return () => isCancelled = true
   },[user?.id]);


  return (
    <div className="overView_container overflow-y-auto">
        <div className="location_indicator flex items-center gap-1">
             <Link to={"/"} className='flex items-center gap-2' ><CgHomeAlt className="text-xl text-text/30 cursor-pointer"/><ChevronRight/></Link>
             <h2 className="font-semibold">Dashboard</h2>
        </div>
        <div className="header_text mt-8 flex flex-col gap-2">
             <h1 className="text-xl md:text-3xl font-semibold lg:text-3xl">Overview</h1>
             <p className="text-xs md:text-[15px] text-text/85">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="overview_cards_container flex gap-4 flex-col md:flex-row  flex-wrap md:*:w-[calc(25%-12px)] mt-8 *:cursor-pointer *:flex *:flex-col *:gap-2">
          {/* orders */}
             <div className="card bg-card border border-border rounded-lg p-2 shadow-2xl shadow-background/5">
                 <ShoppingBag className="text-primary"/>
                 <h2>Orders</h2>
                 <h4 className="count font-black text-xl">{orders.length}</h4>
             </div>
             <div className="card bg-card border border-border rounded-lg p-2 shadow-2xl shadow-background/5">
                 <ClipboardClock className="text-primary" />
                 <h2>Pending Orders</h2>
                 <h4 className="count font-black text-xl">{orders.filter((order) => order.status === "pending").length}</h4>
             </div>
             <div className="card bg-card border border-border rounded-lg p-2 shadow-2xl shadow-background/5">
                 <Utensils className="text-primary" />
                 <h2>Menu Items</h2>
                 <h4 className="count font-black text-xl">{menuItems.length}</h4>
             </div>
             <div className="card bg-card border border-border rounded-lg p-2 shadow-2xl shadow-background/5">
                 <Users className="text-primary" />
                 <h2>Customers</h2>
                 <h4 className="count font-black text-xl">{customers.filter((customer) => customer.role === "customer").length}</h4>
             </div>
        </div>
        {/* latest orders list goes here */}
    </div>
  )
}

export default OverView