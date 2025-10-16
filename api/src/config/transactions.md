# Database Transactions Guide

## Basic Transaction Usage

The `postgres` library provides transaction support via `pgsql.begin()`:

```typescript
await pgsql.begin(async (sql) => {
  // All queries within this block are in a transaction
  await sql`INSERT ...`;
  await sql`UPDATE ...`;
  // Automatically commits on success, rolls back on error
});
```

## Key Benefits

1. **Atomicity**: All operations succeed or all fail together
2. **Isolation**: Prevents race conditions from concurrent requests
3. **Consistency**: Maintains data integrity constraints
4. **Durability**: Once committed, changes are permanent

## Row-Level Locking

Use `FOR UPDATE` to lock specific rows and prevent concurrent modifications:

```typescript
// Lock the product row until transaction completes
const [product] = await sql`
  SELECT * FROM products 
  WHERE id = ${productId}
  FOR UPDATE  -- Blocks other transactions from modifying this row
`;
```

### Lock Types

- `FOR UPDATE` - Exclusive lock, blocks reads and writes
- `FOR SHARE` - Shared lock, allows reads but blocks writes
- `FOR UPDATE NOWAIT` - Returns error immediately if row is locked
- `FOR UPDATE SKIP LOCKED` - Skips locked rows (useful for queues)

## Isolation Levels

PostgreSQL supports different isolation levels via `pgsql.begin()` options:

```typescript
// Default: Read Committed
await pgsql.begin(async (sql) => {
  // Each query sees committed data at query start
});

// Serializable: Strongest isolation
await pgsql.begin("serializable", async (sql) => {
  // Transactions appear to run sequentially
  // May throw serialization errors on conflicts
});

// Repeatable Read: Consistent snapshot
await pgsql.begin("repeatable read", async (sql) => {
  // All queries see same data snapshot from transaction start
});

// Read Uncommitted: Weakest isolation (not recommended)
await pgsql.begin("read uncommitted", async (sql) => {
  // Can see uncommitted changes from other transactions
});
```

## Example: Preventing Double Booking

```typescript
export const bookProduct = async (productId: number) => {
  return await pgsql.begin(async (sql) => {
    // Lock and check availability
    const [product] = await sql`
      SELECT * FROM products 
      WHERE id = ${productId} 
      AND NOT EXISTS (
        SELECT 1 FROM package_products WHERE product_id = ${productId}
      )
      FOR UPDATE  -- Critical: prevents race condition
    `;

    if (!product) {
      throw new Error("Product not available");
    }

    // Create booking
    const [booking] = await sql`
      INSERT INTO package_products (package_id, product_id, quantity)
      VALUES (${packageId}, ${productId}, 1)
      RETURNING *
    `;

    return booking;
  });
};
```

## Error Handling

Transactions automatically rollback on errors:

```typescript
try {
  await pgsql.begin(async (sql) => {
    await sql`INSERT ...`;
    throw new Error("Oops!"); // Triggers rollback
    await sql`UPDATE ...`; // Never executed
  });
} catch (error) {
  // Transaction was rolled back
  console.error("Transaction failed:", error);
}
```

## Best Practices

1. **Keep transactions short** - Long transactions hold locks
2. **Use appropriate isolation levels** - Default (Read Committed) is usually fine
3. **Lock only what you need** - Use `FOR UPDATE` on specific rows
4. **Handle serialization errors** - Retry logic for concurrent conflicts
5. **Don't do I/O in transactions** - No API calls, file operations, etc.

## Common Patterns

### Check-Then-Act (needs transaction)

```typescript
// ❌ BAD: Race condition possible
const product = await getProduct(id);
if (product.available) {
  await bookProduct(id); // Another request might book between these!
}

// ✅ GOOD: Atomic check-and-book
await pgsql.begin(async (sql) => {
  const [product] = await sql`
    SELECT * FROM products WHERE id = ${id} FOR UPDATE
  `;
  if (product.available) {
    await sql`INSERT INTO bookings ...`;
  }
});
```

### Batch Operations

```typescript
await pgsql.begin(async (sql) => {
  for (const item of items) {
    await sql`INSERT INTO orders (item_id) VALUES (${item.id})`;
  }
  // All or nothing
});
```

### Updating Related Records

```typescript
await pgsql.begin(async (sql) => {
  await sql`UPDATE packages SET status = 'shipped'`;
  await sql`INSERT INTO shipment_history ...`;
  await sql`UPDATE inventory SET quantity = quantity - 1`;
  // All updates happen atomically
});
```
