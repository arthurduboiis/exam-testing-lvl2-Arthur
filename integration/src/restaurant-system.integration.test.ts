import { describe, it, expect, beforeEach } from 'vitest';
import { RestaurantSystem } from '../src/RestaurantService';
import { ICustomer, IProduct, IOrder, IInvoice } from '../src/types';

describe('Restaurant System Integration Tests', () => {
  let system: RestaurantSystem;
  let customer: ICustomer;
  let pasta: IProduct;
  let juice: IProduct;

  beforeEach(() => {
    system = new RestaurantSystem();

    customer = system.getCustomerService().createCustomer({
      name: 'Emma Martin',
      email: 'emma.martin@example.com',
      address: '42 Boulevard Haussmann, 75009 Paris',
      phone: '+33612345678',
    });

    pasta = system.getProductService().createProduct({
      name: 'Carbonara Pasta',
      description: 'Creamy sauce with bacon and parmesan',
      price: 14.0,
      category: 'main',
      available: true,
      preparationTimeMinutes: 25,
    });

    juice = system.getProductService().createProduct({
      name: 'Orange Juice',
      description: 'Freshly squeezed orange juice',
      price: 4.0,
      category: 'drink',
      available: true,
      preparationTimeMinutes: 2,
    });
  });

  it('should create a customer and retrieve correct details', () => {
    const created = system.getCustomerService().createCustomer({
      name: 'Lucas Moreau',
      email: 'lucas.moreau@example.com',
      address: '10 Rue des Lilas, 69007 Lyon',
      phone: '+33798765432',
    });

    const found = system.getCustomerService().getCustomer(created.id);
    expect(found).toBeDefined();
    expect(found?.email).toBe('lucas.moreau@example.com');
    expect(found?.name).toBe('Lucas Moreau');
    expect(found?.address).toBe('10 Rue des Lilas, 69007 Lyon');
    expect(found?.phone).toBe('+33798765432');
  });

  it('should create multiple products correctly', () => {
    const product1 = system.getProductService().createProduct({
      name: 'Caesar Salad',
      description: 'Chicken, parmesan, romaine lettuce',
      price: 10.5,
      category: 'starter',
      available: true,
      preparationTimeMinutes: 10,
    });

    const product2 = system.getProductService().createProduct({
      name: 'Apple Juice',
      description: 'Cold pressed apple juice',
      price: 3.0,
      category: 'drink',
      available: true,
      preparationTimeMinutes: 1,
    });

    expect(product1).toBeDefined();
    expect(product2).toBeDefined();
    expect(product1.name).toBe('Caesar Salad');
    expect(product2.name).toBe('Apple Juice');
  });

  it('should complete full order process including payment and loyalty', () => {
    const result = system.processOrder(customer.id, [
      { productId: pasta.id, quantity: 1 },
      { productId: juice.id, quantity: 2 },
    ]);

    expect(result.order).not.toBeNull();
    expect(result.invoice).not.toBeNull();

    const order = result.order!;
    const invoice = result.invoice!;

    expect(order.customerId).toBe(customer.id);
    expect(order.status).toBe('pending');
    expect(order.items.length).toBe(2);
    expect(order.totalAmount).toBeCloseTo(22.0); // 14 + 4*2

    expect(invoice.orderId).toBe(order.id);
    expect(invoice.tax).toBeCloseTo(2.2);
    expect(invoice.paid).toBe(false);

    const paid = system
      .getInvoiceService()
      .payInvoice(invoice.id, 'credit_card');
    expect(paid).toBe(true);

    const updatedInvoice = system
      .getInvoiceService()
      .getInvoice(invoice.id);
    expect(updatedInvoice?.paid).toBe(true);
    expect(updatedInvoice?.paymentMethod).toBe('credit_card');
    expect(updatedInvoice?.paidAt).toBeDefined();

    const updatedCustomer = system
      .getCustomerService()
      .getCustomer(customer.id);
    expect(updatedCustomer?.loyaltyPoints).toBe(2);
  });

  it('should grant loyalty points for a single product order', () => {
    system.processOrder(customer.id, [
      { productId: pasta.id, quantity: 3 },
    ]); // 42€
    const updated = system
      .getCustomerService()
      .getCustomer(customer.id);
    expect(updated?.loyaltyPoints).toBe(4);
  });

  it('should grant more loyalty points for large order total', () => {
    system.processOrder(customer.id, [
      { productId: pasta.id, quantity: 5 },
    ]); // 70€
    const updated = system
      .getCustomerService()
      .getCustomer(customer.id);
    expect(updated?.loyaltyPoints).toBe(7);
  });

  it('should fail to create order if product is unavailable', () => {
    const risotto = system.getProductService().createProduct({
      name: 'Mushroom Risotto',
      description: 'Arborio rice with mushrooms and parmesan',
      price: 13.5,
      category: 'main',
      available: false,
      preparationTimeMinutes: 20,
    });

    const result = system.processOrder(customer.id, [
      { productId: risotto.id, quantity: 1 },
    ]);

    expect(result.order).toBeNull();
    expect(result.invoice).toBeNull();
  });

  it('should allow order after product availability is updated', () => {
    const risotto = system.getProductService().createProduct({
      name: 'Mushroom Risotto',
      description: 'Arborio rice with mushrooms and parmesan',
      price: 13.5,
      category: 'main',
      available: false,
      preparationTimeMinutes: 20,
    });

    system
      .getProductService()
      .updateProductAvailability(risotto.id, true);

    const result = system.processOrder(customer.id, [
      { productId: risotto.id, quantity: 1 },
    ]);

    expect(result.order).not.toBeNull();
    expect(result.invoice).not.toBeNull();
  });

  it('should handle order status updates correctly', () => {
    const result = system.processOrder(customer.id, [
      { productId: pasta.id, quantity: 1 },
    ]);
    const order = result.order!;

    expect(
      system
        .getOrderService()
        .updateOrderStatus(order.id, 'preparing')
    ).toBe(true);
    expect(system.getOrderService().getOrder(order.id)?.status).toBe(
      'preparing'
    );

    expect(
      system.getOrderService().updateOrderStatus(order.id, 'ready')
    ).toBe(true);
    expect(system.getOrderService().getOrder(order.id)?.status).toBe(
      'ready'
    );

    expect(
      system
        .getOrderService()
        .updateOrderStatus(order.id, 'delivered')
    ).toBe(true);
    expect(system.getOrderService().getOrder(order.id)?.status).toBe(
      'delivered'
    );
  });

  it('should only allow cancellation when status is "pending"', () => {
    const result = system.processOrder(customer.id, [
      { productId: pasta.id, quantity: 1 },
    ]);
    const order = result.order!;

    expect(system.getOrderService().cancelOrder(order.id)).toBe(true);

    const second = system.processOrder(customer.id, [
      { productId: pasta.id, quantity: 1 },
    ]);
    const secondOrder = second.order!;
    system
      .getOrderService()
      .updateOrderStatus(secondOrder.id, 'preparing');

    expect(system.getOrderService().cancelOrder(secondOrder.id)).toBe(
      false
    );
  });

  it('should correctly calculate order amount and tax', () => {
    const result = system.processOrder(customer.id, [
      { productId: pasta.id, quantity: 2 }, // 28
      { productId: juice.id, quantity: 3 }, // 12
    ]);

    const order = result.order!;
    const invoice = result.invoice!;

    expect(order.totalAmount).toBeCloseTo(40.0);
    expect(invoice.totalAmount).toBeCloseTo(40.0);
    expect(invoice.tax).toBeCloseTo(4.0);
  });

  it('should fail to create order if customer does not exist', () => {
    const result = system.processOrder('unknown_id', [
      { productId: pasta.id, quantity: 1 },
    ]);
    expect(result.order).toBeNull();
    expect(result.invoice).toBeNull();
  });

  it('should not allow double payment of an invoice', () => {
    const result = system.processOrder(customer.id, [
      { productId: pasta.id, quantity: 1 },
    ]);
    const invoice = result.invoice!;

    expect(
      system.getInvoiceService().payInvoice(invoice.id, 'cash')
    ).toBe(true);
    expect(
      system.getInvoiceService().payInvoice(invoice.id, 'cash')
    ).toBe(false);
  });

  it('should correctly persist order and retrieve from service', () => {
    const result = system.processOrder(customer.id, [
      { productId: pasta.id, quantity: 1 },
    ]);
    const found = system.getOrderService().getOrder(result.order!.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(result.order!.id);
  });
});
