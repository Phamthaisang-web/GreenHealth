import React, { useState } from "react";
import {
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Typography,
  DatePicker,
  Select,
  Tag,
  Spin,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const { Title } = Typography;

type PickerMode = "date" | "month" | "year";

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [filterType, setFilterType] = useState<PickerMode>("month");

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await api.get("/dashboard/");
      return res.data.data;
    },
  });

  const stats = data || {};
  const orders = data?.latest_orders || [];

  const revenueData = [
    {
      name: "Doanh thu",
      total: Number(stats.revenue || 0),
    },
  ];

  const getStatus = (status: string) => {
    const map: any = {
      PENDING: { text: "Chờ xử lý", color: "gold" },
      SHIPPING: { text: "Đang giao", color: "blue" },
      COMPLETED: { text: "Hoàn thành", color: "green" },
      CANCELLED: { text: "Đã hủy", color: "red" },
    };

    return map[status] || { text: status, color: "default" };
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "order_code",
    },
    {
      title: "Khách hàng",
      dataIndex: "user_name",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string) => {
        const { text, color } = getStatus(status);
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      render: (value: string) => Number(value).toLocaleString("vi-VN") + " đ",
    },
  ];

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>📊 Tổng quan hệ thống</Title>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card>
            <Statistic title="Người dùng" value={stats.users || 0} />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic title="Sản phẩm" value={stats.products || 0} />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic title="Đơn hàng" value={stats.orders || 0} />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={Number(stats.revenue || 0)}
              formatter={(value) => Number(value).toLocaleString("vi-VN")}
              suffix="đ"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* CHART */}
        <Col span={12}>
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>📈 Doanh thu</span>

                <div style={{ display: "flex", gap: 10 }}>
                  <Select
                    value={filterType}
                    style={{ width: 120 }}
                    onChange={(value) => setFilterType(value)}
                    options={[
                      { value: "date", label: "Ngày" },
                      { value: "month", label: "Tháng" },
                      { value: "year", label: "Năm" },
                    ]}
                  />

                  <DatePicker
                    picker={filterType}
                    value={selectedDate}
                    onChange={(date) => date && setSelectedDate(date)}
                    allowClear={false}
                  />
                </div>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#1890ff"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* ORDERS */}
        <Col span={12}>
          <Card title="📦 Đơn hàng gần đây">
            <Table
              dataSource={orders}
              columns={columns}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
