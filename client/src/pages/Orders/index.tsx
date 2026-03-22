import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { FaTruck, FaBoxOpen, FaSpinner, FaHome, FaArrowRight } from "react-icons/fa";
import { apiClient } from "../../api/client";
import { useAppSelector } from "../../store/hooks";
import "./Orders.scss";

interface Order {
  id: number;
  orderDate: string;
  status: string;
  totalAmount: number;
}

function statusModifier(status: string): string {
  const key = status.toLowerCase().replace(/\s+/g, "-");
  const known = new Set([
    "pending",
    "completed",
    "cancelled",
    "processing",
    "shipped",
  ]);
  return known.has(key) ? key : "default";
}

function Orders() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<Order[]>("/Orders/my");
        setOrders(response.data);
      } catch {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      void fetchOrders();
    }
  }, [isAuthenticated]);

  const panel = (children: ReactNode) => (
    <div className="orders">
      <header className="orders__hero">
        <nav className="orders__breadcrumb" aria-label="Breadcrumb">
          <Link className="orders__breadcrumb-link" to="/">
            Home
          </Link>
          <span className="orders__breadcrumb-sep" aria-hidden />
          <span className="orders__breadcrumb-current">Track order</span>
        </nav>
        <div className="orders__hero-icon" aria-hidden>
          <FaTruck />
        </div>
        <h1 className="orders__title">Track your order</h1>
        <p className="orders__subtitle">
          Sign in to see your purchases and delivery status in one place.
        </p>
      </header>
      <div className="orders__main">
        <div className="orders__panel">{children}</div>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return panel(
      <>
        <div className="orders__panel-icon" aria-hidden>
          <FaBoxOpen />
        </div>
        <h2 className="orders__panel-title">Sign in required</h2>
        <p className="orders__panel-text">
          You need to be logged in to view your order history and tracking details.
        </p>
        <Link to="/login" className="orders__btn orders__btn--primary">
          Go to login
          <FaArrowRight />
        </Link>
        <Link to="/products" className="orders__panel-link">
          Continue shopping
        </Link>
      </>
    );
  }

  return (
    <div className="orders">
      <header className="orders__hero">
        <nav className="orders__breadcrumb" aria-label="Breadcrumb">
          <Link className="orders__breadcrumb-link" to="/">
            Home
          </Link>
          <span className="orders__breadcrumb-sep" aria-hidden />
          <span className="orders__breadcrumb-current">Track order</span>
        </nav>
        <div className="orders__hero-icon" aria-hidden>
          <FaTruck />
        </div>
        <h1 className="orders__title">Track your order</h1>
        <p className="orders__subtitle">
          Order number, date, amount, and current status for each purchase.
        </p>
      </header>

      <div className="orders__main">
        {loading && (
          <div className="orders__loading" role="status" aria-live="polite">
            <FaSpinner className="orders__spinner" aria-hidden />
            <span>Loading your orders…</span>
          </div>
        )}

        {error && (
          <div className="orders__message orders__message--error" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="orders__panel orders__panel--empty">
            <div className="orders__panel-icon" aria-hidden>
              <FaBoxOpen />
            </div>
            <h2 className="orders__panel-title">No orders yet</h2>
            <p className="orders__panel-text">
              When you place an order, it will show up here with status updates.
            </p>
            <Link to="/products" className="orders__btn orders__btn--primary">
              Start shopping
              <FaArrowRight />
            </Link>
            <Link to="/" className="orders__panel-link orders__panel-link--inline">
              <FaHome />
              Back to home
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <ul className="orders__list">
            {orders.map((order) => (
              <li key={order.id} className="orders__card">
                <div className="orders__card-top">
                  <div className="orders__card-id">
                    <span className="orders__card-id-label">Order</span>
                    <span className="orders__card-id-value">#{order.id}</span>
                  </div>
                  <span
                    className={`orders__status-badge orders__status-badge--${statusModifier(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
                <dl className="orders__meta">
                  <div className="orders__meta-row">
                    <dt>Placed on</dt>
                    <dd>{new Date(order.orderDate).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}</dd>
                  </div>
                  <div className="orders__meta-row">
                    <dt>Total</dt>
                    <dd className="orders__meta-total">
                      ${order.totalAmount.toFixed(2)}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Orders;
