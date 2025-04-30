import { describe, it, expect, beforeEach } from 'vitest';
import { RestaurantSystem } from '../src/RestaurantService';
import { ICustomer, IProduct, IOrder, IInvoice } from '../src/types';

describe('Restaurant System Integration Tests', () => {
  let system: RestaurantSystem;
  let customer: ICustomer;
  let pizza: IProduct;
  let soda: IProduct;

  beforeEach(() => {
    system = new RestaurantSystem();

    customer = system.getCustomerService().createCustomer({
      name: 'Jean Dupont',
      email: 'jean@example.com',
      address: '123 Rue de Paris, 75001 Paris',
      phone: '+33123456789',
    });

    pizza = system.getProductService().createProduct({
      name: 'Margherita',
      description: 'Tomate, mozzarella, basilic',
      price: 12.5,
      category: 'main',
      available: true,
      preparationTimeMinutes: 20,
    });

    soda = system.getProductService().createProduct({
      name: 'Cola',
      description: 'Boisson gazeuse',
      price: 3.5,
      category: 'drink',
      available: true,
      preparationTimeMinutes: 1,
    });
  });

  // Test de création de client
  it('Créer un client et vérifier ses données', () => {
    const createdCustomer = system
      .getCustomerService()
      .createCustomer({
        name: 'Jean Dupont',
        email: 'jean@example.com',
        address: '123 Rue de Paris, 75001 Paris',
        phone: '+33123456789',
      });

    const foundCustomer = system
      .getCustomerService()
      .getCustomer(createdCustomer.id);
    expect(foundCustomer).toBeDefined();
    expect(foundCustomer?.email).toBe('jean@example.com');
    expect(foundCustomer?.name).toBe('Jean Dupont');
    expect(foundCustomer?.address).toBe(
      '123 Rue de Paris, 75001 Paris'
    );
    expect(foundCustomer?.phone).toBe('+33123456789');
  });

  // Test de création des produits
  it('Créer plusieurs produits', () => {
    const createdPizza = system.getProductService().createProduct({
      name: 'Margherita',
      description: 'Tomate, mozzarella, basilic',
      price: 12.5,
      category: 'main',
      available: true,
      preparationTimeMinutes: 20,
    });

    const createdSoda = system.getProductService().createProduct({
      name: 'Cola',
      description: 'Boisson gazeuse',
      price: 3.5,
      category: 'drink',
      available: true,
      preparationTimeMinutes: 1,
    });

    expect(createdPizza).toBeDefined();
    expect(createdSoda).toBeDefined();
    expect(createdPizza.name).toBe('Margherita');
    expect(createdSoda.name).toBe('Cola');
  });

  it('Processus de commande complet', () => {
    const orderItems = [
      { productId: pizza.id, quantity: 1 },
      { productId: soda.id, quantity: 2 },
    ];

    const result = system.processOrder(customer.id, orderItems);
    expect(result.order).not.toBeNull();
    expect(result.invoice).not.toBeNull();

    const order = result.order as IOrder;
    const invoice = result.invoice as IInvoice;

    expect(order.customerId).toBe(customer.id);
    expect(order.status).toBe('pending');
    expect(order.items.length).toBe(2);
    expect(order.totalAmount).toBeCloseTo(12.5 + 3.5 * 2);

    expect(invoice.orderId).toBe(order.id);
    expect(invoice.customerId).toBe(customer.id);
    expect(invoice.totalAmount).toBe(order.totalAmount);
    expect(invoice.tax).toBeCloseTo(order.totalAmount * 0.1);
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
    expect(updatedCustomer?.loyaltyPoints).toBe(1); // arrondi
  });

  it("Attribuer les points de fidélité lors d'une commande", () => {
    const result = system.processOrder(customer.id, [
      { productId: pizza.id, quantity: 2 },
    ]);
    const updated = system
      .getCustomerService()
      .getCustomer(customer.id);
    expect(updated?.loyaltyPoints).toBe(2); // 2x12.5 = 25 => 2 pts
  });

  it('Attribuer plusieurs points de fidélité pour une commande importante', () => {
    const result = system.processOrder(customer.id, [
      { productId: pizza.id, quantity: 4 }, // 12.5 * 4 = 50
    ]);
    const updated = system
      .getCustomerService()
      .getCustomer(customer.id);
    expect(updated?.loyaltyPoints).toBe(5); // 50€ => 5 points
  });

  it('Commande échoue si le produit est indisponible', () => {
    const unavailable = system.getProductService().createProduct({
      name: 'Burger',
      description: 'Boeuf & cheddar',
      price: 9,
      category: 'main',
      available: false,
      preparationTimeMinutes: 15,
    });

    const result = system.processOrder(customer.id, [
      { productId: unavailable.id, quantity: 1 },
    ]);
    expect(result.order).toBeNull();
    expect(result.invoice).toBeNull();
  });

  it('Produit rendu disponible permet une commande', () => {
    const burger = system.getProductService().createProduct({
      name: 'Burger',
      description: 'Boeuf & cheddar',
      price: 9,
      category: 'main',
      available: false,
      preparationTimeMinutes: 15,
    });

    // Le rendre disponible
    system
      .getProductService()
      .updateProductAvailability(burger.id, true);

    const result = system.processOrder(customer.id, [
      { productId: burger.id, quantity: 1 },
    ]);
    expect(result.order).not.toBeNull();
    expect(result.invoice).not.toBeNull();
  });

  it('Changer le statut de commande', () => {
    const result = system.processOrder(customer.id, [
      { productId: pizza.id, quantity: 1 },
    ]);
    const order = result.order as IOrder;

    const success1 = system
      .getOrderService()
      .updateOrderStatus(order.id, 'preparing');
    expect(success1).toBe(true);
    expect(system.getOrderService().getOrder(order.id)?.status).toBe(
      'preparing'
    );

    const success2 = system
      .getOrderService()
      .updateOrderStatus(order.id, 'ready');
    expect(success2).toBe(true);
    expect(system.getOrderService().getOrder(order.id)?.status).toBe(
      'ready'
    );

    const success3 = system
      .getOrderService()
      .updateOrderStatus(order.id, 'delivered');
    expect(success3).toBe(true);
    expect(system.getOrderService().getOrder(order.id)?.status).toBe(
      'delivered'
    );
  });

  it('Annulation autorisée uniquement si statut "pending"', () => {
    const result = system.processOrder(customer.id, [
      { productId: pizza.id, quantity: 1 },
    ]);
    const order = result.order as IOrder;

    // Annulation autorisée
    const cancelled = system.getOrderService().cancelOrder(order.id);
    expect(cancelled).toBe(true);

    // Nouvelle commande
    const second = system.processOrder(customer.id, [
      { productId: pizza.id, quantity: 1 },
    ]);
    const secondOrder = second.order as IOrder;

    // Changer statut
    system
      .getOrderService()
      .updateOrderStatus(secondOrder.id, 'preparing');

    // Tentative d’annulation
    const cancelFail = system
      .getOrderService()
      .cancelOrder(secondOrder.id);
    expect(cancelFail).toBe(false);
  });

  it('Calcul du montant et taxes corrects', () => {
    const result = system.processOrder(customer.id, [
      { productId: pizza.id, quantity: 2 }, // 25
      { productId: soda.id, quantity: 3 }, // 10.5
    ]);

    const order = result.order!;
    const invoice = result.invoice!;

    expect(order.totalAmount).toBeCloseTo(35.5);
    expect(invoice.totalAmount).toBeCloseTo(35.5);
    expect(invoice.tax).toBeCloseTo(3.55); // 10%
  });

  it('Commande avec client inexistant échoue', () => {
    const result = system.processOrder('invalid_id', [
      { productId: pizza.id, quantity: 1 },
    ]);
    expect(result.order).toBeNull();
    expect(result.invoice).toBeNull();
  });

  it('Payer une facture déjà payée échoue', () => {
    const result = system.processOrder(customer.id, [
      { productId: pizza.id, quantity: 1 },
    ]);
    const invoice = result.invoice!;

    const firstPay = system
      .getInvoiceService()
      .payInvoice(invoice.id, 'cash');
    expect(firstPay).toBe(true);

    const secondPay = system
      .getInvoiceService()
      .payInvoice(invoice.id, 'cash');
    expect(secondPay).toBe(false);
  });
});
