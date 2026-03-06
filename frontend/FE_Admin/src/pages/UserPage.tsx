import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  reward_points: number;
  created_at: string;
}

export default function UsersPage() {
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users/");
      return res.data;
    },
  });

  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Tên",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      render: (role: string) =>
        role === "admin" ? (
          <Tag color="red">Admin</Tag>
        ) : (
          <Tag color="blue">User</Tag>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string) =>
        status === "active" ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="volcano">Blocked</Tag>
        ),
    },
    {
      title: "Điểm thưởng",
      dataIndex: "reward_points",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      render: (date: string) => dayjs(date).format("HH:mm DD/MM/YYYY"),
    },
  ];

  return (
    <div>
      <h2>Danh sách người dùng</h2>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={isLoading}
      />
    </div>
  );
}
