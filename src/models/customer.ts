import { useState } from 'react';
import { saveToLocalStorage, getFromLocalStorage } from '@/utils/localStorage';

export interface Customer {
	id: string;
	name: string;
	phone: string;
	address: string;
}

export const useCustomerModel = () => {
	const [customers, setCustomers] = useState<Customer[]>(
		getFromLocalStorage('customers') || [
			{ id: 'C001', name: 'Nguyễn Văn A', phone: '0901234567', address: 'Hà Nội' },
			{ id: 'C002', name: 'Trần Thị B', phone: '0912345678', address: 'Hồ Chí Minh' },
			{ id: 'C003', name: 'Lê Văn C', phone: '0923456789', address: 'Đà Nẵng' },
			{ id: 'C004', name: 'Phạm Thị D', phone: '0934567890', address: 'Cần Thơ' },
			{ id: 'C005', name: 'Hoàng Văn E', phone: '0945678901', address: 'Hải Phòng' },
		],
	);

	const addCustomer = (customer: Customer) => {
		const updatedCustomers = [...customers, customer];
		setCustomers(updatedCustomers);
		saveToLocalStorage('customers', updatedCustomers);
	};

	const updateCustomer = (id: string, updatedCustomer: Partial<Customer>) => {
		const updatedCustomers = customers.map((customer) =>
			customer.id === id ? { ...customer, ...updatedCustomer } : customer,
		);
		setCustomers(updatedCustomers);
		saveToLocalStorage('customers', updatedCustomers);
	};

	const deleteCustomer = (id: string) => {
		const updatedCustomers = customers.filter((customer) => customer.id !== id);
		setCustomers(updatedCustomers);
		saveToLocalStorage('customers', updatedCustomers);
	};

	return {
		customers,
		addCustomer,
		updateCustomer,
		deleteCustomer,
	};
};
