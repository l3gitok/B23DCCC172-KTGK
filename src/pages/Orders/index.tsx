import React, { useState } from 'react';
import { Button, Input, message, Select, Modal } from 'antd';
import OrderTable from '@/components/OrderTable';
import OrderForm from '@/components/OrderForm';
import useOrderModel from '@/models/order';
import moment from 'moment';

const OrdersPage = () => {
	const { orders, addOrder, updateOrder, deleteOrder } = useOrderModel();
	const [editingOrder, setEditingOrder] = useState<null | any>(null);
	const [isAddModalVisible, setIsAddModalVisible] = useState(false);
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [filterStatus, setFilterStatus] = useState('');

	// Hiển thị modal thêm đơn hàng
	const handleAdd = () => {
		setEditingOrder(null); // Đặt giá trị null để đảm bảo form trống
		setIsAddModalVisible(true);
	};

	// Hiển thị modal chỉnh sửa đơn hàng
	const handleEdit = (order: any) => {
		setEditingOrder(order);
		setIsEditModalVisible(true);
	};

	// Đóng modal thêm đơn hàng
	const handleAddCancel = () => {
		setIsAddModalVisible(false);
	};

	// Đóng modal chỉnh sửa đơn hàng
	const handleEditCancel = () => {
		setEditingOrder(null);
		setIsEditModalVisible(false);
	};

	// Xử lý thêm đơn hàng
	const handleAddSubmit = (order: any) => {
		if (moment(order.date).isBefore(moment(), 'day')) {
			message.error('Không thể đặt hàng trong quá khứ!');
			return;
		}

		const newOrderId = `ORD-${Date.now()}`;
		const isDuplicate = orders.some((o) => o.id === newOrderId);
		if (isDuplicate) {
			message.error('Mã đơn hàng đã tồn tại!');
			return;
		}

		addOrder({ ...order, id: newOrderId });
		message.success('Đã thêm đơn hàng');
		setIsAddModalVisible(false);
	};

	// Xử lý chỉnh sửa đơn hàng
	const handleEditSubmit = (order: any) => {
		if (moment(order.date).isBefore(moment(), 'day')) {
			message.error('Không thể đặt hàng trong quá khứ!');
			return;
		}

		updateOrder(order.id, order);
		message.success('Đã cập nhật đơn hàng');
		setEditingOrder(null);
		setIsEditModalVisible(false);
	};

	// Lọc đơn hàng
	const filteredOrders = orders.filter(
		(order) =>
			(order.id.toLowerCase().includes(searchText.toLowerCase()) ||
				order.customer.toLowerCase().includes(searchText.toLowerCase())) &&
			(filterStatus ? order.status === filterStatus : true),
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
					<Select.Option value=''>Tất cả</Select.Option>
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
				onDelete={(id) => {
					const order = orders.find((o) => o.id === id);
					if (!order) return;

					if (order.status !== 'Chờ xác nhận') {
						message.error('Chỉ có thể hủy đơn hàng ở trạng thái "Chờ xác nhận"');
						return;
					}

					updateOrder(id, { status: 'Hủy' });
					message.success('Đơn hàng đã được hủy');
				}}
				onRemove={(id) => {
					const order = orders.find((o) => o.id === id);
					if (!order) return;

					if (order.status !== 'Hủy') {
						message.error('Chỉ có thể xóa đơn hàng ở trạng thái "Hủy"');
						return;
					}

					deleteOrder(id);
					message.success('Đơn hàng đã được xóa');
				}}
			/>
			{/* Modal Thêm Đơn Hàng */}
			<Modal visible={isAddModalVisible} title='Thêm đơn hàng' onCancel={handleAddCancel} footer={null}>
				<OrderForm onSubmit={handleAddSubmit} onCancel={handleAddCancel} />
			</Modal>
			{/* Modal Chỉnh Sửa Đơn Hàng */}
			<Modal visible={isEditModalVisible} title='Chỉnh sửa đơn hàng' onCancel={handleEditCancel} footer={null}>
				<OrderForm order={editingOrder} onSubmit={handleEditSubmit} onCancel={handleEditCancel} />
			</Modal>
		</div>
	);
};

export default OrdersPage;
