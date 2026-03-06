import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { Table, Tag, Modal, Button, Select, message, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
interface Order {
  id: number;
  order_code: string;
  user_name: string;
  user_phone: string;

  address_line: string;
  ward: string;
  district: string;
  city: string;

  total_amount: string;
  total_amount_before: string;
  discount_amount: string;

  voucher_code?: string;
  status: string;
  created_at: string;
}
interface OrderItem {
  id: number;
  product_id: number;
  name: string;
  quantity: number;
  price: string;
  subtotal: string;
}

export default function OrdersPage() {
  const queryClient = useQueryClient();

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filters, setFilters] = useState({
    status: "",
    order_code: "",
  });
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["orders", filters],
    queryFn: async () => {
      const res = await api.get("/orders/", {
        params: filters,
      });
      return res.data;
    },
  });

  const getOrderDetail = async (id: number) => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  };

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: any) =>
      api.put(`/orders/status/${id}`, { status }),

    onSuccess: () => {
      message.success("Cập nhật trạng thái thành công");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },

    onError: () => {
      message.error("Cập nhật trạng thái thất bại");
    },
  });

  const renderStatus = (status: string) => {
    const colors: any = {
      PENDING: "orange",
      SHIPPING: "blue",
      COMPLETED: "green",
      CANCELLED: "red",
    };

    return <Tag color={colors[status]}>{status}</Tag>;
  };

  const columns: ColumnsType<Order> = [
    {
      title: "Mã đơn",
      dataIndex: "order_code",
    },
    {
      title: "Khách hàng",
      dataIndex: "user_name",
    },
    {
      title: "SĐT",
      dataIndex: "user_phone",
    },
    {
      title: "Địa chỉ",
      render: (_, record) =>
        `${record.address_line}, ${record.ward}, ${record.district}, ${record.city}`,
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      render: (value: string) => Number(value).toLocaleString() + " đ",
    },
    {
      title: "Voucher",
      dataIndex: "voucher_code",
      render: (v) => v || "Không",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: renderStatus,
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      render: (date: string) => dayjs(date).format("HH:mm DD/MM/YYYY"),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={async () => {
              const data = await getOrderDetail(record.id);

              setSelectedOrder(data);
              setOpenDetail(true);
            }}
          >
            Chi tiết
          </Button>

          <Select
            style={{ width: 130 }}
            defaultValue={record.status}
            onChange={(value) =>
              updateStatus.mutate({
                id: record.id,
                status: value,
              })
            }
            options={[
              { value: "PENDING", label: "PENDING" },
              { value: "SHIPPING", label: "SHIPPING" },
              { value: "COMPLETED", label: "COMPLETED" },
              { value: "CANCELLED", label: "CANCELLED" },
            ]}
          />
        </>
      ),
    },
  ];

  const itemColumns: ColumnsType<OrderItem> = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Giá",
      dataIndex: "price",
      render: (v: string) => Number(v).toLocaleString() + " đ",
    },
    {
      title: "Thành tiền",
      dataIndex: "subtotal",
      render: (v: string) => Number(v).toLocaleString() + " đ",
    },
  ];

  return (
    <div>
      <h2>Danh sách đơn hàng</h2>
      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        <Input
          placeholder="Tìm mã đơn"
          style={{ width: 200 }}
          value={filters.order_code}
          onChange={(e) =>
            setFilters({
              ...filters,
              order_code: e.target.value,
            })
          }
        />

        <Select
          placeholder="Trạng thái"
          style={{ width: 160 }}
          allowClear
          value={filters.status || undefined}
          onChange={(value) =>
            setFilters({
              ...filters,
              status: value || "",
            })
          }
          options={[
            { value: "PENDING", label: "PENDING" },
            { value: "SHIPPING", label: "SHIPPING" },
            { value: "COMPLETED", label: "COMPLETED" },
            { value: "CANCELLED", label: "CANCELLED" },
          ]}
        />

        <Button
          onClick={() =>
            setFilters({
              status: "",
              order_code: "",
            })
          }
        >
          Reset
        </Button>
      </div>
      <div>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={isLoading}
        />

        <Modal
          title="Chi tiết đơn hàng"
          open={openDetail}
          footer={null}
          width={700}
          onCancel={() => setOpenDetail(false)}
        >
          {selectedOrder && (
            <>
              <p>
                <b>Mã đơn:</b> {selectedOrder.order_code}
              </p>

              <p>
                <b>Khách hàng:</b> {selectedOrder.user_name}
              </p>

              <p>
                <b>Tổng tiền:</b>{" "}
                {Number(selectedOrder.total_amount).toLocaleString()} đ
              </p>

              <Table
                columns={itemColumns}
                dataSource={selectedOrder.items}
                pagination={false}
                rowKey="id"
              />
            </>
          )}
        </Modal>
      </div>
    </div>
  );
}
