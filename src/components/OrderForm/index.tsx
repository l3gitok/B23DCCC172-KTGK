import React, { useState } from 'react';
import { Form, Select, Table, InputNumber, Button } from 'antd';
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
	const [products, setProducts] = useState(order?.products || []);
	const [form] = Form.useForm();

	const handleAddProduct = (productName: string) => {
		const product = productsList.find((p) => p.name === productName);
		if (product) {
			setProducts([...products, { ...product, quantity: 1 }]);
		}
	};

	const handleQuantityChange = (productName: string, quantity: number) => {
		setProducts((prevProducts) =>
			prevProducts.map((product) => (product.name === productName ? { ...product, quantity } : product)),
		);
	};

	const handleFinish = (values: any) => {
		const total = calculateTotal(products); // Tính tổng tiền
		const updatedOrder = { ...values, products, total, id: order?.id || `ORD-${Date.now()}` }; // Giữ nguyên mã nếu chỉnh sửa
		onSubmit(updatedOrder);
	};

	// Removed unused handleSubmit function

	const customers = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C']; // Danh sách khách hàng mẫu

	return (
		<Form form={form} layout='vertical' onFinish={handleFinish} initialValues={order}>
			<Form.Item name='customer' label='Khách hàng' rules={[{ required: true, message: 'Vui lòng chọn khách hàng' }]}>
				<Select placeholder='Chọn khách hàng'>
					{customers.map((customer) => (
						<Select.Option key={customer} value={customer}>
							{customer}
						</Select.Option>
					))}
				</Select>
			</Form.Item>
			<Form.Item name='status' label='Trạng thái' rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
				<Select>
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
					<Select.Option key={product.name} value={product.name}>
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
								onChange={(value) => handleQuantityChange(record.name, value || 1)}
							/>
						),
					},
					{
						title: 'Thành tiền',
						key: 'total',
						render: (_, record) => `${(record.price * record.quantity).toLocaleString()} VND`,
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
