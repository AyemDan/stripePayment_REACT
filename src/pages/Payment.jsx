import  { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import CheckoutForm from "../components/CheckoutForm";
import CompletePage from "../components/CompletePage";
import "../Payment.css";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51QiF7cAp8ABybiaM2nMm6tXyLpgJSEdpf6H6sSEFZ9xL1ZFl9MLqv93oEACwWMAz0NR5ubBBX89PEaoBx9gWu14I00NOT1at5H");

export default function Payment() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("http://localhost:4242/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: "xl-tshirt", amount: 1000 }] }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  // Enable the skeleton loader UI for optimal loading.
  const loader = 'auto';

  return (
    <Router>
      <div className="Payment">
        {clientSecret && (
          <Elements options={{clientSecret, appearance, loader}} stripe={stripePromise}>
            <Routes>
              <Route path="/checkout" element={<CheckoutForm />} />
              <Route path="/complete" element={<CompletePage />} />
            </Routes>
          </Elements>
        )}
      </div>
    </Router>
  );
}