# Consignes

Votre mission est de créer des tests d'intégration pour vérifier que les différents services du système de commandes en ligne fonctionnent correctement ensemble. Vous utiliserez vitest comme framework de test.
Objectifs des tests d'intégration

- Tester l'interaction entre les différents services
- Vérifier que les flux de travail complets fonctionnent correctement (de la création d'un produit jusqu'à la facturation d'une commande)
- S'assurer que les données circulent correctement entre les services
- Détecter les éventuelles incohérences ou bugs dans les interactions

## Tests à réaliser

Créez un fichier restaurant-system.integration.test.ts qui testera les scénarios suivants :

### Processus de commande complet

- Création d'un client
- Création de plusieurs produits
- Création d'une commande
- Vérification de la facture générée
- Paiement de la facture

### Gestion des points de fidélité

- Vérifier que les points de fidélité sont correctement attribués lors d'une commande

### Disponibilité des produits

- Vérifier qu'une commande échoue si un produit n'est pas disponible
- Mettre à jour la disponibilité d'un produit et vérifier l'impact sur les commandes

### Changements de statut des commandes

- Créer une commande et modifier son statut à travers les différentes étapes
- Vérifier que l'annulation d'une commande n'est possible qu'au statut "pending"

### Calcul des montants et taxes

- Vérifier que les montants de la commande et de la facture sont cohérents
- Vérifier que les taxes sont calculées correctement

## Exemple pour vous aider à démarrer

Voici un exemple de test d'intégration pour le processus de commande complet :

```typescript
import {
  RestaurantSystem,
  IProduct,
  ICustomer,
  IOrder,
  IInvoice,
} from './restaurant-system';

describe('Restaurant System Integration Tests', () => {
  let system: RestaurantSystem;

  // Variables pour stocker les références aux objets créés
  let customer: ICustomer;
  let pizza: IProduct;
  let soda: IProduct;

  beforeEach(() => {
    // Initialiser un nouveau système pour chaque test
    system = new RestaurantSystem();

    // Créer un client
    customer = system.getCustomerService().createCustomer({
      name: 'Jean Dupont',
      email: 'jean@example.com',
      address: '123 Rue de Paris, 75001 Paris',
      phone: '+33123456789',
    });

    // Créer des produits
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

  test('Complete order process should work correctly', () => {
    // 1. Créer une commande
    const orderItems = [
      { productId: pizza.id, quantity: 1 },
      { productId: soda.id, quantity: 2 },
    ];

    const result = system.processOrder(customer.id, orderItems);

    // 2. Vérifier que la commande et la facture ont été créées
    expect(result.order).not.toBeNull();
    expect(result.invoice).not.toBeNull();

    const order = result.order as IOrder;
    const invoice = result.invoice as IInvoice;

    // 3. Vérifier les détails de la commande
    expect(order.customerId).toBe(customer.id);
    expect(order.status).toBe('pending');
    expect(order.items.length).toBe(2);
    expect(order.totalAmount).toBe(pizza.price + soda.price * 2);

    // 4. Vérifier les détails de la facture
    expect(invoice.orderId).toBe(order.id);
    expect(invoice.customerId).toBe(customer.id);
    expect(invoice.totalAmount).toBe(order.totalAmount);
    expect(invoice.tax).toBe(order.totalAmount * 0.1);
    expect(invoice.paid).toBe(false);

    // 5. Payer la facture
    const paymentResult = system
      .getInvoiceService()
      .payInvoice(invoice.id, 'credit_card');
    expect(paymentResult).toBe(true);

    // 6. Vérifier que la facture est maintenant payée
    const updatedInvoice = system
      .getInvoiceService()
      .getInvoice(invoice.id);
    expect(updatedInvoice?.paid).toBe(true);
    expect(updatedInvoice?.paymentMethod).toBe('credit_card');
    expect(updatedInvoice?.paidAt).toBeDefined();

    // 7. Vérifier que les points de fidélité ont été attribués
    const updatedCustomer = system
      .getCustomerService()
      .getCustomer(customer.id);
    expect(updatedCustomer?.loyaltyPoints).toBe(1); // 1 point pour 19.5€ (12.5 + 3.5 * 2)
  });

  // Ajoutez d'autres tests ici...
});
```

## Critères d'évaluation

Votre travail sera évalué sur les critères suivants :

- Vos choix de tests d'intégration (quels tests vous avez réalisé dans le temps qui était imparti, pour voir la manière dont vous priorisez)
- Pertinence des assertions (vérification des interactions critiques entre services)
- Organisation et lisibilité des tests
- Gestion des cas d'erreur et des cas limites
