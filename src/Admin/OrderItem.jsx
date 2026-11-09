import React, { useEffect, useState } from 'react'
import { getStatusColor } from '../utils/statusOrderCustom'
import { formatOrderDate } from '../utils/dateFormater'
import { getAllOrderItems, getOrderItems, updateOrderStatus } from '../services/orderServices';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { Eye, ViewIcon } from 'lucide-react';
import supabase from '../lib/supabase';

function OrderItem({ order, expandedOrderId, setExpandedOrderId }) {
    const { user } = useAuth();
    const [orderItems, setOrderItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState(() => {
        return order.status
    })
    useEffect(() => {
        let isCancelled = false;
        const fetchOrders = async () => {
            try {
                const fetchedOrderItems = await getOrderItems(order?.id);
                if (!isCancelled) {
                    setOrderItems(fetchedOrderItems)
                }
            } catch (error) {
                if (!isCancelled) {
                    console.error("Faile to fetch order items", error);
                }
            } finally {
                setIsLoading(false);
            }
        }
        fetchOrders();
        return () => isCancelled = true
    }, [order?.id]);
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const fetchedOrderItems = await getAllOrderItems();
                setOrderItems(fetchedOrderItems)
            } catch (error) {
                console.error("Faile to fetch order items", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchOrders();

    }, [])

    const handleStatusChange = async value => {
        try {

            await updateOrderStatus(order.id, value);
            toast.success("Status Changed Successfully.", {position : "bottom-right"})
            setStatus(value)
        } catch (error) {

        }
    }


    return (
        <div className="order bg-linear-to-bl flex flex-col gap-4 from-surface to-background p-4 rounded-lg border border-text/20">
            <div className="top flex justify-between">
                <div className="order_number">
                    <h2 className='font-black'>{order.order_number}</h2>
                </div>
                <div className="status">
                    <span className={`${getStatusColor(order.status)} px-2 py-0.5 rounded-full flex items-center justify-center text-xs`}>{order.status}</span>
                </div>
            </div>
            <div className="body">
                <div className="customer_and_order_items">
                    <h2 className='font-black'>{`Customer: ${order?.user_info?.full_name}`}</h2>
                    <div className="wrapper flex justify-between items-center">
                        <div className="left">
                            <h3 className='text-xs'>{orderItems.filter((item) => item.order_id === order.id).length} {orderItems.filter((item) => item.order_id === order.id).length > 1 ? "Foods" : "Food"} 🥘</h3>
                            <span className='text-xs text-text/75'>{formatOrderDate(order.created_at)}</span>
                        </div>
                        <div className="right">
                            <h3 className='font-black'>{`$${(order.total_amount).toFixed(2)}`}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bottom flex justify-between items-center gap-3">
                <div className="status_action bg-surface/20 border text-sm border-text/60 flex-1 p-2 rounded-full">
                    <select name="status" className='block w-full outline-none' id="status_selector" value={status} onChange={(e) => handleStatusChange(e.target.value)}>
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="preparing">preparing</option>
                        <option value="ready">ready</option>
                        <option value="out_for_delivery">out_for_delivery</option>
                        <option value="delivered">delivered</option>
                        <option value="cancelled">cancelled</option>
                    </select>
                </div>
                <div className="toggle_detail_view">
                    <button type='button' className='flex text-xs cursor-pointer md:text-sm items-center gap-1' onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}>
                        <Eye className='w-4' />
                        {expandedOrderId === order.id ? "Hide" : "View"}
                    </button>
                </div>
            </div>
            <div className={`detail_Section min-h-0 overflow-hidden transition-[grid-template-rows] ease-in-out duration-100 grid ${expandedOrderId === order.id ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className={`order_details capitalize min-h-0 flex flex-col gap-1 overflow-hidden text-xs md:text-[13px] rounded-md bg-card  ${expandedOrderId === order.id ? "p-2" : ""}`}>
                    <h2>Order details</h2>
                    <div className="order_info text-text/70 flex flex-col gap-1">
                        <h3>Customer: <strong>{order?.user_info?.full_name}</strong></h3>
                        <h3>Items: <strong>{orderItems.length} {orderItems.length > 1 ? "Items" : "Item"}</strong></h3>
                        <span>Current status: <strong>{order.status}</strong></span>
                        <h3>Destination : <strong>{order.delivery_address}</strong></h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderItem