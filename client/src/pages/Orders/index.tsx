"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../../api/client";
import { useAppSelector } from "../../store/hooks";
import "./Orders.scss";

interface Order {
  id: number;
  orderDate: string;
  status: string;
  totalAmount: number;
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
      } catch (err) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      void fetchOrders();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="orders">
        <div className="orders__header">
          <h1 className="orders__title">My Orders</h1>
        </div>
        <div className="orders__not-auth">
          <p>You need to be logged in to view your orders.</p>
          <Link to="/login" className="orders__link">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders">
      <div className="orders__header">
        <h1 className="orders__title">My Orders</h1>
      </div>

      {loading && <div className="orders__status">Loading orders...</div>}
      {error && <div className="orders__status orders__status--error">{error}</div>}

      {!loading && !error && orders.length === 0 && (
        <div className="orders__empty">
          <p>You have no orders yet.</p>
          <Link to="/products" className="orders__link">
            Start Shopping
          </Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="orders__list">
          {orders.map((order) => (
            <div key={order.id} className="orders__item">
              <div className="orders__item-row">
                <span className="orders__label">Order ID:</span>
                <span className="orders__value">#{order.id}</span>
              </div>
              <div className="orders__item-row">
                <span className="orders__label">Date:</span>
                <span className="orders__value">
                  {new Date(order.orderDate).toLocaleDateString()}
                </span>
              </div>
              <div className="orders__item-row">
                <span className="orders__label">Status:</span>
                <span className={`orders__status-badge orders__status-badge--${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              <div className="orders__item-row">
                <span className="orders__label">Total:</span>
                <span className="orders__value">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;

