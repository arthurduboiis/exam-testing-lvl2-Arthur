import { describe, it, expect, beforeEach } from 'vitest';
import { OrderService } from './OrderService';
import { ProductService } from './ProductService';
import { CustomerService } from './CustomerService';
import { DataStore } from './DataStore';

describe('OrderService - Integration', () => {
  let dataStore: DataStore;
  let productService: ProductService;
  let customerService: CustomerService;
  let orderService: OrderService;

  let customerId: string;
  let availableProductId: string;
  let unavailableProductId: string;

  beforeEach(() => {
    dataStore = new DataStore();
    productService = new ProductService(dataStore);
    customerService = new CustomerService(dataStore);
    orderService = new OrderService(
      dataStore,
      productService,
      customerService
    );

    // Setup initial data
    const customer = customerService.createCustomer({
      name: 'Alice',
      email: 'alice',
      address: '123 Main St',
      phone: '1234567890',
    });

    customerId = customer.id;

    const availableProduct = productService.createProduct({
      name: 'Pizza',
      description: 'Delicious cheese pizza',
      category: 'main',
      price: 12,
      available: true,
      preparationTimeMinutes: 20,
    });

    availableProductId = availableProduct.id;

    const unavailableProduct = productService.createProduct({
      name: 'Tiramisu',
      description: 'Miam miam tiramisu',
      category: 'dessert',
      price: 8,
      available: false,
      preparationTimeMinutes: 10,
    });

    unavailableProductId = unavailableProduct.id;
  });

  it('should create a valid order and assign loyalty points', () => {
    const order = orderService.createOrder(customerId, [
      { productId: availableProductId, quantity: 2 },
    ]);

    expect(order).toBeDefined();
    expect(order?.totalAmount).toBe(24);
    expect(order?.status).toBe('pending');
    expect(order?.items.length).toBe(1);

    const customer = customerService.getCustomer(customerId);
    expect(customer?.loyaltyPoints).toBe(2); // 24 / 10 = 2
  });

  it('should not create an order with unavailable product', () => {
    const order = orderService.createOrder(customerId, [
      { productId: unavailableProductId, quantity: 1 },
    ]);
    expect(order).toBeNull();
  });

  it('should retrieve an order by ID', () => {
    const order = orderService.createOrder(customerId, [
      { productId: availableProductId, quantity: 1 },
    ]);

    const retrieved = orderService.getOrder(order!.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(order?.id);
  });

  it('should update order status', () => {
    const order = orderService.createOrder(customerId, [
      { productId: availableProductId, quantity: 1 },
    ]);

    const success = orderService.updateOrderStatus(
      order!.id,
      'delivered'
    );
    expect(success).toBe(true);

    const updated = orderService.getOrder(order!.id);
    expect(updated?.status).toBe('delivered');
  });

  it('should cancel an order only if it is pending', () => {
    const order = orderService.createOrder(customerId, [
      { productId: availableProductId, quantity: 1 },
    ]);

    const cancelled = orderService.cancelOrder(order!.id);
    expect(cancelled).toBe(true);

    const updated = orderService.getOrder(order!.id);
    expect(updated?.status).toBe('cancelled');
  });

  it('should not cancel a non-pending order', () => {
    const order = orderService.createOrder(customerId, [
      { productId: availableProductId, quantity: 1 },
    ]);

    orderService.updateOrderStatus(order!.id, 'delivered');

    const cancelled = orderService.cancelOrder(order!.id);
    expect(cancelled).toBe(false);
  });

  it('should return all orders for a customer', () => {
    orderService.createOrder(customerId, [
      { productId: availableProductId, quantity: 1 },
    ]);
    orderService.createOrder(customerId, [
      { productId: availableProductId, quantity: 2 },
    ]);

    const orders = orderService.getCustomerOrders(customerId);
    expect(orders.length).toBe(2);
  });
});
