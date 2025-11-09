"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function SettingsPage() {
  const store = useQuery(api.stores.getMyStore);
  const user = useQuery(api.auth.loggedInUser);

  if (!store) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Settings</h1>
        <p className="text-gray-600">Create a store first to access settings</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Settings</h1>
        <p className="text-gray-600">
          Manage your account and store preferences
        </p>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Account Information
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                User ID
              </h3>
              <p className="text-lg text-gray-900 font-mono ">{user?._id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Name</h3>
              <p className="text-lg text-gray-900">
                {user?.name || "Not provided"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
              <p className="text-lg text-gray-900">
                {user?.email || "Not provided"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Account Type
              </h3>
              <p className="text-lg text-gray-900">Store Owner</p>
            </div>
          </div>
        </div>
      </div>

      {/* Store Information */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Store Information
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Store ID
              </h3>
              <p className="text-lg text-gray-900 font-mono">{store._id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Store Name
              </h3>
              <p className="text-lg text-gray-900">{store.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Created
              </h3>
              <p className="text-lg text-gray-900">
                {new Date(store._creationTime).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* App Information */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            App Information
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Version
              </h3>
              <p className="text-lg text-gray-900">1.0.0</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Platform
              </h3>
              <p className="text-lg text-gray-900">Convex + React</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Features
              </h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Real-time Updates
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Cart Management
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Order Tracking
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Activity Logs
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Store Limit
              </h3>
              <p className="text-lg text-gray-900">1 store per owner</p>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200">
        <div className="p-6 border-b border-red-200">
          <h2 className="text-xl font-semibold text-red-900">Danger Zone</h2>
        </div>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-red-800 mb-2">
              Store Deletion
            </h3>
            <p className="text-sm text-red-700 mb-4">
              Once you delete your store, there is no going back. This will
              permanently delete your store, all products, orders, and activity
              history.
            </p>
            <button
              disabled
              className="px-4 py-2 bg-red-600 text-white rounded-lg opacity-50 cursor-not-allowed"
            >
              Delete Store (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
