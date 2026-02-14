"use client"

import { useEffect, useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/cartSlice";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [clientId, setClientId] = useState("");

  useEffect(() => {
    // Fetch PayPal Client ID from environment
    fetch('/api/paypal/config')
      .then(res => res.json())
      .then(data => setClientId(data.clientId))
      .catch(err => console.error('Failed to load PayPal config:', err));
  }, []);

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="container py-20 px-4 md:px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Add some products before checking out!</p>
      </div>
    );
  }

  if (!clientId) {
    return (
      <div className="container py-20 px-4 md:px-6 text-center">
        <p>Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="container py-10 px-4 md:px-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>Review your order before payment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment</CardTitle>
          <CardDescription>Pay securely with PayPal</CardDescription>
        </CardHeader>
        <CardContent>
          <PayPalScriptProvider options={{ clientId, currency: "USD" }}>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: total.toFixed(2),
                        breakdown: {
                          item_total: { value: subtotal.toFixed(2), currency_code: "USD" },
                          shipping: { value: shipping.toFixed(2), currency_code: "USD" },
                        }
                      },
                      items: cartItems.map(item => ({
                        name: item.name,
                        unit_amount: { value: item.price.toFixed(2), currency_code: "USD" },
                        quantity: item.quantity.toString(),
                      })),
                    },
                  ],
                });
              }}
              onApprove={async (data, actions) => {
                const details = await actions.order?.capture();
                console.log("Payment successful!", details);

                // Create order in database
                await fetch('/api/orders/create', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    paypalOrderId: data.orderID,
                    items: cartItems,
                    total,
                  }),
                });

                // Clear cart
                dispatch(clearCart());

                // Redirect to success page
                router.push(`/orders/success?orderId=${data.orderID}`);
              }}
              onError={(err) => {
                console.error("PayPal error:", err);
                alert("Payment failed. Please try again.");
              }}
            />
          </PayPalScriptProvider>
        </CardContent>
      </Card>
    </div>
  );
}
