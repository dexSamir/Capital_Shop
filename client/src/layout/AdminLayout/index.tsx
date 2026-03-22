import { Outlet } from "react-router-dom"
import "./AdminLayout.scss"

function AdminLayout() {
  return (
    <div className="admin-layout">
      <main className="admin-layout__main">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
