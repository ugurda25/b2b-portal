# B2B Portal Projesi - Gemini Özeti

## 1. Proje Genel Bilgileri

- **Proje Adı:** B2B Portal (Uğur Giyim B2B Sipariş ve Stok Yönetim Portalı)
- **Teknoloji:** Spring Boot 4.1.0, Java 21, Maven
- **Veritabanı:** MSSQL (Docker localhost:1433)
- **Database:** B2B_Project_DB
- **Kullanılan Kütüphaneler:**
  - Spring Boot Starter Data JPA
  - Spring Boot Starter Web MVC
  - Spring Boot Starter Validation
  - Lombok
  - MSSQL JDBC Driver

## 2. Proje Paket Yapısı

```
com.ugurgiyim
├── B2bPortalApplication.java (Ana giriş noktası)
├── entity/ (Veritabanı tabloları)
│   ├── Product.java
│   ├── User.java
│   ├── Order.java
│   ├── OrderDetail.java
│   └── RecurringOrder.java
├── dto/ (Data Transfer Objects)
│   ├── DtoProduct.java / DtoProductIU.java
│   ├── DtoUser.java / DtoUserIU.java
│   ├── DtoOrder.java / DtoOrderIU.java
│   ├── DtoOrderDetail.java / DtoOrderDetailIU.java
│   └── DtoRecurringOrder.java / DtoRecurringOrderIU.java
├── repository/ (Veri erişim katmanı)
│   ├── ProductRepository.java
│   ├── UserRepository.java
│   ├── OrderRepository.java
│   ├── OrderDetailRepository.java
│   └── RecurringOrderRepository.java
├── service/ (İş mantığı katmanı)
│   ├── IProductService.java / impl/ProductServiceImpl.java
│   ├── IUserService.java / impl/UserServiceImpl.java
│   ├── IOrderService.java / impl/OrderServiceImpl.java
│   └── IRecurringOrderService.java / impl/RecurringOrderServiceImpl.java
├── controller/ (API endpoint'leri)
│   ├── IProductController.java / impl/ProductControllerImpl.java
│   ├── IUserController.java / impl/UserControllerImpl.java
│   ├── IOrderController.java / impl/OrderControllerImpl.java
│   └── IRecurringOrderController.java / impl/RecurringOrderControllerImpl.java
├── exception/
│   └── GlobalExceptionHandler.java
└── scheduler/
    └── RecurringOrderScheduler.java
```

## 3. Entity (Tablo) Yapısı

### 3.1 Product (Ürünler)
```java
@Entity
@Table(name = "Products")
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    @Column(name="Barcode", nullable=false, length=50, unique=true)
    private String barcode;
    
    @Column(name="Name", length=100, nullable=false)
    private String name;
    
    @Column(name="AvailableStock", nullable=false)
    private int availableStock;
    
    @Column(name="CostPrice", precision=18, scale=2, nullable=false)
    private BigDecimal costPrice;
    
    @Column(name="WholeSalePrice", precision=18, scale=2, nullable=false)
    private BigDecimal wholeSalePrice;
    
    @Column(name="MinOrderQuantity", nullable=false)
    private Integer minOrderQuantity = 1;
    
    @Column(name="IsActive", nullable=false)
    private Boolean isActive = true;
    
    @Column(name="currency", length=10)
    private String currency = "TRY";
}
```

### 3.2 User (Kullanıcılar/Bayiler)
```java
@Entity
@Table(name="Users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name="CompanyName", length=100, nullable=false)
    private String companyName;
    
    @Column(name="Role", nullable=false, length=20)
    private String role = "BAYI";
    
    @Column(name="CreditLimit", nullable=false, precision=18, scale=2)
    private BigDecimal creditLimit = BigDecimal.ZERO;
    
    @Column(name="CurrentBalance", nullable=false, precision=18, scale=2)
    private BigDecimal currentBalance = BigDecimal.ZERO;
    
    @Column(name="Username", length=50, nullable=false, unique=true)
    private String username;
    
    @Column(name="Password", length=255, nullable=false)
    private String password;
    
    @Column(name="IsActive", nullable=false)
    private Boolean isActive = true;
}
```

### 3.3 Order (Siparişler)
```java
@Entity
@Table(name = "Orders")
public class Order {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;
    
    @Column(name="OrderNumber", nullable=false, unique=true, length=50)
    private String orderNumber;
    
    @ManyToOne
    @JoinColumn(name="UserId", referencedColumnName="Id")
    private User user;
    
    @Column(name="OrderDate")
    private LocalDateTime orderDate;
    
    @Column(name="TotalAmount", precision=18, scale=2)
    private BigDecimal totalAmount;
    
    @Column(name="Status", length=50)
    private String status;
    
    @Column(name="IsAutomated", nullable=false)
    private Boolean isAutomated = false;
}
```

### 3.4 OrderDetail (Sipariş Detayları)
```java
@Entity
@Table(name = "OrderDetails")
public class OrderDetail {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name="OrderId", referencedColumnName="Id")
    private Order order;
    
    @ManyToOne
    @JoinColumn(name="ProductId", referencedColumnName="Id")
    private Product product;
    
    @Column(name="Quantity")
    private Integer quantity;
    
    @Column(name="UnitPrice", precision=18, scale=2)
    private BigDecimal unitPrice;
}
```

### 3.5 RecurringOrder (Otomatik Sipariş Talimatları)
```java
@Entity
@Table(name = "RecurringOrders")
public class RecurringOrder {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name="UserId", referencedColumnName="Id", nullable=false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name="ProductId", referencedColumnName="Id", nullable=false)
    private Product product;
    
    @Column(name="Quantity", nullable=false)
    private Integer quantity;
    
    @Column(name="PeriodInWeeks", nullable=false)
    private Integer periodInWeeks = 1;
    
    @Column(name="NextRunDate", nullable=false)
    private LocalDateTime nextRunDate;
    
    @Column(name="IsActive", nullable=false)
    private Boolean isActive = true;
}
```

## 4. DTO (Data Transfer Object) Yapısı

### 4.1 Ürün DTO'ları
```java
// DtoProduct (Response)
@Data
public class DtoProduct {
    @NotBlank private String barcode;
    @NotBlank private String name;
    @NotNull @Min(0) private Integer availableStock;
    @NotNull @DecimalMin("0.0") private BigDecimal costPrice;
    @NotNull @DecimalMin("0.0") private BigDecimal wholeSalePrice;
    private String currency = "TRY";
    @Min(1) private Integer minOrderQuantity = 1;
    private Boolean isActive = true;
}

// DtoProductIU (Request - Insert/Update)
@Data
public class DtoProductIU {
    @NotBlank private String barcode;
    @NotBlank private String name;
    @NotNull @Min(0) private Integer availableStock;
    @NotNull @DecimalMin("0.0") private BigDecimal costPrice;
    @NotNull @DecimalMin("0.0") private BigDecimal wholeSalePrice;
    private String currency = "TRY";
    @Min(1) private Integer minOrderQuantity = 1;
    private Boolean isActive = true;
}
```

### 4.2 Kullanıcı DTO'ları
```java
// DtoUser (Response)
@Data
public class DtoUser {
    private Integer id;
    private String companyName;
    private String role = "BAYI";
    private BigDecimal creditLimit;
    private BigDecimal currentBalance;
    private String username;
    private Boolean isActive = true;
}

// DtoUserIU (Request)
@Data
public class DtoUserIU {
    private Integer id;
    @NotBlank private String companyName;
    private String role = "BAYI";
    @NotNull @DecimalMin("0.0") private BigDecimal creditLimit;
    @NotNull @DecimalMin("0.0") private BigDecimal currentBalance;
    @NotBlank @Size(min=3, max=50) private String username;
    @NotBlank @Size(min=6) private String password;
    private Boolean isActive = true;
}
```

### 4.3 Sipariş DTO'ları
```java
// DtoOrder (Response)
@Data
public class DtoOrder {
    private Integer id;
    private String orderNumber;
    private DtoUser user;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private String status;
    private Boolean isAutomated;
    private List<DtoOrderDetail> orderDetails;
}

// DtoOrderIU (Request)
@Data
public class DtoOrderIU {
    @NotNull private Integer userId;
    private String orderNumber;
    @NotNull @DecimalMin("0.0") private BigDecimal totalAmount;
    private String status = "PENDING";
    private Boolean isAutomated = false;
    @NotEmpty @Valid private List<DtoOrderDetailIU> orderDetails;
}

// DtoOrderDetail (Response)
@Data
public class DtoOrderDetail {
    private Integer id;
    private DtoProduct product;
    private Integer quantity;
    private BigDecimal unitPrice;
}

// DtoOrderDetailIU (Request)
@Data
public class DtoOrderDetailIU {
    @NotNull private Integer productId;
    @NotNull @Min(1) private Integer quantity;
    @NotNull @DecimalMin("0.0") private BigDecimal unitPrice;
}
```

### 4.4 Otomatik Sipariş DTO'ları
```java
// DtoRecurringOrder (Response)
@Data
public class DtoRecurringOrder {
    private Integer id;
    private Integer userId;
    private Integer productId;
    private String productName;
    private Integer quantity;
    private Integer periodInWeeks;
    private LocalDateTime nextRunDate;
    private Boolean isActive;
}

// DtoRecurringOrderIU (Request)
@Data
public class DtoRecurringOrderIU {
    private Integer userId;
    private Integer productId;
    private Integer quantity;
    private Integer periodInWeeks;
}
```

## 5. Repository (Veri Erişim) Katmanı

```java
// ProductRepository
@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
}

// UserRepository
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
}

// OrderRepository
@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
}

// OrderDetailRepository
@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    List<OrderDetail> findByOrderId(Integer orderId);
}

// RecurringOrderRepository
@Repository
public interface RecurringOrderRepository extends JpaRepository<RecurringOrder, Integer> {
    List<RecurringOrder> findByIsActiveTrue();
    List<RecurringOrder> findByUserId(Integer userId);
}
```

## 6. Service (İş Mantığı) Katmanı

### 6.1 IProductService & ProductServiceImpl
```java
// Interface
public interface IProductService {
    DtoProduct saveProduct(DtoProductIU dtoProductIU);
    List<DtoProduct> getAllProducts();
    DtoProduct getProductById(int id);
    void deleteProduct(Integer id);
    DtoProduct updateProduct(Integer id, DtoProductIU dtoProductIU);
}

// Implementasyon
@Service
public class ProductServiceImpl implements IProductService {
    @Autowired
    private ProductRepository productRepository;

    @Override
    public DtoProduct saveProduct(DtoProductIU dtoProductIU) {
        Product product = new Product();
        BeanUtils.copyProperties(dtoProductIU, product);
        Product dbProduct = productRepository.save(product);
        DtoProduct response = new DtoProduct();
        BeanUtils.copyProperties(dbProduct, response);
        return response;
    }

    @Override
    public List<DtoProduct> getAllProducts() {
        List<DtoProduct> dtoList = new ArrayList<>();
        List<Product> productList = productRepository.findAll();
        for (Product product : productList) {
            DtoProduct dto = new DtoProduct();
            BeanUtils.copyProperties(product, dto);
            dtoList.add(dto);
        }
        return dtoList;
    }

    @Override
    public DtoProduct getProductById(int id) {
        Product dbProduct = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Hata." + id + " Numaralı aranan ürün bulunamadı!"));
        DtoProduct optionalDtoProduct = new DtoProduct();
        BeanUtils.copyProperties(dbProduct, optionalDtoProduct);
        return optionalDtoProduct;
    }

    @Override
    public void deleteProduct(Integer id) {
        Product dbProduct = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Hata: " + id + " Numaralı ürün bulunamadı!"));
        dbProduct.setIsActive(false);
        productRepository.save(dbProduct);
    }

    @Override
    public DtoProduct updateProduct(Integer id, DtoProductIU dtoProductIU) {
        DtoProduct response = new DtoProduct();
        Optional<Product> optional = productRepository.findById(id);
        if (optional.isPresent()) {
            Product dbProduct = optional.get();
            dbProduct.setBarcode(dtoProductIU.getBarcode());
            dbProduct.setName(dtoProductIU.getName());
            dbProduct.setAvailableStock(dtoProductIU.getAvailableStock());
            dbProduct.setCostPrice(dtoProductIU.getCostPrice());
            dbProduct.setWholeSalePrice(dtoProductIU.getWholeSalePrice());
            dbProduct.setCurrency(dtoProductIU.getCurrency());
            dbProduct.setMinOrderQuantity(dtoProductIU.getMinOrderQuantity());
            dbProduct.setIsActive(dtoProductIU.getIsActive());
            Product updatedProduct = productRepository.save(dbProduct);
            BeanUtils.copyProperties(updatedProduct, response);
            return response;
        }
        return null;
    }
}
```

### 6.2 IUserService & UserServiceImpl
```java
// Interface
public interface IUserService {
    DtoUser saveUser(DtoUserIU dtoUserIU);
    List<DtoUser> getAllUsers();
    DtoUser getUserById(Integer id);
    void deleteUser(Integer id);
    DtoUser updateUser(Integer id, DtoUserIU dtoUserIU);
}

// Implementasyon
@Service
public class UserServiceImpl implements IUserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public DtoUser saveUser(DtoUserIU dtoUserIU) {
        User user = new User();
        BeanUtils.copyProperties(dtoUserIU, user);
        User dbUser = userRepository.save(user);
        DtoUser response = new DtoUser();
        BeanUtils.copyProperties(dbUser, response);
        return response;
    }

    @Override
    public List<DtoUser> getAllUsers() {
        List<User> userList = userRepository.findAll();
        List<DtoUser> responseList = new ArrayList<>();
        for (User user : userList) {
            DtoUser responseUser = new DtoUser();
            BeanUtils.copyProperties(user, responseUser);
            responseList.add(responseUser);
        }
        return responseList;
    }

    @Override
    public DtoUser getUserById(Integer id) {
        User dbUser = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Hata: " + id + " numaralı aranan müşteri bulunamadı!"));
        DtoUser optionalDtoUser = new DtoUser();
        BeanUtils.copyProperties(dbUser, optionalDtoUser);
        return optionalDtoUser;
    }

    @Override
    public void deleteUser(Integer id) {
        User dbUser = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Hata: " + id + " Numaralı ürün bulunamadı!"));
        dbUser.setIsActive(false);
        userRepository.save(dbUser);
    }

    @Override
    public DtoUser updateUser(Integer id, DtoUserIU dtoUserIU) {
        DtoUser response = new DtoUser();
        Optional<User> optional = userRepository.findById(id);
        if (optional.isPresent()) {
            User dbUser = optional.get();
            dbUser.setUsername(dtoUserIU.getUsername());
            dbUser.setPassword(dtoUserIU.getPassword());
            dbUser.setCompanyName(dtoUserIU.getCompanyName());
            dbUser.setRole(dtoUserIU.getRole());
            dbUser.setCreditLimit(dtoUserIU.getCreditLimit());
            dbUser.setCurrentBalance(dtoUserIU.getCurrentBalance());
            dbUser.setIsActive(dtoUserIU.getIsActive());
            User updatedUser = userRepository.save(dbUser);
            BeanUtils.copyProperties(updatedUser, response);
            return response;
        }
        return null;
    }
}
```

### 6.3 IOrderService & OrderServiceImpl
```java
// Interface
public interface IOrderService {
    DtoOrder saveOrder(DtoOrderIU dtoOrderIU);
    List<DtoOrder> getAllOrders();
    DtoOrder getOrderById(Integer id);
    DtoOrder cancelOrder(Integer orderId);
    DtoOrder updateOrderStatus(Integer orderId, String newStatus);
}

// Implementasyon
@Service
public class OrderServiceImpl implements IOrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderDetailRepository orderDetailRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    @Override
    public DtoOrder saveOrder(DtoOrderIU dtoOrderIU) {
        User user = userRepository.findById(dtoOrderIU.getUserId())
            .orElseThrow(() -> new RuntimeException("Sipariş verilecek kullanıcı bulunamadı! ID: " + dtoOrderIU.getUserId()));

        if (user.getIsActive() != null && !user.getIsActive()) {
            throw new RuntimeException("Hesabınız pasif durumdadır. Sipariş oluşturamazsınız!");
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(dtoOrderIU.getStatus() != null ? dtoOrderIU.getStatus() : "PENDING");
        order.setTotalAmount(dtoOrderIU.getTotalAmount());
        order.setIsAutomated(dtoOrderIU.getIsAutomated() != null ? dtoOrderIU.getIsAutomated() : false);

        BigDecimal calculatedTotalAmount = BigDecimal.ZERO;
        List<OrderDetail> savedDetails = new ArrayList<>();
        
        for (DtoOrderDetailIU detailIU : dtoOrderIU.getOrderDetails()) {
            Product product = productRepository.findById(detailIU.getProductId())
                .orElseThrow(() -> new RuntimeException("Siparişteki ürün bulunamadı! ID: " + detailIU.getProductId()));

            if (product.getIsActive() != null && !product.getIsActive()) {
                throw new RuntimeException("Satışa kapalı ürün! '" + product.getName() + "' isimli ürün şu anda pasiftir ve sipariş verilemez.");
            }

            if (product.getAvailableStock() < detailIU.getQuantity()) {
                throw new RuntimeException("Yetersiz stok! '" + product.getName() + "' ürünü için mevcut stok: " + product.getAvailableStock() + ", istenen miktar: " + detailIU.getQuantity());
            }

            if (product.getMinOrderQuantity() != null && detailIU.getQuantity() < product.getMinOrderQuantity()) {
                throw new RuntimeException("Minimum sipariş adedinin altında! '" + product.getName() + "' ürünü için en az " + product.getMinOrderQuantity() + " adet sipariş vermelisiniz.");
            }

            product.setAvailableStock(product.getAvailableStock() - detailIU.getQuantity());
            productRepository.save(product);

            BigDecimal itemTotal = detailIU.getUnitPrice().multiply(BigDecimal.valueOf(detailIU.getQuantity()));
            calculatedTotalAmount = calculatedTotalAmount.add(itemTotal);

            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setProduct(product);
            orderDetail.setQuantity(detailIU.getQuantity());
            orderDetail.setUnitPrice(detailIU.getUnitPrice());
            savedDetails.add(orderDetail);
        }

        BigDecimal currentBalance = user.getCurrentBalance() != null ? user.getCurrentBalance() : BigDecimal.ZERO;
        BigDecimal creditLimit = user.getCreditLimit() != null ? user.getCreditLimit() : BigDecimal.ZERO;
        BigDecimal newBalance = currentBalance.add(calculatedTotalAmount);

        if (creditLimit.compareTo(BigDecimal.ZERO) > 0 && newBalance.compareTo(creditLimit) > 0) {
            throw new RuntimeException("Kredi limiti yetersiz! Mevcut Bakiyeniz: " + currentBalance + " TL, Sipariş Tutarı: " + calculatedTotalAmount + " TL, Toplam Kredi Limitiniz: " + creditLimit + " TL");
        }

        user.setCurrentBalance(newBalance);
        userRepository.save(user);

        order.setTotalAmount(calculatedTotalAmount);
        Order savedOrder = orderRepository.save(order);

        for (OrderDetail detail : savedDetails) {
            detail.setOrder(savedOrder);
            orderDetailRepository.save(detail);
        }
        return convertToDtoOrder(savedOrder, savedDetails);
    }

    private DtoOrder convertToDtoOrder(Order order, List<OrderDetail> details) {
        DtoOrder dtoOrder = new DtoOrder();
        BeanUtils.copyProperties(order, dtoOrder);
        if (order.getUser() != null) {
            DtoUser dtoUser = new DtoUser();
            BeanUtils.copyProperties(order.getUser(), dtoUser);
            dtoOrder.setUser(dtoUser);
        }
        if (details == null) {
            details = orderDetailRepository.findByOrderId(order.getId());
        }
        List<DtoOrderDetail> dtoList = new ArrayList<>();
        if (details != null) {
            for (OrderDetail detail : details) {
                dtoList.add(mapToDtoOrderDetail(detail));
            }
        }
        dtoOrder.setOrderDetails(dtoList);
        return dtoOrder;
    }

    private DtoOrderDetail mapToDtoOrderDetail(OrderDetail detail) {
        DtoOrderDetail dto = new DtoOrderDetail();
        dto.setId(detail.getId());
        dto.setQuantity(detail.getQuantity());
        dto.setUnitPrice(detail.getUnitPrice());
        if (detail.getProduct() != null) {
            DtoProduct dtoProduct = new DtoProduct();
            BeanUtils.copyProperties(detail.getProduct(), dtoProduct);
            dto.setProduct(dtoProduct);
        }
        return dto;
    }

    @Override
    public List<DtoOrder> getAllOrders() {
        List<Order> orderList = orderRepository.findAll();
        List<DtoOrder> dtoList = new ArrayList<>();
        for (Order order : orderList) {
            dtoList.add(convertToDtoOrder(order, null));
        }
        return dtoList;
    }

    @Override
    public DtoOrder getOrderById(Integer id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Sipariş bulunamadı! ID: " + id));
        return convertToDtoOrder(order, null);
    }

    @Transactional
    @Override
    public DtoOrder cancelOrder(Integer orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("İptal edilecek sipariş bulunamadı! ID: " + orderId));
        if ("CANCELED".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Bu sipariş zaten daha önce iptal edilmiş!");
        }
        order.setStatus("CANCELED");
        
        User user = order.getUser();
        if (user != null && order.getTotalAmount() != null) {
            BigDecimal currentBalance = user.getCurrentBalance() != null ? user.getCurrentBalance() : BigDecimal.ZERO;
            BigDecimal newBalance = currentBalance.subtract(order.getTotalAmount());
            if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
                newBalance = BigDecimal.ZERO;
            }
            user.setCurrentBalance(newBalance);
            userRepository.save(user);
        }
        
        List<OrderDetail> details = orderDetailRepository.findByOrderId(orderId);
        if (details != null) {
            for (OrderDetail detail : details) {
                Product product = detail.getProduct();
                if (product != null) {
                    product.setAvailableStock(product.getAvailableStock() + detail.getQuantity());
                    productRepository.save(product);
                }
            }
        }
        Order updatedOrder = orderRepository.save(order);
        return convertToDtoOrder(updatedOrder, details);
    }

    @Override
    public DtoOrder updateOrderStatus(Integer orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Sipariş bulunamadı! ID: " + orderId));
        if ("CANCELED".equalsIgnoreCase(newStatus)) {
            return cancelOrder(orderId);
        }
        order.setStatus(newStatus.toUpperCase());
        Order updatedOrder = orderRepository.save(order);
        return convertToDtoOrder(updatedOrder, null);
    }
}
```

### 6.4 IRecurringOrderService & RecurringOrderServiceImpl
```java
// Interface
public interface IRecurringOrderService {
    void runRecurringOrderRobot();
    DtoRecurringOrder createRecurringOrder(DtoRecurringOrderIU dtoRec);
    List<DtoRecurringOrder> getOrdersByUserId(Integer userId);
    void cancelRecurringOrder(Integer id);
}

// Implementasyon
@Service
public class RecurringOrderServiceImpl implements IRecurringOrderService {
    @Autowired
    private RecurringOrderScheduler recurringOrderScheduler;
    @Autowired
    private RecurringOrderRepository recurringOrderRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    @Override
    public void runRecurringOrderRobot() {
        recurringOrderScheduler.processRecurringOrders();
    }

    @Override
    public DtoRecurringOrder createRecurringOrder(DtoRecurringOrderIU dtoRec) {
        User user = userRepository.findById(dtoRec.getUserId())
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı! ID: " + dtoRec.getUserId()));
        Product product = productRepository.findById(dtoRec.getProductId())
            .orElseThrow(() -> new RuntimeException("Ürün bulunamadı! ID: " + dtoRec.getProductId()));
        
        RecurringOrder recurringOrder = new RecurringOrder();
        recurringOrder.setUser(user);
        recurringOrder.setProduct(product);
        recurringOrder.setQuantity(dtoRec.getQuantity());
        recurringOrder.setPeriodInWeeks(dtoRec.getPeriodInWeeks() != null ? dtoRec.getPeriodInWeeks() : 1);
        recurringOrder.setNextRunDate(LocalDateTime.now());
        recurringOrder.setIsActive(true);

        RecurringOrder saved = recurringOrderRepository.save(recurringOrder);
        return convertToDto(saved);
    }

    @Override
    public List<DtoRecurringOrder> getOrdersByUserId(Integer userId) {
        List<RecurringOrder> list = recurringOrderRepository.findByUserId(userId);
        List<DtoRecurringOrder> dtoList = new ArrayList<>();
        for (RecurringOrder item : list) {
            dtoList.add(convertToDto(item));
        }
        return dtoList;
    }

    @Override
    public void cancelRecurringOrder(Integer id) {
        RecurringOrder order = recurringOrderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Talimat bulunamadı! ID: " + id));
        order.setIsActive(false);
        recurringOrderRepository.save(order);
    }

    private DtoRecurringOrder convertToDto(RecurringOrder entity) {
        DtoRecurringOrder dto = new DtoRecurringOrder();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUser().getId());
        dto.setProductId(entity.getProduct().getId());
        dto.setProductName(entity.getProduct().getName());
        dto.setQuantity(entity.getQuantity());
        dto.setPeriodInWeeks(entity.getPeriodInWeeks());
        dto.setNextRunDate(entity.getNextRunDate());
        dto.setIsActive(entity.getIsActive());
        return dto;
    }
}
```

## 7. Controller (API Endpoint) Katmanı

### 7.1 Product Controller
```java
@RestController
@RequestMapping("/api/products")
public class ProductControllerImpl implements IProductController {
    @Autowired
    private IProductService productService;

    @PostMapping("/save")
    public DtoProduct saveProduct(@Valid @RequestBody DtoProductIU dtoProductIU) {
        return productService.saveProduct(dtoProductIU);
    }

    @GetMapping("/list")
    public List<DtoProduct> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/list/{id}")
    public DtoProduct getProductById(@PathVariable Integer id) {
        return productService.getProductById(id);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
    }

    @PutMapping("/update/{id}")
    public DtoProduct updateProduct(@PathVariable Integer id, @Valid @RequestBody DtoProductIU dtoProductIU) {
        return productService.updateProduct(id, dtoProductIU);
    }
}
```

### 7.2 User Controller
```java
@RestController
@RequestMapping("/api/Users")
public class UserControllerImpl implements IUserController {
    @Autowired
    private IUserService userService;

    @PostMapping("/save")
    public DtoUser saveUser(@Valid @RequestBody DtoUserIU dtoUserIU) {
        return userService.saveUser(dtoUserIU);
    }

    @GetMapping("/list")
    public List<DtoUser> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/list/{id}")
    public DtoUser getUserById(@PathVariable Integer id) {
        return userService.getUserById(id);
    }

    @PutMapping("/update/{id}")
    public DtoUser updateUser(@PathVariable Integer id, @Valid @RequestBody DtoUserIU dtoUserIU) {
        return userService.updateUser(id, dtoUserIU);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
    }
}
```

### 7.3 Order Controller
```java
@RestController
@RequestMapping("/api/Orders")
public class OrderControllerImpl implements IOrderController {
    @Autowired
    private IOrderService orderService;

    @PostMapping("/save")
    public DtoOrder saveOrder(@RequestBody @Valid DtoOrderIU dtoOrderIU) {
        return orderService.saveOrder(dtoOrderIU);
    }

    @GetMapping("/list")
    public List<DtoOrder> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/list/{id}")
    public DtoOrder getOrderById(@PathVariable Integer id) {
        return orderService.getOrderById(id);
    }

    @PutMapping("/cancel/{id}")
    public DtoOrder cancelOrder(@PathVariable Integer id) {
        return orderService.cancelOrder(id);
    }

    @PutMapping("/update-status/{id}")
    public DtoOrder updateOrderStatus(@PathVariable Integer id, @RequestParam String status) {
        return orderService.updateOrderStatus(id, status);
    }
}
```

### 7.4 RecurringOrder Controller
```java
@RestController
@RequestMapping("/api/recurring-orders")
public class RecurringOrderControllerImpl implements IRecurringOrderController {
    @Autowired
    private IRecurringOrderService recurringOrderService;

    @PostMapping("/run-robot")
    public String runRobot() {
        recurringOrderService.runRecurringOrderRobot();
        return "Otomatik sipariş robotu başarıyla tetiklendi!";
    }

    @PostMapping("/save")
    public DtoRecurringOrder createRecurringOrder(@RequestBody DtoRecurringOrderIU dtoRec) {
        return recurringOrderService.createRecurringOrder(dtoRec);
    }

    @GetMapping("/user/{userId}")
    public List<DtoRecurringOrder> getOrdersByUserId(@PathVariable Integer userId) {
        return recurringOrderService.getOrdersByUserId(userId);
    }

    @PutMapping("/cancel/{id}")
    public String cancelRecurringOrder(@PathVariable Integer id) {
        recurringOrderService.cancelRecurringOrder(id);
        return "Otomatik sipariş talimatı başarıyla pasife alındı.";
    }
}
```

## 8. Exception Handling (Hata Yönetimi)

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<String>> handleValidationException(MethodArgumentNotValidException ex) {
        List<String> errorMessages = new ArrayList<>();
        for (ObjectError error : ex.getBindingResult().getAllErrors()) {
            errorMessages.add(error.getDefaultMessage());
        }
        return new ResponseEntity<>(errorMessages, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<List<String>> handleRuntimeException(RuntimeException ex) {
        List<String> errorMessages = new ArrayList<>();
        errorMessages.add(ex.getMessage());
        return new ResponseEntity<>(errorMessages, HttpStatus.BAD_REQUEST);
    }
}
```

## 9. Scheduler (Otomatik Sipariş Robotu)

```java
@Component
@Slf4j
public class RecurringOrderScheduler {
    @Autowired
    private RecurringOrderRepository recurringOrderRepository;
    @Autowired
    private IOrderService orderService;

    @Scheduled(cron = "0 0 0 ? * MON") // Her Pazartesi gece yarısı
    @Transactional
    public void processRecurringOrders() {
        log.info("Otomatik Sipariş Talimatları Taranıyor...");
        List<RecurringOrder> activeOrders = recurringOrderRepository.findByIsActiveTrue();
        if (activeOrders.isEmpty()) {
            log.info("Aktif otomatik sipariş talimatı bulunamadı.");
            return;
        }
        for (RecurringOrder recurring : activeOrders) {
            try {
                BigDecimal unitPrice = recurring.getProduct().getCostPrice();
                BigDecimal totalAmount = unitPrice.multiply(BigDecimal.valueOf(recurring.getQuantity()));
                
                DtoOrderIU dtoOrderIU = new DtoOrderIU();
                dtoOrderIU.setUserId(recurring.getUser().getId());
                dtoOrderIU.setStatus("PENDING");
                dtoOrderIU.setIsAutomated(true);
                dtoOrderIU.setTotalAmount(totalAmount);
                
                List<DtoOrderDetailIU> details = new ArrayList<>();
                DtoOrderDetailIU detailIU = new DtoOrderDetailIU();
                detailIU.setProductId(recurring.getProduct().getId());
                detailIU.setQuantity(recurring.getQuantity());
                detailIU.setUnitPrice(unitPrice);
                details.add(detailIU);
                
                dtoOrderIU.setOrderDetails(details);
                orderService.saveOrder(dtoOrderIU);
                
                log.info("Otomatik sipariş başarıyla oluşturuldu! Kullanıcı ID: {} - Ürün ID: {}", 
                    recurring.getUser().getId(), recurring.getProduct().getId());
            } catch (Exception e) {
                log.error("Otomatik sipariş verilirken hata oluştu. Kullanıcı ID: {} - Hata: {}", 
                    recurring.getUser().getId(), e.getMessage());
            }
        }
    }
}
```

## 10. API Endpoint'leri Özeti

### Ürünler (Products)
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/products/save` | Yeni ürün ekle |
| GET | `/api/products/list` | Tüm ürünleri listele |
| GET | `/api/products/list/{id}` | ID ile ürün getir |
| PUT | `/api/products/update/{id}` | Ürün güncelle |
| DELETE | `/api/products/delete/{id}` | Ürün pasifleştir (soft delete) |

### Kullanıcılar (Users)
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/Users/save` | Yeni kullanıcı/bayi ekle |
| GET | `/api/Users/list` | Tüm kullanıcıları listele |
| GET | `/api/Users/list/{id}` | ID ile kullanıcı getir |
| PUT | `/api/Users/update/{id}` | Kullanıcı güncelle |
| DELETE | `/api/Users/delete/{id}` | Kullanıcı pasifleştir (soft delete) |

### Siparişler (Orders)
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/Orders/save` | Yeni sipariş oluştur |
| GET | `/api/Orders/list` | Tüm siparişleri listele |
| GET | `/api/Orders/list/{id}` | ID ile sipariş getir |
| PUT | `/api/Orders/cancel/{id}` | Siparişi iptal et |
| PUT | `/api/Orders/update-status/{id}` | Sipariş durumunu güncelle |

### Otomatik Sipariş Talimatları (Recurring Orders)
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/recurring-orders/run-robot` | Robotu manuel tetikle |
| POST | `/api/recurring-orders/save` | Yeni otomatik sipariş talimatı oluştur |
| GET | `/api/recurring-orders/user/{userId}` | Kullanıcının talimatlarını listele |
| PUT | `/api/recurring-orders/cancel/{id}` | Talimatı pasifleştir |

## 11. İş Kuralları (Business Rules)

### Sipariş Oluşturma Kuralları:
1. Kullanıcı aktif olmalı (isActive = true)
2. Ürün aktif olmalı (isActive = true)
3. Stok yeterli olmalı (availableStock >= quantity)
4. Minimum sipariş miktarına uyulmalı (quantity >= minOrderQuantity)
5. Kredi limiti yetersizse sipariş oluşturulamaz
6. Sipariş numarası otomatik oluşturulur: "ORD-XXXXXXXX"
7. Sipariş onaylandığında stok azaltılır
8. Sipariş toplam tutarı otomatik hesaplanır

### Sipariş İptal Kuralları:
1. Sipariş zaten iptal edilmişse hata fırlatır
2. İptal edildiğinde stok geri eklenir
3. Kullanıcı bakiyesinden sipariş tutarı düşülür

### Otomatik Sipariş Robotu:
1. Her Pazartesi gece yarısı çalışır (cron: "0 0 0 ? * MON")
2. Aktif tüm RecurringOrder'ları tarar
3. Her talimat için otomatik sipariş oluşturur
4. Hata oluşursa loglama yapar ve diğer talimata geçer

## 12. application.properties

```properties
spring.application.name=b2b-portal
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=B2B_Project_DB;encrypt=true;trustServerCertificate=true;
spring.datasource.username=${DB_USERNAME:sa}
spring.datasource.password=${DB_PASSWORD:}
spring.datasource.driverClassName=com.microsoft.sqlserver.jdbc.SQLServerDriver
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
server.error.include-message=always
```

## 13. Mevcut Eksikler / Geliştirme Alanları

1. **Security yok:** JWT, OAuth2 veya herhangi bir güvenlik mekanizması eklenmemiş
2. **Password şifrelenmemiş:** Düz metin olarak saklanıyor (BCrypt eklenmeli)
3. **Logging yetersiz:** Sadece scheduler'da log var, diğer katmanlarda yok
4. **Test yok:** Unit test veya integration test yazılmamış
5. **API Dokümantasyonu yok:** Swagger/OpenAPI eklenmemiş
6. **Pagination yok:** Tüm listeleme endpoint'lerinde pagination eklenmeli
7. **Filtering/Sorting yok:** Ürün ve siparişlerde filtreleme yapılmalı
8. **File Upload yok:** Ürün resmi yükleme özelliği yok
9. **Email/SMS Bildirim yok:** Sipariş onay/iptal bildirimi yok
10. **Rate Limiting yok:** API'lerde hız sınırlaması yok
11. **CORS ayarları eksik:** Frontend entegrasyonu için CORS yapılandırması gerekli
12. **RecurringOrder'da periodInWeeks kontrolü yok:** Scheduler'da period kontrolü yapılmıyor, sadece isActive kontrol ediliyor
13. **Sipariş durumu enum değil:** String olarak tutuluyor, enum lebih güvenli olur
14. **Soft delete tutarlı değil:** User ve Product'ta soft delete var, Order'da yok

---

**Not:** Bu dosya projenin mevcut durumunu Gemini'ye aktarmak için hazırlanmıştır. Gemini'den eksikleri tamamlaması veya yeni özellikler eklemesi istenebilir.
