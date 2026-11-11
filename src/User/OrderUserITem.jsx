import React, { useEffect, useState } from 'react'
import { formatOrderDate } from '../utils/dateFormater';
import { getStatusColor } from '../utils/statusOrderCustom';
import { ChevronDown, ChevronUp, MapPin, Phone, UtensilsIcon, X } from 'lucide-react';
import { getOrderItems } from '../services/orderServices';
import { toast } from 'react-toastify';

function OrderUserITem({order,expandedOrderId,setExpandedOrderId}) {
    const [orderItems,setOrderItems] = useState([]);

    useEffect(() => {
        let isCancelled = false;
        const fetchOrderItems = async () => {
            try {
                const fetchOrderItems = await getOrderItems(order.id);
                if(!isCancelled){
                    setOrderItems(fetchOrderItems);
                }
            } catch (error) {
                toast.error("Failed to fetch order items")
            }
        }

        fetchOrderItems();
        return () => isCancelled = true
    },[order?.id])

  return (
     <div
              className={`order bg-card px-4 py-2 mb-8 flex flex-col gap-3 rounded-md shadow-2xl border border-text/10`}
              key={order?.id}
            >
              <div className="header flex justify-between items-center">
                <div className="left">
                  <div className="order_number">
                    <h2 className="text-xs md:text-sm lg:text-[17px] font-black">
                      {order?.order_number}
                    </h2>
                  </div>
                  <div className="date">
                    <span className="text-xs text-text/65">
                      {formatOrderDate(order?.created_at)}
                    </span>
                  </div>
                </div>
                <div className="right order_status">
                  <span
                    className={`border-text/35 shadow-2xl border ${getStatusColor(order?.status)} rounded-full text-xs px-4 py-1`}
                  >
                    {order?.status}
                  </span>
                </div>
              </div>
              <div className="body flex gap-4 items-center">
                <div className="left bg-primary p-2 rounded hidden md:block">
                  <UtensilsIcon />
                </div>
                <div className="right flex flex-col gap-3 items-start">
                  <div className="top">
                    <div className="flex items-center flex-wrap gap-4">
                      {orderItems
                        .filter((item) => item.order_id === order.id)
                        .map((item) => (
                          <div
                            key={item?.id}
                            className="bg-card flex  gap-1 border border-text/45 shadow-xl items-center py-0.5 rounded-full px-3 text-xs"
                          >
                            <div className="menu_items flex items-center gap-2">
                              <h2>{item?.menu_items.name}</h2>
                              <X className="w-4" />
                            </div>
                            <span>{`${item?.quantity}`}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                  <span className="bg-surface flex gap-1 border border-text/45 shadow-xl items-center py-0.5 rounded-full px-3 text-xs">
                    {
                      orderItems.filter((item) => item.order_id === order.id)
                        .length
                    }{" "}
                    {orderItems.filter((item) => item.order_id === order.id)
                      .length > 1
                      ? "foods"
                      : "food"}
                  </span>
                </div>
              </div>
              <div className="bottom flex justify-between items-center">
                <div className="left flex flex-col gap-1.5">
                  <h2 className="text-xs text-text/65">Order Total</h2>
                  <span className="font-black">{`$${orderItems
                    .filter((item) => item.order_id === order.id)
                    .reduce((acc, curr) => acc + curr.subtotal, 0)
                    .toFixed(2)}`}</span>
                </div>
                <div className="right">
                  <button
                    type="button"
                    onClick={() => {
                      setExpandedOrderId((prev) =>
                        prev === order.id ? null : order.id,
                      );
                    }}
                    className="text-xs cursor-pointer flex items-center gap-1"
                  >
                    {`${expandedOrderId === order.id ? "Hide Details" : "View Details"}`}
                    {expandedOrderId === order.id ? (
                      <ChevronUp className="w-5" />
                    ) : (
                      <ChevronDown className="w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="border-text/25 border-b"></div>
              <div
                className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
                  expandedOrderId === order.id
                    ? "grid-rows-[1fr]"
                    : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="detail_view flex flex-col gap-4 bg-surface p-4 rounded-xl">
                    {/* Order information */}
                    <div className="order_info flex flex-col gap-2">
                      <h2 className="text-sm font-black">
                        {order.order_number}
                      </h2>

                      <span className="text-xs text-text/65">
                        {formatOrderDate(order.created_at)}
                      </span>

                      <div className="order_total flex flex-col gap-1.5">
                        <h2 className="text-xs text-text/65">Order Total</h2>

                        <span className="font-black">
                          $
                          {orderItems
                            .filter((item) => item.order_id === order.id)
                            .reduce((acc, curr) => acc + curr.subtotal, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="order_smenu">
                      <div className="flex flex-wrap items-center gap-4">
                        {orderItems
                          .filter((item) => item.order_id === order.id)
                          .map((item) => (
                            <div
                              key={item.id}
                              className="bg-card flex gap-2 border border-text/45 items-center py-1 rounded-full px-3 text-xs"
                            >
                              <span>{item.menu_items.name}</span>
                              <span>× {item.quantity}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  )
}

export default OrderUserITem