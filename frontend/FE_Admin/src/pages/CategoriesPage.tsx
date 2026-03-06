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
  Upload,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile } from "antd/es/upload/interface";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [uploadedImage, setUploadedImage] = useState<UploadFile[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const getImageUrl = () => {
    if (!uploadedImage.length) return editingCategory?.image || null;

    const file = uploadedImage[0];

    if (file.response?.url) return file.response.url;

    if (file.url) {
      return file.url.replace(api.defaults.baseURL || "", "");
    }

    return null;
  };

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories/");
      return res.data;
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (id: number) => api.delete(`/categories/${id}`),

    onSuccess: () => {
      message.success("Xóa danh mục thành công");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },

    onError: () => {
      message.error("Xóa danh mục thất bại");
    },
  });

  const createCategory = useMutation({
    mutationFn: (payload: any) => api.post("/categories/", payload),

    onSuccess: () => {
      message.success("Thêm danh mục thành công");

      queryClient.invalidateQueries({ queryKey: ["categories"] });

      form.resetFields();
      setUploadedImage([]);
      setOpen(false);
    },

    onError: () => {
      message.error("Thêm danh mục thất bại");
    },
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, payload }: any) => api.put(`/categories/${id}`, payload),

    onSuccess: () => {
      message.success("Cập nhật danh mục thành công");

      queryClient.invalidateQueries({ queryKey: ["categories"] });

      form.resetFields();
      setUploadedImage([]);
      setEditingCategory(null);
      setOpen(false);
    },

    onError: () => {
      message.error("Cập nhật danh mục thất bại");
    },
  });

  const columns: ColumnsType<Category> = [
    {
      title: "Ảnh",
      dataIndex: "image",
      render: (url: string) =>
        url ? (
          <img
            src={`${api.defaults.baseURL}${url}`}
            width={60}
            height={60}
            style={{ objectFit: "cover", borderRadius: 6 }}
          />
        ) : (
          "Không có ảnh"
        ),
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      render: (date: string) => dayjs(date).format("HH:mm DD/MM/YYYY"),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updated_at",
      render: (date: string) => dayjs(date).format("HH:mm DD/MM/YYYY"),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setEditingCategory(record);
              setOpen(true);

              form.setFieldsValue({
                name: record.name,
                description: record.description,
              });

              if (record.image) {
                setUploadedImage([
                  {
                    uid: String(record.id),
                    name: "image.png",
                    status: "done",
                    url: `${api.defaults.baseURL}${record.image}`,
                    response: { url: record.image },
                  },
                ]);
              }
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => deleteCategory.mutate(record.id)}
          >
            <Button danger type="link">
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const handleSubmit = (values: any) => {
    const imageUrl = getImageUrl();

    if (!imageUrl) {
      message.error("Vui lòng upload ảnh");
      return;
    }

    const payload = {
      ...values,
      image: imageUrl,
    };

    if (editingCategory) {
      updateCategory.mutate({
        id: editingCategory.id,
        payload,
      });
    } else {
      createCategory.mutate(payload);
    }
  };

  return (
    <div>
      <h2>Danh sách danh mục</h2>
      <div>
        <Button
          type="primary"
          style={{ marginBottom: 20 }}
          onClick={() => {
            setEditingCategory(null);
            setUploadedImage([]);
            form.resetFields();
            setOpen(true);
          }}
        >
          Thêm danh mục
        </Button>

        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={isLoading}
        />

        <Modal
          title={editingCategory ? "Cập nhật danh mục" : "Thêm danh mục"}
          open={open}
          confirmLoading={createCategory.isPending || updateCategory.isPending}
          onCancel={() => {
            setOpen(false);
            setEditingCategory(null);
            setUploadedImage([]);
            form.resetFields();
          }}
          onOk={() => form.submit()}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Tên danh mục"
              name="name"
              rules={[{ required: true, message: "Nhập tên danh mục" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ message: "Nhập mô tả" }]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item label="Ảnh danh mục">
              <Upload
                name="file"
                action={`${api.defaults.baseURL}/upload/image`}
                listType="picture-card"
                maxCount={1}
                fileList={uploadedImage}
                onChange={({ fileList }) => setUploadedImage(fileList)}
                onRemove={() => setUploadedImage([])}
              >
                {uploadedImage.length < 1 && (
                  <div>
                    <UploadOutlined />
                    <div>Tải ảnh</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
