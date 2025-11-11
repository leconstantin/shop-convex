"use client";
import { api } from "@/convex/_generated/api";
import { getProducts } from "@/shopify";
import { Product } from "@/shopify/types";
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

function mapShopifyToDb(products: Product[]) {
  return products.map((p) => ({
    shopifyId: p.id,
    handle: p.handle,
    name: p.title,
    price: parseFloat(p.priceRange.minVariantPrice.amount),
    imageUrls: p.images.map((img) => img.url),
    inStock: p.availableForSale,
    collection: p.tags?.[0] ?? "",
    stockQuantity: undefined, // if you don’t track it from Shopify, leave undefined
  }));
}

export function StoreDashboard({ products }: { products: Product[] }) {
  const store = useQuery(api.stores.getMyStore);
  const createStore = useMutation(api.stores.createStore);

  const createDummyProducts = useMutation(api.products.upsertMany);
  const updateOrderStatus = useMutation(api.orders.updateOrderStatus);

  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [isCreatingStore, setIsCreatingStore] = useState(false);

  const stats = useQuery(
    api.stores.getStoreDashboardStats,
    store ? { storeId: store._id } : "skip",
  );

  const orders = useQuery(
    api.orders.getStoreOrders,
    store ? { storeId: store._id } : "skip",
  );

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !storeDescription.trim()) return;

    setIsCreatingStore(true);
    try {
      const storeId = await createStore({
        name: storeName,
        description: storeDescription,
      });

      // Create dummy products for the new store
      await createDummyProducts({
        storeId,
        products: mapShopifyToDb(products),
      });

      toast.success("Store created successfully with sample products!");
      setStoreName("");
      setStoreDescription("");
    } catch (error: any) {
      toast.error(error.message || "Failed to create store");
    } finally {
      setIsCreatingStore(false);
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    status: "confirmed" | "cancelled",
  ) => {
    try {
      await updateOrderStatus({ orderId: orderId as any, status });
      toast.success(`Order ${status} successfully!`);
    } catch (error) {
      toast.error(`Failed to ${status} order`);
    }
  };

  if (!store) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Create Your Store
          </h1>
          <p className="text-gray-600 mb-6">
            You can only own one store. Create it now to start selling!
          </p>
          <form onSubmit={handleCreateStore} className="space-y-6">
            <div>
              <label
                htmlFor="storeName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Store Name
              </label>
              <input
                id="storeName"
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your store name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="storeDescription"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Store Description
              </label>
              <textarea
                id="storeDescription"
                value={storeDescription}
                onChange={(e) => setStoreDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your store"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isCreatingStore}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreatingStore ? "Creating Store..." : "Create Store"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{store.name}</h1>
        <p className="text-gray-600">{store.description}</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalCustomers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Products</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalProducts}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-900">
            Recent Orders
          </h2>
          <p className="text-gray-600 mt-1">Manage your incoming orders</p>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-600">
              Orders will appear here when customers place them
            </p>
          </div>
        ) : (
          <div className="divide-y max-h-96 overflow-y-auto">
            {orders.slice(0, 5).map((order) => (
              <div key={order._id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <img
                        src={order.product?.imageUrls[0]}
                        alt={order.product?.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {order.product?.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Quantity: {order.quantity}
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {order.status === "pending" && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() =>
                          handleUpdateOrderStatus(order._id, "confirmed")
                        }
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateOrderStatus(order._id, "cancelled")
                        }
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
