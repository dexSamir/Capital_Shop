import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import Header from "../Header";

function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Header />
      <main className="flex-1 py-6 px-4 md:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default UserLayout;
