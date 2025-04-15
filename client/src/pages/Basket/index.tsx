"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { MdDelete } from "react-icons/md"
import { GoPlus } from "react-icons/go"
import { FiMinus } from "react-icons/fi"

interface Product {
  id: number
  name: string
  price: number
  img: string
  size?: string
  color?: string
  count?: number
}

function Basket() {
  const navigate = useNavigate()
  const [basketArr, setBasketArr] = useState<Product[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [quantities, setQuantities] = useState<Record<number, number>>({})

  const handleIncrement = (id: number) => {
    setQuantities((prev) => {
      const newQty = (prev[id] || 1) + 1
      updateBasketInLocalStorage(id, newQty)
      return { ...prev, [id]: newQty }
    })
  }

  const handleDecrement = (id: number) => {
    setQuantities((prev) => {
      const newQty = (prev[id] || 1) - 1
      if (newQty <= 0) {
        handleDelete(id)
        return prev
      }

      updateBasketInLocalStorage(id, newQty)
      return { ...prev, [id]: newQty }
    })
  }

  const handleDelete = (id: number) => {
    const updatedBasket = basketArr.filter((item) => item.id !== id)
    setBasketArr(updatedBasket)
    localStorage.setItem("basket", JSON.stringify(updatedBasket))

    setQuantities((prev) => {
      const updatedQuantites = { ...prev }
      delete updatedQuantites[id]
      return updatedQuantites
    })
  }

  const updateBasketInLocalStorage = (id: number, newQty: number) => {
    const updatedBasket = basketArr.map((product) => (product.id === id ? { ...product, count: newQty } : product))
    localStorage.setItem("basket", JSON.stringify(updatedBasket))
    setBasketArr(updatedBasket)
  }

  useEffect(() => {
    const storedBasket = JSON.parse(localStorage.getItem("basket") || "[]")
    setBasketArr(storedBasket)

    const initialQuantities: Record<number, number> = {}
    storedBasket.forEach((product: Product) => {
      initialQuantities[product.id] = product.count || 1
    })
    setQuantities(initialQuantities)
  }, [])

  useEffect(() => {
    const total = basketArr.reduce((acc, product) => {
      const qty = quantities[product.id] || product.count || 1
      return acc + product.price * qty
    }, 0)
    setTotalPrice(total)
  }, [basketArr, quantities])

  return (
    <div className="w-full">
      <div className="flex min-h-[150px] w-full flex-col items-center justify-center bg-[#f3ebd8]">
        <h1 className="mb-3 text-[35px] font-semibold text-[#292621]">Product Detail</h1>
        <div className="flex">
          <Link
            to="/"
            className="border-none px-2 text-sm font-normal capitalize leading-none text-[#74706b] no-underline"
          >
            Home
          </Link>
          <hr className="h-5 w-[1px] rotate-0 border-none border-l border-[#74706b] font-semibold" />
          <Link
            to="/basket"
            className="border-none px-2 text-sm font-normal capitalize leading-none text-[#74706b] no-underline"
          >
            Cart
          </Link>
        </div>
      </div>

      <div className="px-20 py-12">
        <div className="overflow-x-auto bg-white">
          <table className="w-full border-collapse text-left">
            <thead className="font-bold text-left">
              <tr>
                <th className="p-4 text-sm font-medium text-[#797979] font-['Roboto',sans-serif]">Image</th>
                <th className="p-4 text-sm font-medium text-[#797979] font-['Roboto',sans-serif]">Product</th>
                <th className="p-4 text-sm font-medium text-[#797979] font-['Roboto',sans-serif]">Size</th>
                <th className="p-4 text-sm font-medium text-[#797979] font-['Roboto',sans-serif]">Color</th>
                <th className="p-4 text-sm font-medium text-[#797979] font-['Roboto',sans-serif]">Price</th>
                <th className="p-4 text-right text-sm font-medium text-[#797979] font-['Roboto',sans-serif]">
                  Quantity
                </th>
                <th className="p-4 text-right text-sm font-medium text-[#797979] font-['Roboto',sans-serif]">Total</th>
                <th className="p-4 text-sm font-medium text-[#797979] font-['Roboto',sans-serif]">Delete</th>
              </tr>
            </thead>
            <tbody>
              {basketArr &&
                basketArr.map((product) => {
                  return (
                    <tr key={product.id} className="mb-[30px] rounded-md border-b border-[#eeeeee]">
                      <td className="w-16 py-[30px]">
                        <Link onClick={() => navigate("/detail/" + product.id)}>
                          <img src={product.img || "/placeholder.svg"} alt={product.name} className="w-16" />
                        </Link>
                      </td>
                      <td>
                        <div className="rounded-md pl-[30px]">{product.name}</div>
                      </td>
                      <td>{product.size}</td>
                      <td>{product.color}</td>
                      <td>${product.price}</td>
                      <td className="mt-4 flex items-center justify-end">
                        <div className="flex items-stretch gap-0 rounded-md">
                          <input
                            type="text"
                            value={quantities[product.id] || product.count || 1}
                            readOnly
                            className="h-[50px] w-[60px] border border-[#eeeeee] border-r-0 px-[25px] text-center text-base outline-none"
                          />
                          <div className="flex flex-col">
                            <div
                              className="flex h-[25px] cursor-pointer items-center justify-center border border-[#eeeeee] border-b-0 px-[10px] text-lg transition-colors duration-300 hover:bg-[#f0f0f0] active:bg-[#ccc]"
                              onClick={() => handleIncrement(product.id)}
                            >
                              <GoPlus />
                            </div>
                            <div
                              className="flex h-[25px] cursor-pointer items-center justify-center border border-[#eeeeee] px-[10px] text-lg transition-colors duration-300 hover:bg-[#f0f0f0] active:bg-[#ccc]"
                              onClick={() => handleDecrement(product.id)}
                            >
                              <FiMinus />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="w-20 text-center">
                          ${((quantities[product.id] || product.count || 1) * product.price).toFixed(2)}
                        </div>
                      </td>
                      <td>
                        <MdDelete
                          className="ml-6 cursor-pointer text-2xl text-[#292621] transition-all duration-300 hover:text-[#ff2020]"
                          onClick={() => handleDelete(product.id)}
                        />
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>

        <div className="my-[30px] flex items-center justify-end rounded-md border-b border-[#eeeeee] py-[30px] pr-12">
          <span>Subtotal</span>
          <span className="ml-40">${totalPrice.toFixed(2)}</span>
        </div>

        <div className="relative flex gap-4">
          <Link
            className="relative z-[1] cursor-pointer overflow-hidden rounded-[35px] bg-[#ff2020] px-8 py-3 text-base font-medium text-white no-underline before:absolute before:left-[-100%] before:top-0 before:z-0 before:h-full before:w-full before:bg-[#cf0f0f] before:transition-left before:duration-300 before:ease-linear hover:shadow-[0px_3px_31px_2px_rgba(207,207,207,0.7)]"
            to="/products"
          >
            <span className="relative z-[1]">Continue Shopping</span>
          </Link>
          <Link className="relative z-[1] cursor-pointer overflow-hidden rounded-[35px] bg-[#ff2020] px-8 py-3 text-base font-medium text-white no-underline before:absolute before:left-[-100%] before:top-0 before:z-0 before:h-full before:w-full before:bg-[#cf0f0f] before:transition-left before:duration-300 before:ease-linear hover:shadow-[0px_3px_31px_2px_rgba(207,207,207,0.7)]">
            <span className="relative z-[1]">Proceed to checkout</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Basket
