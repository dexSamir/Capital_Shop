"use client";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../store/slices/cartSlice.ts";
import "./Basket.scss";

function Basket() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, totalAmount } = useAppSelector((state) => state.cart);

  const handleIncrement = (id: number) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      dispatch(updateCartItemQuantity({ id, quantity: item.count + 1 }));
    }
  };

  const handleDecrement = (id: number) => {
    const item = items.find((item) => item.id === id);
    if (item && item.count > 1) {
      dispatch(updateCartItemQuantity({ id, quantity: item.count - 1 }));
    } else if (item && item.count <= 1) {
      dispatch(removeFromCart(id));
    }
  };

  const handleDelete = (id: number) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="basket">
      <div className="basket__header">
        <h1 className="basket__title">Shopping Cart</h1>
        <div className="basket__breadcrumb">
          <Link to="/" className="basket__breadcrumb-link">
            Home
          </Link>
          <span className="basket__breadcrumb-separator"></span>
          <Link to="/basket" className="basket__breadcrumb-link">
            Cart
          </Link>
        </div>
      </div>

      <div className="basket__content">
        {items.length > 0 ? (
          <div className="basket__table-container">
            <table className="basket__table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Size</th>
                  <th>Color</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {items.map((product) => (
                  <tr key={product.id} className="basket__item">
                    <td className="basket__item-image">
                      <Link onClick={() => navigate(`/detail/${product.id}`)}>
                        <img
                          src={product.img || "/placeholder.svg"}
                          alt={product.name}
                        />
                      </Link>
                    </td>
                    <td className="basket__item-name">{product.name}</td>
                    <td className="basket__item-size">
                      {product.size || "N/A"}
                    </td>
                    <td className="basket__item-color">
                      {product.color || "N/A"}
                    </td>
                    <td className="basket__item-price">${product.price}</td>
                    <td className="basket__item-quantity">
                      <div className="basket__quantity-control">
                        <input
                          type="text"
                          value={product.count}
                          readOnly
                          className="basket__quantity-input"
                        />
                        <div className="basket__quantity-buttons">
                          <div
                            className="basket__quantity-increase"
                            onClick={() => handleIncrement(product.id)}
                          >
                            <GoPlus />
                          </div>
                          <div
                            className="basket__quantity-decrease"
                            onClick={() => handleDecrement(product.id)}
                          >
                            <FiMinus />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="basket__item-total">
                      ${(product.count * product.price).toFixed(2)}
                    </td>
                    <td className="basket__item-delete">
                      <MdDelete
                        className="basket__delete-icon"
                        onClick={() => handleDelete(product.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="basket__empty">
            <p>Your cart is empty.</p>
            <Link to="/products" className="basket__continue-shopping">
              Continue Shopping
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <>
            <div className="basket__summary">
              <div className="basket__subtotal">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="basket__actions">
              <Link className="basket__action-button" to="/products">
                Continue Shopping
              </Link>
              <Link className="basket__action-button" to="/checkout">
                Proceed to checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Basket;
