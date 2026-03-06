import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  message,
  DatePicker,
  Table,
  Button,
  Select,
  Popconfirm,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import CardComponent from "../components/CardComponent";
export default function ProductPage() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadFile[]>([]);
  const token = localStorage.getItem("token");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [filters, setFilters] = useState({
    name: "",
    category_name: "",
    supplier_name: "",
    min_price: null as number | null,
    max_price: null as number | null,
  });
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const res = await api.get("/products/", {
        params: filters,
      });
      const productList = res.data;
      const productsWithImages = await Promise.all(
        productList.map(async (product: any) => {
          try {
            const imgRes = await api.get(
              `/product-images/product/${product.id}`,
            );
            const images = imgRes.data;
            const mainImage = images.find((img: any) => img.is_main === 1);

            return {
              ...product,
              image_url: mainImage ? mainImage.image_url : null,
            };
          } catch {
            return {
              ...product,
              image_url: null,
            };
          }
        }),
      );

      return productsWithImages;
    },
  });
  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const res = await api.get("/suppliers/");
      return res.data;
    },
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories/");
      return res.data;
    },
  });
  const createProduct = useMutation({
    mutationFn: async (values: any) => {
      const formattedValues = {
        name: values.name,
        description: values.description,
        price: Number(values.price),
        manufacture_date: values.manufacture_date.format("YYYY-MM-DD"),
        expiry_date: values.expiry_date.format("YYYY-MM-DD"),
        origin: values.origin,
        unit: values.unit,
        category_id: values.category_id,
        supplier_id: values.supplier_id,
      };

      const { data } = await api.post("/products/", formattedValues, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const productId = data?.data?.id;

      if (!productId) throw new Error("Không lấy được product ID");

      const imageUrls = uploadedImages
        .filter((file) => file.status === "done")
        .map((file) => file.response?.url)
        .filter(Boolean);

      if (imageUrls.length > 0) {
        await Promise.all(
          imageUrls.map((url, index) =>
            api.post(
              "/product-images/",
              {
                product_id: productId,
                image_url: url,
                is_main: index === 0,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            ),
          ),
        );
      }
      return data;
    },

    onSuccess: () => {
      message.success("Tạo sản phẩm thành công 🎉");
      setOpen(false);
      setUploadedImages([]);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },

    onError: (error: any) => {
      const backendError =
        error?.response?.data?.error || error?.response?.data?.message;

      const errorField = error?.response?.data?.field;

      if (errorField) {
        form.setFields([
          {
            name: errorField,
            errors: [backendError],
          },
        ]);
      }

      message.error(backendError || "Tạo thất bại ❌");
    },
  });
  const updateProduct = useMutation({
    mutationFn: async ({ id, values }: any) => {
      const formattedValues = {
        name: values.name,
        description: values.description,
        price: Number(values.price),
        manufacture_date: values.manufacture_date
          ? values.manufacture_date.format("YYYY-MM-DD")
          : null,

        expiry_date: values.expiry_date
          ? values.expiry_date.format("YYYY-MM-DD")
          : null,
        origin: values.origin,
        unit: values.unit,
        category_id: values.category_id,
        supplier_id: values.supplier_id,
      };

      await api.put(`/products/${id}`, formattedValues, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newImages = uploadedImages.filter((f) => f.originFileObj);

      await Promise.all(
        newImages.map((file, index) =>
          api.post(
            "/product-images/",
            {
              product_id: id,
              image_url: file.response.url,
              is_main: uploadedImages.indexOf(file) === 0,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
        ),
      );
    },

    onSuccess: () => {
      message.success("Cập nhật sản phẩm thành công 🎉");
      setOpen(false);
      setEditingProduct(null);
      setUploadedImages([]);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
  const deleteProduct = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },

    onSuccess: () => {
      message.success("Xóa sản phẩm thành công");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },

    onError: () => {
      message.error("Xóa thất bại");
    },
  });

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image_url",
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
    { title: "Tên sản phẩm", dataIndex: "name" },
    {
      title: "Giá",
      dataIndex: "price",
      render: (price: string) => `${Number(price).toLocaleString()} đ`,
    },
    { title: "Mô tả", dataIndex: "description" },
    { title: "Xuất xứ", dataIndex: "origin" },
    { title: "Đơn vị", dataIndex: "unit" },
    { title: "Danh mục", dataIndex: "category_name" },
    { title: "Nhà cung cấp", dataIndex: "supplier_name" },
    {
      title: "Ngày sản xuất",
      dataIndex: "manufacture_date",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "expiry_date",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hành động",
      render: (_: any, record: any) => (
        <>
          <Button
            type="link"
            onClick={async () => {
              setEditingProduct(record);
              setOpen(true);

              form.setFieldsValue({
                name: record.name,
                price: record.price,
                description: record.description,
                origin: record.origin,
                unit: record.unit,
                category_id: record.category_id,
                supplier_id: record.supplier_id,
                manufacture_date: dayjs(record.manufacture_date),
                expiry_date: dayjs(record.expiry_date),
              });

              const res = await api.get(`/product-images/product/${record.id}`);

              const images = res.data;

              const fileList = images.map((img: any) => ({
                uid: String(img.id),
                name: "image.png",
                status: "done",
                url: `${api.defaults.baseURL}${img.image_url}`,
              }));

              setUploadedImages(fileList);
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xóa sản phẩm?"
            onConfirm={() => deleteProduct.mutate(record.id)}
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Danh sách sản phẩm</h2>
      <div
        style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}
      >
        <Input
          placeholder="Tìm tên sản phẩm"
          style={{ width: 200 }}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />

        <Select
          placeholder="Danh mục"
          style={{ width: 180 }}
          allowClear
          onChange={(value) =>
            setFilters({ ...filters, category_name: value || "" })
          }
        >
          {categories.map((cat: any) => (
            <Select.Option key={cat.id} value={cat.name}>
              {cat.name}
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Nhà cung cấp"
          style={{ width: 180 }}
          allowClear
          onChange={(value) =>
            setFilters({ ...filters, supplier_name: value || "" })
          }
        >
          {suppliers.map((sup: any) => (
            <Select.Option key={sup.id} value={sup.name}>
              {sup.name}
            </Select.Option>
          ))}
        </Select>
        <InputNumber
          placeholder="Giá từ"
          style={{ width: 120 }}
          onChange={(value) =>
            setFilters({
              ...filters,
              min_price: value ? Number(value) : null,
            })
          }
        />

        <InputNumber
          placeholder="Giá đến"
          style={{ width: 120 }}
          onChange={(value) =>
            setFilters({
              ...filters,
              max_price: value ? Number(value) : null,
            })
          }
        />
        <Button
          onClick={() =>
            setFilters({
              name: "",
              category_name: "",
              supplier_name: "",
              min_price: null,
              max_price: null,
            })
          }
        >
          Reset
        </Button>
      </div>
      <Button
        type="primary"
        onClick={() => {
          setEditingProduct(null);
          setUploadedImages([]);
          form.resetFields();
          setOpen(true);
        }}
      >
        + Tạo mới
      </Button>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={isLoading}
        scroll={{ x: 1500 }}
        style={{ marginTop: 20 }}
      />

      <Modal
        title={editingProduct ? "Cập nhật sản phẩm" : "Tạo sản phẩm"}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditingProduct(null);
          form.resetFields();
        }}
        onOk={() => {
          console.log("Before submit:", uploadedImages);
          form.submit();
        }}
        confirmLoading={createProduct.isPending || updateProduct.isPending}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            if (editingProduct) {
              updateProduct.mutate({
                id: editingProduct.id,
                values,
              });
            } else {
              createProduct.mutate(values);
            }
          }}
        >
          <Form.Item label="Ảnh sản phẩm">
            <Upload
              name="file"
              action={`${api.defaults.baseURL}/upload/image`}
              headers={{ Authorization: `Bearer ${token}` }}
              listType="picture-card"
              multiple
              maxCount={5}
              fileList={uploadedImages}
              onChange={({ fileList }) => {
                setUploadedImages(fileList);
              }}
              onRemove={async (file) => {
                if (!file.originFileObj) {
                  await api.delete(`/product-images/${file.uid}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                }
              }}
            >
              {uploadedImages.length < 5 && (
                <div>
                  <UploadOutlined />
                  <div>Tải ảnh</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: "Nhập tên sản phẩm" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: "Nhập giá" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="origin"
            label="Xuất xứ"
            rules={[{ required: true, message: "Nhập xuất xứ" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="unit"
            label="Đơn vị"
            rules={[{ required: true, message: "Nhập đơn vị" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="category_id"
            label="Danh mục"
            rules={[{ required: true, message: "Chọn danh mục" }]}
          >
            <Select placeholder="Chọn danh mục">
              {categories.map((cat: any) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="supplier_id"
            label="Nhà cung cấp"
            rules={[{ required: true, message: "Chọn nhà cung cấp" }]}
          >
            <Select placeholder="Chọn nhà cung cấp">
              {suppliers.map((sup: any) => (
                <Select.Option key={sup.id} value={sup.id}>
                  {sup.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="manufacture_date"
            label="Ngày sản xuất"
            rules={[{ required: true, message: "Chọn ngày sản xuất" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="expiry_date"
            label="Hạn sử dụng"
            rules={[{ required: true, message: "Chọn hạn sử dụng" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
