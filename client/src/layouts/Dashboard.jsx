import React from "react";
import UserMenu from "../components/UserMenu";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Dashboard = () => {
  const user = useSelector((state) => state.user);

  return (
    <section className="bg-white min-h-screen flex flex-col">
      <Header />

      <div className="container mx-auto  flex-1">
        <div className="grid lg:grid-cols-12 gap-4">
          <div className="lg:col-span-3 hidden lg:block sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto border-r pr-4">
            <UserMenu />
          </div>

          <div className="lg:col-span-9 col-span-12 min-h-[80vh]">
            <Outlet />
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default Dashboard;
