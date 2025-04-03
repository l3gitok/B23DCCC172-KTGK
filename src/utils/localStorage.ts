export const saveToLocalStorage = (key: string, data: any) => {
	localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = (key: string) => {
	return JSON.parse(localStorage.getItem(key) || '[]');
};
