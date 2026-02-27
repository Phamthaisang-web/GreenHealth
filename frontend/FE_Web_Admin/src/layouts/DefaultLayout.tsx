import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";

export default function DefaultLayout() {
  return (
    <div className="flex">
      <SideBar />

      {/* Main content */}
      <div className="ml-64 w-full min-h-screen bg-slate-100 p-6">
        <Outlet />
      </div>
    </div>
  );
}
