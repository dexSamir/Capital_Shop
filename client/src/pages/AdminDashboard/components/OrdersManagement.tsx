import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { fetchAllOrders, updateOrderStatus, type AdminOrder } from "../../../../api/orders";

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("All");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAllOrders();
        setOrders(data);
      } catch {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    void loadOrders();
  }, []);

  const handleChangeOrderStatus = async (id: number, status: string) => {
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o)),
      );
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Order status updated",
        showConfirmButton: false,
        timer: 1500,
        background: "#1a1a2e",
        color: "#fff",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update order status",
        background: "#1a1a2e",
        color: "#fff",
      });
    }
  };

  return (
    <div className="admin-dashboard__orders">
      <div className="admin-dashboard__header">
        <h1>Orders Management</h1>
        <select
          className="admin-dashboard__date-select"
          value={orderStatusFilter}
          onChange={(e) => setOrderStatusFilter(e.target.value)}
        >
          <option value="All">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {loading && (
        <div className="admin-dashboard__loading">
          <div className="admin-dashboard__loading-spinner"></div>
          <p>Loading orders...</p>
        </div>
      )}

      {error && <div className="admin-dashboard__error">{error}</div>}

      {!loading && !error && (
        <div className="admin-dashboard__table-container">
          <table className="admin-dashboard__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders
                .filter((o) =>
                  orderStatusFilter === "All"
                    ? true
                    : o.status === orderStatusFilter,
                )
                .map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`admin-dashboard__status admin-dashboard__status--${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>
                      <select
                        value={order.status}
                        className="admin-dashboard__status-select"
                        onChange={(e) =>
                          handleChangeOrderStatus(order.id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
