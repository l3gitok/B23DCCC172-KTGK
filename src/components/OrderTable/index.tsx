import React from 'react';
import { Table, Tag, Button, Space, Modal } from 'antd';
import { Order } from '@/models/order';

interface Props {
	orders: Order[];
	onEdit: (order: Order) => void;
	onDelete: (id: string) => void; // Hủy đơn hàng
	onRemove: (id: string) => void; // Xóa đơn hàng
}

const OrderTable: React.FC<Props> = ({ orders, onEdit, onDelete, onRemove }) => {
	const columns = [
		{
			title: 'Mã đơn hàng',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'Khách hàng',
			dataIndex: 'customer',
			key: 'customer',
		},
		{
			title: 'Ngày đặt hàng',
			dataIndex: 'date',
			key: 'date',
			sorter: (a: Order, b: Order) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		},
		{
			title: 'Tổng tiền',
			dataIndex: 'total',
			key: 'total',
			sorter: (a: Order, b: Order) => a.total - b.total,
			render: (total: number) => `${total.toLocaleString()} VND`,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => {
				const color =
					status === 'Chờ xác nhận'
						? 'blue'
						: status === 'Đang giao'
						? 'orange'
						: status === 'Hoàn thành'
						? 'green'
						: 'red';
				return <Tag color={color}>{status}</Tag>;
			},
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, record: Order) => (
				<Space>
					<Button type='link' onClick={() => onEdit(record)}>
						Chỉnh sửa
					</Button>
					{record.status === 'Chờ xác nhận' && (
						<Button
							type='link'
							danger
							onClick={() =>
								Modal.confirm({
									title: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
									content: 'Hành động này không thể hoàn tác.',
									okText: 'Hủy đơn hàng',
									okType: 'danger',
									cancelText: 'Quay lại',
									onOk: () => onDelete(record.id), // Gọi hàm handleDelete
								})
							}
						>
							Hủy
						</Button>
					)}
					{record.status === 'Hủy' && (
						<Button
							type='link'
							danger
							onClick={() =>
								Modal.confirm({
									title: 'Bạn có chắc chắn muốn xóa đơn hàng này?',
									content: 'Hành động này không thể hoàn tác.',
									okText: 'Xóa',
									okType: 'danger',
									cancelText: 'Quay lại',
									onOk: () => onRemove(record.id), // Gọi hàm handleRemove
								})
							}
						>
							Xóa
						</Button>
					)}
				</Space>
			),
		},
	];

	return <Table columns={columns} dataSource={orders} rowKey='id' />;
};

export default OrderTable;
