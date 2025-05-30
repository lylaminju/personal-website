---
title: Handling concurrency issues in Kotlin + Spring Boot REST APIs
date: 2025-05-30
tags: Backend, Concurrency, REST APIs, Kotlin, Spring Boot, Spring Data JPA
---

# Handling concurrency issues in Kotlin + Spring Boot REST APIs

**Concurrency** issues occur when multiple threads or requests access and modify the same resource simultaneously, potentially leading to data corruption, race conditions, or inconsistent state.

## Common Concurrency Solutions

### Optimistic Locking
Uses version numbers to detect data changes before updates. Best for low-conflict scenarios.

**Pros:**
- High performance (no blocking)
- Good scalability

**Cons:**
- Must handle version mismatch exceptions
- Requires retry logic for failed operations

### Pessimistic Locking
Locks resources before access to prevent conflicts. Best for high-conflict scenarios.

**Pros:**
- Guarantees data consistency
- No version conflicts

**Cons:**
- Performance overhead
- Potential for deadlocks
- Reduced scalability

<details>
  <summary>Deadlock</summary>
  <p>
    - A deadlock is a situation where two or more processes are unable to continue because they are each waiting for the other to finish, creating a cycle of dependency.
    <br />
    - For example, Thread A locks Resource 1 and waits for Resource 2, while Thread B locks Resource 2 and waits for Resource 1.
    <br />
    - Proper resource allocation, lock ordering, and timeout strategies can help prevent deadlocks.
  </p>
</details>

### Other Approaches
- **Synchronized/Mutex**: Java/Kotlin synchronization primitives for memory-level concurrency
- **Atomic Classes**: For simple atomic operations (e.g., AtomicInteger)
- **Database Transactions + Isolation Levels**: Control concurrent access at the database level
- **Asynchronous Queues**: Process tasks sequentially to avoid conflicts

## 🔧 Kotlin + Spring Data JPA Examples

### 1. Optimistic Locking Implementation

**Entity with Version Control**
```kotlin
@Entity
class Product(
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  val id: Long = 0,

  var name: String,
  var stock: Int,

  @Version
  var version: Long? = null
)
```

**Repository**
```kotlin
interface ProductRepository : JpaRepository<Product, Long>
// Uses standard findById() - JPA handles version checking automatically
```

**Service with Retry**
```kotlin
@Service
class ProductService(private val productRepository: ProductRepository) {
    
  @Transactional
  @Retryable(value = [ObjectOptimisticLockingFailureException::class], maxAttempts = 3)
  fun purchaseProductOptimistic(productId: Long, quantity: Int): Product {
    val product = productRepository.findById(productId)
        .orElseThrow { RuntimeException("Product not found") }

    if (product.stock < quantity) throw RuntimeException("Not enough stock")
    
    product.stock -= quantity
    return productRepository.save(product) // JPA detects version mismatch
  }
}
```

### 2. Pessimistic Locking Implementation

**Repository with Locking**
```kotlin
interface ProductRepository : JpaRepository<Product, Long> {

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("SELECT p FROM Product p WHERE p.id = :id")
  fun findByIdWithLock(id: Long): Optional<Product>
}
```

**Service**
```kotlin
@Service
class ProductService(private val productRepository: ProductRepository) {

  @Transactional
  fun purchaseProductPessimistic(productId: Long, quantity: Int): Product {
    val product = productRepository.findByIdWithLock(productId)
        .orElseThrow { RuntimeException("Product not found") }

    if (product.stock < quantity) throw RuntimeException("Not enough stock")
    
    product.stock -= quantity
    return productRepository.save(product)
  }
}
```

### 3. Transaction Isolation Levels

```kotlin
// Example 1: Read-only report - need consistent snapshot
@Transactional(isolation = Isolation.REPEATABLE_READ, readOnly = true)
fun generateReport(productId: Long): Report {
  val product = productRepository.findById(productId)
  // Ensure data consistency during report generation
}

// Example 2: Real-time stock check - need latest data  
@Transactional(isolation = Isolation.READ_COMMITTED)
fun getCurrentStock(productId: Long): Int {
  return productRepository.findById(productId).stock
}
```

[Baeldung - Transaction Isolations](https://www.baeldung.com/spring-transactional-propagation-isolation#transactional-isolations)

## When to Use Each Approach

| Scenario | Recommended Approach | Reason |
|----------|---------------------|---------|
| Low conflict frequency | Optimistic Locking | Better performance, minimal blocking |
| High conflict frequency | Pessimistic Locking | Reduces retry overhead |
| Simple counters | Atomic Classes | Lightweight, lock-free |
| Complex workflows | Database Transactions | ACID guarantees |
| High-throughput systems | Asynchronous Queues | Eliminates contention |

## References

- [Spring Data JPA Documentation - Locking](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.locking)
- [Hibernate User Guide - Locking](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html#locking)
- [Baeldung - Optimistic Locking](https://www.baeldung.com/jpa-optimistic-locking)
- [Baeldung - Pessimistic Locking](https://www.baeldung.com/jpa-pessimistic-locking)
