import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import {
  message,
  Table,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

interface Voucher {
  id: number;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_value: number;
  max_discount: number;
  quantity: number;
  start_date: string;
  end_date: string;
  status: string;
}

export default function VoucherPage() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);

  // =========================
  // GET VOUCHERS
  // =========================

  const { data: vouchers = [], isLoading } = useQuery<Voucher[]>({
    queryKey: ["vouchers"],
    queryFn: async () => {
      const res = await api.get("/vouchers/");
      return res.data.data;
    },
  });

  const deleteVoucher = useMutation({
    mutationFn: (id: number) => api.delete(`/vouchers/${id}`),

    onSuccess: () => {
      message.success("Xóa voucher thành công");
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
    },
  });

  const createVoucher = useMutation({
    mutationFn: (payload: any) => api.post("/vouchers", payload),
    onSuccess: () => {
      message.success("Thêm voucher thành công");
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      form.resetFields();
      setOpen(false);
    },
  });

  const updateVoucher = useMutation({
    mutationFn: ({ id, payload }: any) => api.put(`/vouchers/${id}`, payload),

    onSuccess: () => {
      message.success("Cập nhật voucher thành công");
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });

      form.resetFields();
      setEditingVoucher(null);
      setOpen(false);
    },
  });

  // =========================
  // TABLE COLUMNS
  // =========================

  const columns: ColumnsType<Voucher> = [
    {
      title: "Code",
      dataIndex: "code",
    },
    {
      title: "Loại giảm",
      dataIndex: "discount_type",
    },
    {
      title: "Giá trị",
      dataIndex: "discount_value",
    },
    {
      title: "Đơn tối thiểu",
      dataIndex: "min_order_value",
    },
    {
      title: "Giảm tối đa",
      dataIndex: "max_discount",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setEditingVoucher(record);
              setOpen(true);

              form.setFieldsValue({
                ...record,
                start_date: dayjs(record.start_date),
                end_date: dayjs(record.end_date),
              });
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => deleteVoucher.mutate(record.id)}
          >
            <Button danger type="link">
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  // =========================
  // SUBMIT FORM
  // =========================

  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      start_date: values.start_date.format("YYYY-MM-DD"),
      end_date: values.end_date.format("YYYY-MM-DD"),
    };

    if (editingVoucher) {
      updateVoucher.mutate({
        id: editingVoucher.id,
        payload,
      });
    } else {
      createVoucher.mutate(payload);
    }
  };

  return (
    <div>
      <h2>Danh sách Voucher</h2>

      <Button
        type="primary"
        style={{ marginBottom: 20 }}
        onClick={() => {
          setEditingVoucher(null);
          form.resetFields();
          setOpen(true);
        }}
      >
        Thêm Voucher
      </Button>

      <Table
        columns={columns}
        dataSource={vouchers}
        rowKey="id"
        loading={isLoading}
      />

      <Modal
        title={editingVoucher ? "Cập nhật Voucher" : "Thêm Voucher"}
        open={open}
        confirmLoading={createVoucher.isPending || updateVoucher.isPending}
        onCancel={() => {
          setOpen(false);
          setEditingVoucher(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Code" name="code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Loại giảm"
            name="discount_type"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "percent", label: "Percent (%)" },
                { value: "fixed", label: "Fixed (VNĐ)" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Giá trị giảm"
            name="discount_value"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Đơn tối thiểu" name="min_order_value">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Giảm tối đa" name="max_discount">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Ngày bắt đầu"
            name="start_date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Ngày kết thúc"
            name="end_date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
