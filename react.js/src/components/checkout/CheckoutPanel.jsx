// src/components/checkout/CheckoutPanel.jsx
import { useState } from "react";
import Panel, { PanelBody } from "../shared/Panel";
import { FormField, Input, FormRow } from "../shared/FormField";
import styles from "./CheckoutPanel.module.css";
import { formatPrice, formatCardNumber, formatExpiry } from "../../utils/format";

/**
 * Full checkout panel with order summary, shipping & payment.
 * Props: cart, onClose, onSuccess (called after order is placed, clears cart)
 */
export default function CheckoutPanel({ cart, onClose, onSuccess }) {
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "",
    card: "", expiry: "", cvv: "", cardName: "",
  });

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const set   = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function placeOrder() {
    if (cart.length === 0) return;
    onSuccess();       // clears cart in parent
    setDone(true);
  }

  // ── Success screen ─────────────────────────────────────
  if (done) {
    return (
      <Panel title="Order Confirmed" onClose={onClose}>
        <div className={styles.success}>
          <div className={styles.successIcon}>🎉</div>
          <h2>Order Placed!</h2>
          <p>
            Thank you for shopping with ShopIt.<br />
            Your order is confirmed and will be delivered soon.
          </p>
          <button className={styles.backBtn} onClick={onClose}>
            Back to Store
          </button>
        </div>
      </Panel>
    );
  }

  // ── Checkout form ──────────────────────────────────────
  return (
    <Panel title="Checkout" onClose={onClose}>
      <PanelBody>

        {/* Order Summary */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Order Summary</h3>
          {cart.map((item) => (
            <div className={styles.orderLine} key={item.id}>
              <span>{item.name} × {item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className={styles.grandTotal}>
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </section>

        {/* Shipping */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Shipping Information</h3>
          <div className={styles.fields}>
            <FormRow>
              <FormField label="First Name">
                <Input placeholder="John" value={form.firstName} onChange={set("firstName")} />
              </FormField>
              <FormField label="Last Name">
                <Input placeholder="Doe" value={form.lastName} onChange={set("lastName")} />
              </FormField>
            </FormRow>
            <FormField label="Email">
              <Input type="email" placeholder="john@example.com" value={form.email} onChange={set("email")} />
            </FormField>
            <FormField label="Phone">
              <Input type="tel" placeholder="+234 800 000 0000" value={form.phone} onChange={set("phone")} />
            </FormField>
            <FormField label="Address">
              <Input placeholder="123 Main Street" value={form.address} onChange={set("address")} />
            </FormField>
            <FormRow>
              <FormField label="City">
                <Input placeholder="Lagos" value={form.city} onChange={set("city")} />
              </FormField>
              <FormField label="State">
                <Input placeholder="Lagos State" value={form.state} onChange={set("state")} />
              </FormField>
            </FormRow>
          </div>
        </section>

        {/* Payment */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Payment Details</h3>
          <div className={styles.fields}>
            <FormField label="Card Number">
              <Input
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                value={form.card}
                onChange={(e) =>
                  setForm((f) => ({ ...f, card: formatCardNumber(e.target.value) }))
                }
              />
            </FormField>
            <FormRow>
              <FormField label="Expiry Date">
                <Input
                  placeholder="MM / YY"
                  maxLength={7}
                  value={form.expiry}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expiry: formatExpiry(e.target.value) }))
                  }
                />
              </FormField>
              <FormField label="CVV">
                <Input
                  placeholder="123"
                  maxLength={3}
                  value={form.cvv}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, cvv: e.target.value.replace(/\D/g, "") }))
                  }
                />
              </FormField>
            </FormRow>
            <FormField label="Name on Card">
              <Input placeholder="John Doe" value={form.cardName} onChange={set("cardName")} />
            </FormField>
          </div>
        </section>

      </PanelBody>

      <div className={styles.placeOrderBar}>
        <button className={styles.placeBtn} onClick={placeOrder}>
          Place Order — {formatPrice(total)}
        </button>
      </div>
    </Panel>
  );
}