"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "@/components/custom/signin-form";
import { useState } from "react";

export default function MyOrdersPage() {
  const orders = useQuery(api.orders.getMyOrders);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");

  const filteredOrders = orders?.filter(order => 
    filterStatus === "all" || order.status === filterStatus
  ) || [];

  return (
    <div className="max-w-7xl mx-auto">
      <Authenticated>
        {orders === undefined ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
              <p className="text-gray-600">View your order history and track order status</p>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus("pending")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === "pending"
                      ? "bg-yellow-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilterStatus("confirmed")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === "confirmed"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Confirmed
                </button>
                <button
                  onClick={() => setFilterStatus("cancelled")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === "cancelled"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Cancelled
                </button>
              </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-semibold text-gray-900">Order History ({filteredOrders.length})</h2>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600">
                    {filterStatus === "all" 
                      ? "You haven't placed any orders yet" 
                      : `No ${filterStatus} orders found`}
                  </p>
                </div>
              ) : (
                <div className="divide-y max-h-[600px] overflow-y-auto">
                  {filteredOrders.map((order) => (
                    <div key={order._id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <img
                              src={order.product?.imageUrl}
                              alt={order.product?.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <h3 className="font-semibold text-gray-900">{order.product?.name}</h3>
                              <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                              <p className="text-lg font-semibold text-green-600">${order.totalAmount.toFixed(2)}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">Order Date:</span> {new Date(order.orderDate).toLocaleString()}</p>
                            <p><span className="font-medium">Order ID:</span> <span className="font-mono text-xs">{order._id}</span></p>
                          </div>
                        </div>

                        <div className="ml-4 flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                            order.status === "confirmed" ? "bg-green-100 text-green-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Authenticated>
      <Unauthenticated>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">My Orders</h1>
            <p className="text-xl text-secondary">Please sign in to view your orders</p>
          </div>
          <SignInForm />
        </div>
      </Unauthenticated>
    </div>
  );
}


