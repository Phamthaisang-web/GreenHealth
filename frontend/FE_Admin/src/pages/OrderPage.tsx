import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import {
  Table,
  Tag,
  Modal,
  Button,
  Select,
  message,
  Input,
  DatePicker,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

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
  product_name: string;
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
    date_from: "",
    date_to: "",
  });

  // =========================
  // GET ORDERS
  // =========================

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["orders", filters],
    queryFn: async () => {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== ""),
      );

      const res = await api.get("/orders/", { params });

      return res.data;
    },
  });

  // =========================
  // GET ORDER DETAIL
  // =========================

  const getOrderDetail = async (id: number) => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  };

  // =========================
  // UPDATE STATUS
  // =========================

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

  // =========================
  // STATUS COLOR
  // =========================

  const renderStatus = (status: string) => {
    const colors: any = {
      PENDING: "orange",
      SHIPPING: "blue",
      COMPLETED: "green",
      CANCELLED: "red",
    };

    return <Tag color={colors[status]}>{status}</Tag>;
  };

  // =========================
  // TABLE COLUMNS
  // =========================

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
            style={{ width: 140 }}
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

  // =========================
  // ORDER ITEM COLUMNS
  // =========================

  const itemColumns: ColumnsType<OrderItem> = [
    {
      title: "Tên sản phẩm",
      dataIndex: "product_name",
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

      {/* FILTER */}

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

        <RangePicker
          onChange={(dates) => {
            if (!dates || !dates[0] || !dates[1]) {
              setFilters({
                ...filters,
                date_from: "",
                date_to: "",
              });
              return;
            }

            setFilters({
              ...filters,
              date_from: dates[0].format("YYYY-MM-DD"),
              date_to: dates[1].format("YYYY-MM-DD"),
            });
          }}
        />

        <Button
          onClick={() =>
            setFilters({
              status: "",
              order_code: "",
              date_from: "",
              date_to: "",
            })
          }
        >
          Reset
        </Button>
      </div>

      {/* TABLE */}

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={isLoading}
      />

      {/* MODAL DETAIL */}

      <Modal
        title="Chi tiết đơn hàng"
        open={openDetail}
        footer={null}
        width={900}
        onCancel={() => setOpenDetail(false)}
      >
        {selectedOrder && (
          <>
            <div style={{ marginBottom: 20 }}>
              <p>
                <b>Mã đơn:</b> {selectedOrder.order_code}
              </p>

              <p>
                <b>Trạng thái:</b> {renderStatus(selectedOrder.status)}
              </p>

              <p>
                <b>Ngày tạo:</b>{" "}
                {dayjs(selectedOrder.created_at).format("HH:mm DD/MM/YYYY")}
              </p>

              <p>
                <b>Khách hàng:</b> {selectedOrder.user_name}
              </p>

              <p>
                <b>SĐT:</b> {selectedOrder.user_phone}
              </p>

              <p>
                <b>Địa chỉ:</b> {selectedOrder.full_address}
              </p>

              <p>
                <b>Voucher:</b> {selectedOrder.voucher_code || "Không"}
              </p>

              <p>
                <b>Tổng trước giảm:</b>{" "}
                {Number(selectedOrder.total_amount_before).toLocaleString()} đ
              </p>

              <p>
                <b>Giảm giá:</b>{" "}
                {Number(selectedOrder.discount_amount).toLocaleString()} đ
              </p>

              <p>
                <b>Tổng thanh toán:</b>{" "}
                <span style={{ color: "red", fontWeight: 600 }}>
                  {Number(selectedOrder.total_amount).toLocaleString()} đ
                </span>
              </p>
            </div>

            <h3>Sản phẩm</h3>

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
  );
}
