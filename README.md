# Firebase Relationship
[![NPM version][npm-image]][npm-url]
[![Donate](https://img.shields.io/badge/Donate-Patreon-green.svg)](https://www.patreon.com/invertase)

A promise based helper to manage relationships in your Firebase Realtime Database.

## Usage

```bash
npm install firebase-relationship --save
```

```javascript
import Firebase from 'firebase';
import Relationship from 'firebase-relationship';

// Create a new Firebase & Relationship instance
const firebase = Firebase.initializeApp({...});
const relationship = new Relationship('category_product');

// Create a new relationship between a category (id: 123) and a product (id: abc)
relationship.join(firebase, 123, 'abc');

// Remove the relationship
relationship.remove(firebase, 123, 'abc');
```

## API

### - constructor(name, path)
Creates and returns a new relationship.

- **[name]** Relationship name. Must include only one underscore.
- **[path]** Firebase path to store relationships. Defaults to 'relationship'. Must not contain leading or trailing forward slashes.


### - join(instance, leftId, rightId, value?) : Promise

Creates a two way relationship between two IDs. The 4th param is an optional value to store with the relationship (defaults to true).


### - remove(instance, leftId, rightId) : Promise

Removes a two way relationship between two IDs.


## Magic Methods

When a new relationship instance is created, four magic methods are available for easy relationship querying. For example, with a "category_product" relationship:

```javascript
// Get products for a category
relationship.getCategoryProducts(firebase, categoryId).then((snapshot) => {
  console.log('Products', snapshot.val());
});

// Get product categories
relationship.getProductCategories(firebase, productId).then((snapshot) => {
  console.log('Categories', snapshot.val());
});

// you can also get the internal refs for a join
const refA = relationship.getCategoryProductsRef;
const refB = relationship.getProductCategoriesRef;
// ... do a custom query ?
```

> Each relationship name is pluralized.

[npm-image]: https://img.shields.io/npm/v/firebase-relationship.svg?style=flat-square
[npm-url]: https://npmjs.org/package/firebase-relationship
