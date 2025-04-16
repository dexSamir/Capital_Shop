"use client"

import { Link, useNavigate } from "react-router-dom"
import { MdDelete } from "react-icons/md"
import { FaRegEdit } from "react-icons/fa"
import "./AdminTable.scss"

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
    <div className="admin-table">
      <div className="admin-table__container">
        <table className="admin-table__table">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Regular Price</th>
              <th>Discount</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {datas.map((product) => (
              <tr key={product.id} className="admin-table__row">
                <td>{product.id}</td>
                <td>
                  <Link onClick={() => navigate(`/detail/${product.id}`)}>
                    <img src={product.img || "/placeholder.svg"} alt={product.name} className="admin-table__image" />
                  </Link>
                </td>
                <td>
                  <Link onClick={() => navigate(`/detail/${product.id}`)} className="admin-table__link">
                    {product.name}
                  </Link>
                </td>
                <td>{product.category}</td>
                <td>${product.price}</td>
                <td>${product.withoutDiscount}</td>
                <td>-{(((product.withoutDiscount - product.price) / product.withoutDiscount) * 100).toFixed(0)}%</td>
                <td>
                  <FaRegEdit className="admin-table__edit-icon" />
                </td>
                <td>
                  <MdDelete className="admin-table__delete-icon" onClick={() => onDelete(product.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminTable
