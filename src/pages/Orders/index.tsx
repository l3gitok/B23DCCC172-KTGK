import React, { useState } from 'react';
import { Button, Input, message, Select, Modal } from 'antd';
import OrderTable from '@/components/OrderTable';
import OrderForm from '@/components/OrderForm';
import useOrderModel from '@/models/order';

const OrdersPage = () => {
	const { orders, addOrder, updateOrder, deleteOrder } = useOrderModel();
	const [editingOrder, setEditingOrder] = useState<{
		id: string;
		customer: string;
		date: string;
		total: number;
		status: 'Chờ xác nhận' | 'Đang giao' | 'Hoàn thành' | 'Hủy';
		products: any[];
	} | null>(null);
	const [searchText, setSearchText] = useState('');
	const [filterStatus, setFilterStatus] = useState('');

	const handleAdd = () =>
		setEditingOrder({
			id: '',
			customer: '',
			date: new Date().toISOString(),
			total: 0,
			status: 'Chờ xác nhận',
			products: [],
		});

	const handleEdit = (order: any) => setEditingOrder(order);

	const handleDelete = (id: string) => {
		const order = orders.find((o) => o.id === id);
		if (!order) return;

		if (order.status !== 'Chờ xác nhận') {
			message.error('Chỉ có thể hủy đơn hàng ở trạng thái "Chờ xác nhận"');
			return;
		}

		// Cập nhật trạng thái thành "Hủy"
		updateOrder(id, { status: 'Hủy' });
		message.success('Đơn hàng đã được hủy');
	};

	const handleRemove = (id: string) => {
		const order = orders.find((o) => o.id === id);
		if (!order) return;

		if (order.status !== 'Hủy') {
			message.error('Chỉ có thể xóa đơn hàng ở trạng thái "Hủy"');
			return;
		}

		deleteOrder(id); // Xóa đơn hàng khỏi danh sách
		message.success('Đơn hàng đã được xóa');
	};

	const handleSubmit = (order: any) => {
		if (!order.id) {
			const isDuplicate = orders.some((o) => o.id === order.id);
			if (isDuplicate) {
				message.error('Mã đơn hàng đã tồn tại!');
				return;
			}
		}
		if (order.id) {
			updateOrder(order.id, order);
			message.success('Đã cập nhật đơn hàng');
		} else {
			addOrder({ ...order, id: `ORD-${Date.now()}` });
			message.success('Đã thêm đơn hàng');
		}
		setEditingOrder(null);
	};

	const submitOrder = (order: any) => {
		if (order.id) {
			// Cập nhật đơn hàng
			updateOrder(order.id, order);
			message.success('Đã cập nhật đơn hàng');
		} else {
			// Kiểm tra trùng mã đơn hàng
			const isDuplicate = orders.some((o) => o.id === order.id);
			if (isDuplicate) {
				message.error('Mã đơn hàng đã tồn tại!');
				return;
			}

			// Thêm đơn hàng mới
			addOrder({ ...order, id: `ORD-${Date.now()}` });
			message.success('Đã thêm đơn hàng');
		}
	};

	const filteredOrders = orders.filter(
		(order) =>
			(order.id.toLowerCase().includes(searchText.toLowerCase()) ||
				order.customer.toLowerCase().includes(searchText.toLowerCase())) &&
			(filterStatus ? order.status === filterStatus : true), // Hiển thị tất cả nếu filterStatus rỗng
	);

	return (
		<div>
			<div style={{ display: 'flex', gap: '16px', marginBottom: 16 }}>
				<Input.Search
					placeholder='Tìm kiếm theo mã đơn hàng hoặc khách hàng'
					onChange={(e) => setSearchText(e.target.value)}
					style={{ flex: 1 }}
				/>
				<Select
					placeholder='Lọc theo trạng thái'
					onChange={(value) => setFilterStatus(value)}
					allowClear
					style={{ width: 200 }}
				>
					<Select.Option value=''>Tất cả</Select.Option> {/* Hiển thị tất cả trạng thái */}
					<Select.Option value='Chờ xác nhận'>Chờ xác nhận</Select.Option>
					<Select.Option value='Đang giao'>Đang giao</Select.Option>
					<Select.Option value='Hoàn thành'>Hoàn thành</Select.Option>
					<Select.Option value='Hủy'>Hủy</Select.Option>
				</Select>
			</div>
			<Button type='primary' onClick={handleAdd} style={{ marginBottom: 16 }}>
				Thêm đơn hàng
			</Button>
			<OrderTable
				orders={filteredOrders}
				onEdit={handleEdit}
				onDelete={handleDelete} // Gọi handleDelete khi hủy
				onRemove={handleRemove} // Gọi handleRemove khi xóa
			/>
			<Modal
				visible={!!editingOrder}
				title={editingOrder?.id ? 'Chỉnh sửa đơn hàng' : 'Thêm đơn hàng'}
				onCancel={() => setEditingOrder(null)}
				footer={null}
			>
				<OrderForm order={editingOrder || undefined} onSubmit={handleSubmit} onCancel={() => setEditingOrder(null)} />
			</Modal>
		</div>
	);
};

export default OrdersPage;
