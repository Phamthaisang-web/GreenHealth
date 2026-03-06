import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { Table, Button, Modal, Form, Input, Popconfirm, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

interface Supplier {
  id: number;
  name: string;
  phone: string;
  address: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function SuppliersPage() {
  const queryClient = useQueryClient();

  const [open, setOpen] = React.useState(false);
  const [editingSupplier, setEditingSupplier] = React.useState<Supplier | null>(
    null,
  );
  const [form] = Form.useForm();

  // ================= GET =================
  const { data: suppliers = [], isLoading } = useQuery<Supplier[]>({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const res = await api.get("/suppliers/");
      return res.data;
    },
  });

  // ================= DELETE =================
  const deleteSupplier = useMutation({
    mutationFn: (id: number) => api.delete(`/suppliers/${id}`),

    onSuccess: () => {
      message.success("Xóa nhà cung cấp thành công");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },

    onError: () => {
      message.error("Xóa thất bại");
    },
  });

  // ================= CREATE =================
  const createSupplier = useMutation({
    mutationFn: (payload: any) => api.post("/suppliers", payload),

    onSuccess: () => {
      message.success("Thêm nhà cung cấp thành công");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });

      setOpen(false);
      form.resetFields();
    },

    onError: () => {
      message.error("Thêm thất bại");
    },
  });

  // ================= UPDATE =================
  const updateSupplier = useMutation({
    mutationFn: ({ id, payload }: any) => api.put(`/suppliers/${id}`, payload),

    onSuccess: () => {
      message.success("Cập nhật thành công");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });

      setOpen(false);
      setEditingSupplier(null);
      form.resetFields();
    },

    onError: () => {
      message.error("Cập nhật thất bại");
    },
  });

  // ================= TABLE =================
  const columns: ColumnsType<Supplier> = [
    {
      title: "Tên",
      dataIndex: "name",
    },
    {
      title: "SĐT",
      dataIndex: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      width: 300,
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
            onClick={() => {
              setEditingSupplier(record);
              setOpen(true);

              form.setFieldsValue({
                name: record.name,
                phone: record.phone,
                address: record.address,
                description: record.description,
              });
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={() => deleteSupplier.mutate(record.id)}
          >
            <Button danger type="link">
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  // ================= SUBMIT =================
  const handleSubmit = (values: any) => {
    if (editingSupplier) {
      updateSupplier.mutate({
        id: editingSupplier.id,
        payload: values,
      });
    } else {
      createSupplier.mutate(values);
    }
  };

  return (
    <div>
      <Button
        type="primary"
        style={{ marginBottom: 20 }}
        onClick={() => {
          setEditingSupplier(null);
          form.resetFields();
          setOpen(true);
        }}
      >
        Thêm nhà cung cấp
      </Button>

      <Table
        columns={columns}
        dataSource={suppliers}
        rowKey="id"
        loading={isLoading}
      />

      <Modal
        title={editingSupplier ? "Cập nhật nhà cung cấp" : "Thêm nhà cung cấp"}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditingSupplier(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={createSupplier.isPending || updateSupplier.isPending}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Nhập tên" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="SĐT"
            name="phone"
            rules={[{ required: true, message: "Nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Nhập địa chỉ" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Nhập mô tả" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
