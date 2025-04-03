import React, { useState, useEffect } from 'react';
import { Form, Select, Table, InputNumber, Button, message } from 'antd';
import { Order } from '@/models/order';
import { calculateTotal } from '@/services/order';

interface Props {
	order?: Order;
	onSubmit: (order: Order) => void;
	onCancel: () => void;
}

const productsList = [
	{ name: 'Sản phẩm A', price: 10000 },
	{ name: 'Sản phẩm B', price: 20000 },
	{ name: 'Sản phẩm C', price: 30000 },
];

const OrderForm: React.FC<Props> = ({ order, onSubmit, onCancel }) => {
	const [products, setProducts] = useState(order?.products || []); // Khởi tạo danh sách sản phẩm
	const [form] = Form.useForm();

	useEffect(() => {
		// Reset danh sách sản phẩm và các trường trong form khi order thay đổi
		setProducts(order?.products || []); // Nếu order là null, danh sách sản phẩm sẽ trống
		form.resetFields(); // Reset các trường trong form
	}, [order, form]);

	const handleAddProduct = (productName: string) => {
		const isProductExist = products.some((product) => product.name === productName);
		if (isProductExist) {
			message.error('Sản phẩm này đã được thêm vào danh sách!');
			return;
		}

		const product = productsList.find((p) => p.name === productName);
		if (product) {
			setProducts([...products, { ...product, quantity: 1 }]);
		}
	};

	const handleFinish = (values: any) => {
		const total = products.reduce((sum, product) => sum + product.price * product.quantity, 0); // Tính tổng tiền
		const updatedOrder = {
			...values,
			products,
			total,
			id: order?.id || `ORD-${Date.now()}`, // Tạo mã mới nếu không có
		};

		onSubmit(updatedOrder); // Gọi hàm onSubmit để xử lý
	};

	return (
		<Form
			form={form}
			layout='vertical'
			onFinish={handleFinish}
			initialValues={order || { customer: '', status: '', products: [] }} // Giá trị mặc định
		>
			<Form.Item name='customer' label='Khách hàng' rules={[{ required: true, message: 'Vui lòng chọn khách hàng' }]}>
				<Select placeholder='Chọn khách hàng'>
					{['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'].map((customer) => (
						<Select.Option key={customer} value={customer}>
							{customer}
						</Select.Option>
					))}
				</Select>
			</Form.Item>
			<Form.Item name='status' label='Trạng thái' rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
				<Select placeholder='Chọn trạng thái'>
					<Select.Option value='Chờ xác nhận'>Chờ xác nhận</Select.Option>
					<Select.Option value='Đang giao'>Đang giao</Select.Option>
					<Select.Option value='Hoàn thành'>Hoàn thành</Select.Option>
					<Select.Option value='Hủy'>Hủy</Select.Option>
				</Select>
			</Form.Item>
			<Select
				placeholder='Chọn sản phẩm'
				onChange={(value) => handleAddProduct(value)}
				style={{ width: '100%', marginBottom: 16 }}
			>
				{productsList.map((product) => (
					<Select.Option
						key={product.name}
						value={product.name}
						disabled={products.some((p) => p.name === product.name)} // Vô hiệu hóa sản phẩm đã chọn
					>
						{product.name} - {product.price.toLocaleString()} VND
					</Select.Option>
				))}
			</Select>
			<Table
				dataSource={products}
				columns={[
					{ title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
					{ title: 'Giá', dataIndex: 'price', key: 'price', render: (price) => `${price.toLocaleString()} VND` },
					{
						title: 'Số lượng',
						dataIndex: 'quantity',
						key: 'quantity',
						render: (quantity, record) => (
							<InputNumber
								min={1}
								value={quantity}
								onChange={(value) =>
									setProducts((prevProducts) =>
										prevProducts.map((product) =>
											product.name === record.name ? { ...product, quantity: value || 1 } : product,
										),
									)
								}
							/>
						),
					},
					{
						title: 'Thành tiền',
						key: 'total',
						render: (_, record) => `${(record.price * record.quantity).toLocaleString()} VND`,
					},
					{
						title: 'Hành động',
						key: 'action',
						render: (_, record) => (
							<Button
								danger
								onClick={() =>
									setProducts((prevProducts) => prevProducts.filter((product) => product.name !== record.name))
								}
							>
								Xóa
							</Button>
						),
					},
				]}
				rowKey='name'
			/>
			<div style={{ marginTop: 16 }}>
				<Button type='primary' htmlType='submit'>
					Lưu
				</Button>
				<Button style={{ marginLeft: 8 }} onClick={onCancel}>
					Hủy
				</Button>
			</div>
		</Form>
	);
};

export default OrderForm;
