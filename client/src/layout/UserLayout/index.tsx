import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

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
