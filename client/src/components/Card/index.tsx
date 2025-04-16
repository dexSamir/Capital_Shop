"use client";

import type React from "react";

import { Link, useNavigate } from "react-router-dom";
import { PiShoppingCartLight } from "react-icons/pi";
import { IoIosHeartEmpty, IoIosHeart, IoIosSearch } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addToCart } from "../../store/slices/cartSlice.ts";
import { toggleWishlistItem } from "../../store/slices/wishlistSlice";
import "./Card.scss";

interface Product {
  id: number;
  name: string;
  price: number;
  withoutDiscount: number;
  img: string;
  category: string;
  count?: number;
}

interface CardProps {
  name: string;
  price: number;
  withoutDiscount: number;
  img: string;
  id: number;
  product: Product;
}

function Card({ name, price, withoutDiscount, img, id, product }: CardProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const isInWishlist = wishlistItems.some((item) => item.id === id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(toggleWishlistItem(product));
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ ...product, count: 1 }));
  };

  return (
    <div className="card">
      <Link className="card__link" onClick={() => navigate(`/detail/${id}`)}>
        <div className="card__tools">
          <div className="card__tool" onClick={handleCartClick}>
            <PiShoppingCartLight />
          </div>
          <div className="card__tool" onClick={handleWishlistClick}>
            {isInWishlist ? <IoIosHeart /> : <IoIosHeartEmpty />}
          </div>
          <div className="card__tool">
            <IoIosSearch />
          </div>
        </div>
        <div className="card__image-container">
          <img
            src={img || "/placeholder.svg"}
            alt={name}
            className="card__image"
          />
        </div>
        <div className="card__content">
          <a href="" className="card__title">
            {name}
          </a>
          <div className="card__price">
            <div className="card__price-current">${price}</div>
            <div className="card__price-original">${withoutDiscount}</div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Card;
