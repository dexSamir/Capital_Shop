"use client"

import { Link, useNavigate } from "react-router-dom"
import { MdDelete } from "react-icons/md"
import { FaRegEdit } from "react-icons/fa"

interface Product {
  id: number
  name: string
  price: number
  withoutDiscount: number
  img: string
  category: string
}

interface AdminTableProps {
  datas: Product[]
  onDelete: (id: number) => void
}

function AdminTable({ datas, onDelete }: AdminTableProps) {
  const navigate = useNavigate()

  return (
    <div className="mx-auto my-12 max-w-full px-12 overflow-x-auto">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="w-full border-b border-gray-200">
              <th className="p-3 text-left font-medium text-gray-700">#</th>
              <th className="p-3 text-left font-medium text-gray-700">Image</th>
              <th className="p-3 text-left font-medium text-gray-700">Name</th>
              <th className="p-3 text-left font-medium text-gray-700">Category</th>
              <th className="p-3 text-left font-medium text-gray-700">Price</th>
              <th className="p-3 text-left font-medium text-gray-700">Regular Price</th>
              <th className="p-3 text-left font-medium text-gray-700">Discount</th>
              <th className="p-3 text-left font-medium text-gray-700">Edit</th>
              <th className="p-3 text-left font-medium text-gray-700">Delete</th>
            </tr>
          </thead>
          <tbody>
            {datas &&
              datas.map((product) => {
                return (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3">{product.id}</td>
                    <td className="p-3">
                      <Link onClick={() => navigate("/detail/" + product.id)}>
                        <img
                          src={product.img || "/placeholder.svg"}
                          alt={product.name}
                          className="h-16 w-16 object-cover"
                        />
                      </Link>
                    </td>
                    <td className="p-3">
                      <Link
                        onClick={() => navigate("/detail/" + product.id)}
                        className="transition-all duration-200 hover:text-[#ff1f1f]"
                      >
                        {product.name}
                      </Link>
                    </td>
                    <td className="p-3">{product.category}</td>
                    <td className="p-3">${product.price}</td>
                    <td className="p-3">${product.withoutDiscount}</td>
                    <td className="p-3">
                      -{(((product.withoutDiscount - product.price) / product.withoutDiscount) * 100).toFixed(0)}%
                    </td>
                    <td className="p-3">
                      <FaRegEdit className="mx-auto cursor-pointer text-2xl transition-all duration-200 hover:text-[#8cc9f8]" />
                    </td>
                    <td className="p-3">
                      <MdDelete
                        className="mx-auto cursor-pointer text-2xl transition-all duration-200 hover:text-[#ff1f1f]"
                        onClick={() => onDelete(product.id)}
                      />
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminTable
