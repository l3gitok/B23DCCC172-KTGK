import { useState } from 'react';
import { saveToLocalStorage, getFromLocalStorage } from '@/utils/localStorage';

export interface OrderProduct {
	name: string;
	price: number;
	quantity: number;
}

export interface Order {
	id: string;
	customer: string;
	date: string;
	total: number;
	status: 'Chờ xác nhận' | 'Đang giao' | 'Hoàn thành' | 'Hủy';
	products: OrderProduct[];
}

export default () => {
	const [orders, setOrders] = useState<Order[]>(getFromLocalStorage('orders'));

	const addOrder = (newOrder: Order) => {
		setOrders((prevOrders) => [...prevOrders, newOrder]); // Thêm đơn hàng mới vào danh sách
		saveToLocalStorage('orders', [...orders, newOrder]);
	};

	const updateOrder = (id: string, updatedOrder: Partial<Order>) => {
		const updatedOrders = orders.map((order) => (order.id === id ? { ...order, ...updatedOrder } : order));
		setOrders(updatedOrders);
		saveToLocalStorage('orders', updatedOrders);
	};

	const deleteOrder = (id: string) => {
		const updatedOrders = orders.filter((order) => order.id !== id);
		setOrders(updatedOrders);
		saveToLocalStorage('orders', updatedOrders);
	};

	return {
		orders,
		addOrder,
		updateOrder,
		deleteOrder,
	};
};
