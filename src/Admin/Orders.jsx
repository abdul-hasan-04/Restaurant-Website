import { ChevronLeft, ChevronRight, Search, User } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { BiRightArrow } from 'react-icons/bi';
import { CgHomeAlt } from 'react-icons/cg'
import { Link } from 'react-router'
import useAuth from '../hooks/useAuth';
import { getAllOrders, getOrder, subscribeToOrders } from '../services/orderServices';
import ProgressLoadingBar from '../components/ProgressLoadingBar';
import { getStatusColor } from "../utils/statusOrderCustom"
import { formatOrderDate } from "../utils/dateFormater";
import OrderItem from './OrderItem';
import supabase from '../lib/supabase';
function Orders() {
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [searchedTerm,setSearchedTerm] = useState("");
  const [currentPage,setCurrentPage] = useState(1);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [count,setCount] = useState(null);
  const { user } = useAuth();
  const getCurrentStatusColor = status => {
    if (status == selectedOrderStatus) {
      return "bg-accent"
    } else {
      return ""
    }
  }
  const limit = 6;
  const offset = (currentPage - 1) * limit;
  const totalPages = Math.ceil(count / limit);

useEffect(() => {
    if (!user?.id) return;

    let isCancelled = false;

    const fetchOrders = async () => {
        try {
            const {data,count} = await getAllOrders({offset,limit});
            if (!isCancelled) {
                setOrders(data);
                setCount(count);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            if (!isCancelled) {
                setIsLoading(false);
            }
        }
    };

    // Fetch orders when the page loads
    fetchOrders();

    // Listen for changes in the orders table
   const channel = subscribeToOrders((payload) => {
        if (!isCancelled && payload.eventType === "UPDATE") {
            fetchOrders();
        }
    });

    return () => {
        isCancelled = true;
        supabase.removeChannel(channel);
    };

}, [user?.id,currentPage]);

  const allStatus = ["all", "confirmed", "pending", "delivered", "cancelled"];

  const filteredOrder = useMemo(() => {
     const query = searchedTerm.trim();
    return orders.filter((order) => {
         const matchesStatus = selectedOrderStatus.toLowerCase() === "all" || selectedOrderStatus === order.status.toLowerCase();
         const matchesQuery = !query || [order.order_number,order.customer_phone,order.delivery_address].some((value) => String(value.toLowerCase() ?? "").includes(query));
         return matchesStatus && matchesQuery
     })
  })
  return (
    <div className="order_container">
      <div className="location_indicator flex items-center gap-1">
        <Link to={"/"} className='flex items-center gap-2' ><CgHomeAlt className="text-xl text-text/30 cursor-pointer" /><ChevronRight /></Link>
        <h2 className="font-semibold">Orders</h2>
      </div>
      <div className="header_text mt-8 flex flex-col gap-2">
        <h1 className="text-xl md:text-3xl font-semibold lg:text-3xl">Orders</h1>
        <p className="text-xs md:text-[15px] text-text/85">View and manage customer orders, track order status, and keep your restaurant running smoothly.</p>
      </div>
      <div className="header_section bg-background border border-border my-6 flex items-center rounded-lg px-3 py-2 gap-4 justify-between overflow-x-auto">
        <h2>Orders</h2>
        <div className="order_status_input flex items-center gap-4">
          <select name="status" id="status_selection" className='border-none outline-none' onChange={(e) => setSelectedOrderStatus(e.target.value)}>
            <option value="all" >All</option>
            <option value="pending" >Pending</option>
            <option value="confirmed" >Confirmed</option>
            <option value="delivered" >Delivered</option>
            <option value="cancelled" >Cancelled</option>
          </select>
        </div>
        <div className="search_input relative flex-1">
          <Search className='w-4 absolute left-2 top-1/2  -translate-y-1/2' />
          <input type="text" placeholder='search orders' className='border pl-8 block outline-none focus:border-2 w-full text-sm border-text/60 placeholder:text-text/70 rounded-md px-2 py-0.5' value={searchedTerm} onChange={(e) => setSearchedTerm(e.target.value.toLowerCase())} />
        </div>
        <div className="orders_status_btns_container flex items-center gap-4">
          {/* ALL ORDERS, PENDING, CONFIRMED, Delivered */}
          {allStatus.map((status, index) => (
            <button className={`capitalize text-sm px-5 py-0.5 rounded-full ${getCurrentStatusColor(status).toLocaleLowerCase()}`} key={index}>{status}</button>
          ))}
        </div>
      </div>
      <div className="order_list_container flex flex-col md:flex-row md:items-start gap-4 flex-wrap *:md:w-[calc(33.3%-10.6px)]">
        {isLoading ? (
          <div className="loading my-8">
            <ProgressLoadingBar loading={isLoading} />
          </div>
        ) : filteredOrder.length > 0 ? (
          filteredOrder.map((order) => (
            <OrderItem key={order.id} order={order}
              expandedOrderId={expandedOrderId}
              setExpandedOrderId={setExpandedOrderId}
            />
          ))
        ) : (
          <h2>No, orders was found.</h2>
        )
        }
      </div>
      <div className="pagination_container flex flex-col gap-3">
        <div className="pagination mt-4 *:cursor-pointer flex gap-2 items-center *:shadow-2xl">
            <button onClick={() => setCurrentPage(prev => prev - 1)} disabled = {currentPage === 1} className='disabled:cursor-not-allowed p-0.5 rounded disabled:opacity-30 bg-primary/20 cursor-pointer'><ChevronLeft/></button>
            <button onClick={() => setCurrentPage(prev => prev + 1)} disabled = {currentPage >= totalPages} className='disabled:cursor-not-allowed p-0.5 disabled:opacity-30 rounded bg-primary/20 cursor-pointer'><ChevronRight/></button>
        </div>
        <h3 className='text-xs text-text/60 md:text-sm'>{`From item ${offset + 1} to : ${Math.min(currentPage * limit, count)}`}</h3>
      </div>
    </div>
  )
}

export default Orders