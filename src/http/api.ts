import { DeliveryPerson, InventoryData, OrderData, OrderStatusData, Product, Warehouse } from "@/types";
import { api } from "./client"

// api is instance of axios

export const getAllProducts = async () => {
  const response = await api.get('/products');
  const {allProducts}: any = response.data
  console.log(allProducts); 
  return await allProducts as Product[];
};

export const createProduct = async (data: FormData) => {
  const resp = await api.post('/products', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return resp.data;
}


export const getAllDeliveryPersons = async () => {
  const resp = await api.get('/delivery-persons');
  const {fetchedDeliveryPersons}: any = resp.data;
  return fetchedDeliveryPersons as DeliveryPerson[]
}

export const createDeliveryPerson = async (data: FormData) => {

  console.log( "Inside API", data);

  const correctData = {
    name: data.get("name"),
    phone: data.get("phone"),
    warehouseId: Number(data.get("warehouseId"))
  }
  
  const resp = await api.post('/delivery-persons', correctData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return resp.data;
}

export const createWarehouse = async (data: FormData) => {

  const response = await api.post('/warehouses', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const getAllWarehouses = async () => {
  const resp = await api.get('/warehouses');
  const {allWarehouse}: any = resp.data;
  return allWarehouse;
};

export const getAllInventories = async () => {
  const response = await api.get('/inventories');
  return await response.data;
};

export const createInventory = async (data: InventoryData) => {
  const response = await api.post('/inventories', data);
  return response.data;
};

export const getSingleProduct = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return await response.data;
};

export const placeOrder = async (data: OrderData) => {
  const response = await api.post(`/orders`, data);
  return await response.data;
};

export const getAllOrders = async () => {
  const response = await api.get(`/orders`);
  return await response.data;
};

export const changeOrderStatus = async (data: OrderStatusData) => {
  const response = await api.patch(`/orders/status`, data);
  return await response.data;
};

export const getMyOrders = async () => {
  const response = await api.get(`/orders/history`);
  return await response.data;
};
