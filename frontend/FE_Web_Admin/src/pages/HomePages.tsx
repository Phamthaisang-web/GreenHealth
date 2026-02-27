import React from "react";
import { LayoutDashboard, Package, Tag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function SideBar() {
  const { pathname } = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Product",
      href: "/product",
      icon: Package,
    },
    {
      label: "Category",
      href: "/category",
      icon: Tag,
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white shadow-lg">
      {/* Header */}
      <div className="border-b border-slate-700 p-6">
        <h1 className="text-2xl font-bold text-white">Admin</h1>
      </div>

      {/* Menu Items */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
