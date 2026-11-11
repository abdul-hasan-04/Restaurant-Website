import {
  ArrowDown,
  ArrowUp,
  Bell,
  ChevronDown,
  ChevronUp,
  MapPin,
  PackageCheck,
  Phone,
  SearchIcon,
  ShoppingBasket,
  User,
  Utensils,
  UtensilsIcon,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaShoppingBag } from "react-icons/fa";
import { MdPending } from "react-icons/md";
import useAuth from "../hooks/useAuth";
import { getOrder, getOrderItems, subscribeToOrders } from "../services/orderServices";
import { toast } from "react-toastify";
import { formatOrderDate } from "../utils/dateFormater";
import { getStatusColor } from "../utils/statusOrderCustom";
import OrderUserITem from "./OrderUserITem";
import supabase from "../lib/supabase";

function UserOrdePage() {
  const [searchedValue, setSearchedValue] = useState("");
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const data = await getOrder(user?.id);
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch order data");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [user?.id]);

  useEffect(() => {
      const channel = subscribeToOrders((payload) => {
        if(payload.eventType === "UPDATE") {
           fetchOrders();
        }
    })

    return () => {
       supabase.removeChannel(channel);
    }
  },[])

  const filteredOrderItems = orders.filter((item) => item.order_number.includes(searchedValue))
  return (
    <div className="user_order_pag flex flex-col gap-8">
      <div className="top">
        <div className="head flex justify-between items-center">
          <div className="title flex gap-4 items-center">
            <div className="order_icon bg-primary px-2 w-10 h-10 flex items-center justify-center rounded-lg">
              <Utensils />
            </div>
            <div className="text">
              <h2>My Orders</h2>
              <p className="text-xs text-text/60">Your food, your history.</p>
            </div>
          </div>
          <Bell className="w-5" />
        </div>
      </div>
      <div className="overview_text flex flex-col gap-1">
        <h2 className="text-xl md:text-2xl">Order history</h2>
        <p className="text-xs text-text/65 md:text-sm">
          Track your meals and revisit your favorite orders.
        </p>
      </div>
      <div className="dashboard_card flex gap-4 flex-col md:flex-row flex-wrap *:md:w-[calc(33.33%-10.66px)]">
        <div className="card bg-surface border border-border/60 rounded p-2 relative shadow">
          <FaShoppingBag className="text-2xl absolute top-2 text-primary right-2" />
          <h1 className="text-2xl md:text-2xl font-semibold">
            {orders?.length}
          </h1>
          <span className="text-xs md:text-sm text-text/65">Total Orders</span>
        </div>
        <div className="card bg-surface border border-border/60 rounded p-2 relative shadow">
          <MdPending className="text-2xl absolute top-2 text-primary right-2" />
          <h1 className="text-2xl md:text-2xl font-semibold">
            {
              orders?.filter(
                (order) => order.status.toLowerCase() === "pending",
              ).length
            }
          </h1>
          <span className="text-xs md:text-sm text-text/65">In progress</span>
        </div>
        <div className="card bg-surface border border-border/60 rounded p-2 relative shadow">
          <PackageCheck className="text-2xl absolute top-2 text-primary right-2" />
          <h1 className="text-2xl md:text-2xl font-semibold">
            {
              orders?.filter(
                (order) => order.status.toLowerCase() === "delivered",
              ).length
            }
          </h1>
          <span className="text-xs md:text-sm text-text/65">Delivered</span>
        </div>
      </div>
      <div className="header_search relative bg-primary/5  shadow mb-4 rounded-full">
        <input
          type="text"
          placeholder="Search by order number.."
          value={searchedValue}
          onChange={(e) => setSearchedValue(e.target.value)}
          className="outline-none focus:border-text/20 focus:border border border-text/30 rounded block w-full pl-10  text-sm placeholder:text-sm py-1.5"
        />
        <SearchIcon className="w-4 absolute top-1/2 -translate-y-1/2 left-3" />
      </div>
      <div className="order_containerList flex gap-5 flex-col mb-8">
        {isLoading ? (
          <h2>Loading....</h2>
        ) : filteredOrderItems.length > 0 ? (
          filteredOrderItems.map((order) => (
            <OrderUserITem
            order={order} key={order.id}
            setExpandedOrderId={setExpandedOrderId}
            expandedOrderId={expandedOrderId}/>
          ))
        ) : (
          <h2>No order was found. keep ordering.</h2>
        )}
      </div>
    </div>
  );
}

export default UserOrdePage;
