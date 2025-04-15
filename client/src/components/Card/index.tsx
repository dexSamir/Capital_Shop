"use client";

import type React from "react";

import { PiShoppingCartLight } from "react-icons/pi";
import { IoIosHeartEmpty, IoIosHeart, IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Card.scss";

interface Product {
  id: number;
  name: string;
  price: number;
  withoutDiscount: number;
  img: string;
  count?: number;
}

interface CardProps {
  name: string;
  price: number;
  withoutDiscount: number;
  img: string;
  id: number;
  products: Product[];
}

function Card({ name, price, withoutDiscount, img, id, products }: CardProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const wishlistArr = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const inWishlist = wishlistArr.some((elem: Product) => elem.id == id);

    const cartArr = JSON.parse(localStorage.getItem("basket") || "[]");
    const inCart = cartArr.some((elem: Product) => elem.id == id);

    setIsInWishlist(inWishlist);
    setIsInCart(inCart);
  }, [id]);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    let wishlistArr = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const product = products.find((elem) => elem.id == id);

    if (isInWishlist) {
      wishlistArr = wishlistArr.filter((item: Product) => item.id !== id);
    } else if (product) {
      wishlistArr.push(product);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlistArr));
    setIsInWishlist(!isInWishlist);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const cartArr = JSON.parse(localStorage.getItem("basket") || "[]");
    const product = products.find((elem) => elem.id == id);

    if (!product) return;

    const existingProduct = cartArr.find((elem: Product) => elem.id == id);
    if (existingProduct) {
      existingProduct.count = (existingProduct.count || 1) + 1;
    } else {
      cartArr.push({ ...product, count: 1 });
    }

    localStorage.setItem("basket", JSON.stringify(cartArr));
    setIsInCart(true);
  };

  return (
    <div className="card">
      <Link className="card__link" onClick={() => navigate("/detail/" + id)}>
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
