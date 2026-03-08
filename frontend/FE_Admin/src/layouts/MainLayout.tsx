import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  TagsOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  TagOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import HeaderLayout from "./HeaderLayout";

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Trang chủ",
    },
    {
      key: "/users",
      icon: <UserOutlined />,
      label: "Người dùng",
    },
    {
      key: "/products",
      icon: <AppstoreOutlined />,
      label: "Sản phẩm",
    },
    {
      key: "/categories",
      icon: <TagsOutlined />,
      label: "Danh mục",
    },
    {
      key: "/suppliers",
      icon: <ShopOutlined />,
      label: "Nhà cung cấp",
    },
    {
      key: "/orders",
      icon: <ShoppingCartOutlined />,
      label: "Đơn hàng",
    },
    {
      key: "/vouchers",
      icon: <TagOutlined />,
      label: "Mã giảm giá",
    },

    {
      key: "/chat",
      icon: <MessageOutlined />,
      label: "Chat",
    },
  ];

  return (
    <div>
      <HeaderLayout />

      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          width={240}
          theme="dark"
          style={{
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: "18px",
              padding: "20px",
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            GreenHealth Admin
          </div>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={(e) => navigate(e.key)}
            items={menuItems}
          />
        </Sider>

        <Layout style={{ marginLeft: 240 }}>
          <Header
            style={{
              background: "#fff",
              paddingLeft: 24,
              height: 64,
              display: "flex",
              alignItems: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            Xin chào Admin
          </Header>

          <Content
            style={{
              padding: 24,
              minHeight: "calc(100vh - 64px)",
              background: "#f5f5f5",
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: 24,
                borderRadius: 8,
                minHeight: "100%",
              }}
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
