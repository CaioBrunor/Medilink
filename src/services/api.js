import { tokenStorage } from './storage';

const API_URL = 'http://127.0.0.1:5000/api';

const getHeaders = () => {
    const token = tokenStorage.get();
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

export const apiService = {
    async login(identifier, password) {
        const isEmail = identifier.includes('@');
        const payload = { password, [isEmail ? 'email' : 'crm']: identifier };

        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.msg || 'Erro ao fazer login');
        }
        
        const data = await response.json();
        if (data.token) tokenStorage.set(data.token);
        return data;
    },

    async register(userData) {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.msg || error.message || 'Erro ao cadastrar');
        }
        return response.json();
    },

    async getProducts() {
        const response = await fetch(`${API_URL}/products`, {
            method: 'GET',
            headers: getHeaders(),
        });
        if (response.status === 401) tokenStorage.clear();
        if (!response.ok) throw new Error('Erro ao buscar produtos');
        return response.json();
    },

    async saveProduct(productData) {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(productData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Detalhes do erro do servidor:", errorData);
            throw new Error(errorData.msg || errorData.message || 'Erro ao salvar produto');
        }
        return response.json();
    },

    async createOrder(productsArray) {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ products: productsArray }),
        });
        if (response.status === 401) tokenStorage.clear();
        if (!response.ok) throw new Error('Erro ao criar pedido');
        return response.json();
    },

    async getOrders() {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'GET',
            headers: getHeaders(),
        });
        if (response.status === 401) tokenStorage.clear();
        if (!response.ok) throw new Error('Erro ao buscar pedidos');
        return response.json();
    }
};