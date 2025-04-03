import { Order } from '@/models/order';

export const generateOrderId = (): string => `ORD-${Date.now()}`;

export const calculateTotal = (products: { price: number; quantity: number }[]): number => {
	return products.reduce((sum, product) => sum + product.price * product.quantity, 0);
};
