import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

export function Cart() {
  const cart = useQuery(api.cart.getMyCart);
  const updateCartQuantity = useMutation(api.cart.updateCartQuantity);
  const removeFromCart = useMutation(api.cart.removeFromCart);
  const clearCart = useMutation(api.cart.clearCart);
  const createOrderFromCart = useMutation(api.orders.createOrderFromCart);

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });

  const totalAmount =
    cart?.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0,
    ) || 0;

  const handleUpdateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      await updateCartQuantity({ cartItemId: cartItemId as any, quantity });
      if (quantity === 0) {
        toast.success("Item removed from cart");
      } else {
        toast.success("Cart updated");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update cart");
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      await removeFromCart({ cartItemId: cartItemId as any });
      toast.success("Item removed from cart");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success("Cart cleared");
    } catch (error: any) {
      toast.error(error.message || "Failed to clear cart");
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || cart.length === 0) return;

    setIsCheckingOut(true);
    try {
      await createOrderFromCart({
        customerName: checkoutForm.customerName,
        customerEmail: checkoutForm.customerEmail,
        customerPhone: checkoutForm.customerPhone,
      });

      toast.success("Orders placed successfully!");
      setCheckoutForm({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to place orders");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!cart) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
        <p className="text-gray-600">
          Review your items and proceed to checkout
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-12">
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Your cart is empty
          </h3>
          <p className="text-gray-600">
            Add some products to your cart to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Cart Items ({cart.length})
              </h2>
              <button
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Clear Cart
              </button>
            </div>

            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-sm border p-6"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product?.imageUrl}
                      alt={item.product?.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.product?.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {item.product?.description}
                      </p>
                      <p className="text-lg font-semibold text-green-600">
                        ${item.product?.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item._id, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item._id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        $
                        {((item.product?.price || 0) * item.quantity).toFixed(
                          2,
                        )}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="text-red-600 hover:text-red-700 text-sm mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout */}
          <div className="bg-white rounded-lg shadow-sm border p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={checkoutForm.customerName}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      customerName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={checkoutForm.customerEmail}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      customerEmail: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={checkoutForm.customerPhone}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      customerPhone: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isCheckingOut || cart.length === 0}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCheckingOut ? "Processing..." : "Place Orders"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
