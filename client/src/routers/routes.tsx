import Dashboard from "../pages/AdminDashboard";
import Basket from "../pages/Basket";
import Contact from "../pages/Contact";
import Detail from "../pages/Detail";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import Nopage from "../pages/NotFound";
import Products from "../pages/Products";
import Register from "../pages/Register";
import Wishlist from "../pages/Wishlist";
import UserLayout from "../layout/UserLayout/";
import AdminLayout from "../layout/AdminLayout";

export const routes = [
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/detail/:id",
        element: <Detail />,
      },
      {
        path: "/wishlist",
        element: <Wishlist />,
      },
      {
        path: "/basket",
        element: <Basket />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <Nopage />,
  },
];
