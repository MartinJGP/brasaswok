package com.brasaswok.config;

import com.brasaswok.model.Category;
import com.brasaswok.model.Order;
import com.brasaswok.model.OrderItem;
import com.brasaswok.model.OrderStatus;
import com.brasaswok.model.OrderStatusLog;
import com.brasaswok.model.Payment;
import com.brasaswok.model.PaymentMethod;
import com.brasaswok.model.PaymentStatus;
import com.brasaswok.model.Product;
import com.brasaswok.model.Role;
import com.brasaswok.model.User;
import com.brasaswok.repository.CategoryRepository;
import com.brasaswok.repository.OrderRepository;
import com.brasaswok.repository.ProductRepository;
import com.brasaswok.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           OrderRepository orderRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        User admin = userRepository.findByUsername("admin").orElseGet(() -> {
            User u = new User(
                    "admin",
                    "admin@brasaswok.pe",
                    passwordEncoder.encode("admin123"),
                    "Administrador Brasas & Wok",
                    "987654321",
                    "Av. Javier Prado Este 1234, San Borja",
                    Role.ROLE_ADMIN
            );
            u.setIsActive(true);
            return userRepository.save(u);
        });

        User customer = userRepository.findByUsername("cliente").orElseGet(() -> {
            User u = new User(
                    "cliente",
                    "cliente@gmail.com",
                    passwordEncoder.encode("cliente123"),
                    "Cliente de Prueba",
                    "991234567",
                    "Calle Los Pinos 432, San Isidro",
                    Role.ROLE_CUSTOMER
            );
            u.setIsActive(true);
            return userRepository.save(u);
        });

        if (categoryRepository.count() == 0) {
            Category catBrasas = new Category("Brasas & Pollos", "brasas-pollos", "Especialidades al carbón y leña", "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80", 1, true);
            Category catWok = new Category("Wok & Salteados", "wok-salteados", "Salteados criollo-orientales a 300°C", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80", 2, true);
            Category catChaufas = new Category("Chaufas & Aeropuertos", "chaufas-aeropuertos", "Fusión de arroz y fideos al wok", "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80", 3, true);
            Category catEntradas = new Category("Entradas & Piques", "entradas-piques", "Wantanes y tequeños artesanales", "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80", 4, true);
            Category catBebidas = new Category("Bebidas", "bebidas", "Chicha natural y bebidas heladas", "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80", 5, true);

            categoryRepository.saveAll(List.of(catBrasas, catWok, catChaufas, catEntradas, catBebidas));
        }

        if (productRepository.count() == 0) {
            Category catBrasas = categoryRepository.findBySlug("brasas-pollos").orElseThrow();
            Category catWok = categoryRepository.findBySlug("wok-salteados").orElseThrow();
            Category catChaufas = categoryRepository.findBySlug("chaufas-aeropuertos").orElseThrow();
            Category catEntradas = categoryRepository.findBySlug("entradas-piques").orElseThrow();
            Category catBebidas = categoryRepository.findBySlug("bebidas").orElseThrow();

            List<Product> initialProducts = List.of(
                    new Product(catBrasas, "1 Pollo a la Brasa Tradicional", "1-pollo-a-la-brasa-tradicional", "1 Pollo entero a la brasa marinado 24h al carbón y leña + papas fritas familiares crocantes + ensalada clásica fresca + cremas artesanales de la casa.", new BigDecimal("74.90"), "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80", true),
                    new Product(catBrasas, "1/2 Pollo a la Brasa", "1-2-pollo-a-la-brasa", "Medio pollo a la brasa jugoso con piel dorada crocante + papas fritas medianas + ensalada personal fresca + surtido de cremas de la casa.", new BigDecimal("42.90"), "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80", true),
                    new Product(catBrasas, "1/4 Pollo a la Brasa Clásico", "1-4-pollo-a-la-brasa-clasico", "Un cuarto de pollo a la brasa (pierna o pecho a elección) + papas fritas doradas + ensalada fresca clásica + cremas de ají y vinagreta.", new BigDecimal("24.90"), "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80", true),
                    new Product(catWok, "Lomo Saltado al Wok Criollo", "lomo-saltado-al-wok-criollo", "Trozos de lomo fino salteados al fuego vivo con cebolla roja, tomate en gajos, ají amarillo y cilantro fresco, servido con papas fritas y arroz con choclo.", new BigDecimal("39.90"), "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80", true),
                    new Product(catWok, "Tallarín Saltado Criollo de Carne", "tallarin-saltado-criollo-de-carne", "Tallarines gruesos salteados a fuego intenso con lomo de res, cebolla morada crujiente, tomate en gajos y cebollita china con toque de salsa de soya.", new BigDecimal("36.90"), "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80", true),
                    new Product(catChaufas, "Arroz Chaufa Especial de Chancho Asado", "arroz-chaufa-especial-de-chancho-asado", "Arroz frito al wok con chancho asado oriental caramelizado, tortilla de huevo, pimiento y cebollita china aromatizado con aceite de ajonjolí tostado.", new BigDecimal("32.90"), "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80", true),
                    new Product(catChaufas, "Aeropuerto Fusión Brasas & Wok", "aeropuerto-fusion-brasas-wok", "Combinación estelar de arroz chaufa y fideo wantán salteados al wok con trozos de pollo a la brasa deshilachado y frejolito chino crujiente.", new BigDecimal("35.90"), "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80", true),
                    new Product(catEntradas, "Wantán Frito Especial (12 und)", "wantan-frito-especial-12-und", "Docena de wantanes crocantes dorados en su punto, rellenos de pulpa de pollo y langostinos, servidos con salsa de tamarindo artesanal agridulce.", new BigDecimal("18.00"), "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80", true),
                    new Product(catEntradas, "Tequeños Wok de Pollo a la Brasa (8 und)", "tequenos-wok-de-pollo-a-la-brasa-8-und", "Ocho tequeños crujientes rellenos con tierno pollo a la brasa deshilachado y queso mantecoso fundido, servidos con crema de palta y salsa tártara.", new BigDecimal("21.00"), "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&w=800&q=80", true),
                    new Product(catBebidas, "Chicha Morada Artesanal 1L", "chicha-morada-artesanal-1l", "Elaborada diariamente con maíz morado culli, cáscara de piña madura, membrillo, manzana, canela de Chanchamayo y clavo de olor. 100% natural y helada.", new BigDecimal("12.00"), "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80", true),
                    new Product(catBebidas, "Inka Kola 1.5L", "inka-kola-1-5l", "Botella de 1.5L helada, la bebida de sabor nacional perfecta para acompañar tu pollo a la brasa o salteado al wok.", new BigDecimal("10.00"), "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80", true)
            );
            productRepository.saveAll(initialProducts);
        }

        if (orderRepository.count() == 0) {
            Product pollo = productRepository.findBySlug("1-pollo-a-la-brasa-tradicional").orElse(null);
            Product lomo = productRepository.findBySlug("lomo-saltado-al-wok-criollo").orElse(null);
            Product chaufa = productRepository.findBySlug("arroz-chaufa-especial-de-chancho-asado").orElse(null);
            Product tallarin = productRepository.findBySlug("tallarin-saltado-criollo-de-carne").orElse(null);
            Product medioPollo = productRepository.findBySlug("1-2-pollo-a-la-brasa").orElse(null);
            Product chicha = productRepository.findBySlug("chicha-morada-artesanal-1l").orElse(null);

            if (pollo != null) {
                Order order1 = new Order("BW-9421", customer, PaymentMethod.TARJETA, "Av. Javier Prado Este 1234, Dpto 402", "991234567", "Papas bien doradas y ají extra", new BigDecimal("74.90"), new BigDecimal("5.00"), new BigDecimal("79.90"));
                order1.setStatus(OrderStatus.PENDIENTE);
                order1.addItem(new OrderItem(order1, pollo, pollo.getName(), 1, pollo.getPrice(), pollo.getPrice(), "Papas bien doradas y ají extra"));
                order1.setPayment(new Payment(order1, PaymentMethod.TARJETA, new BigDecimal("79.90"), "CARD-4242"));
                order1.addStatusLog(new OrderStatusLog(order1, null, OrderStatus.PENDIENTE, customer, "Pedido ingresado al sistema"));
                orderRepository.save(order1);
            }

            if (lomo != null && chaufa != null) {
                Order order2 = new Order("BW-8134", customer, PaymentMethod.YAPE_PLIN, "Calle Las Begonias 320, San Isidro", "984556677", null, new BigDecimal("72.80"), new BigDecimal("5.00"), new BigDecimal("77.80"));
                order2.setStatus(OrderStatus.EN_COCINA);
                order2.addItem(new OrderItem(order2, lomo, lomo.getName(), 1, lomo.getPrice(), lomo.getPrice(), null));
                order2.addItem(new OrderItem(order2, chaufa, chaufa.getName(), 1, chaufa.getPrice(), chaufa.getPrice(), null));
                Payment p2 = new Payment(order2, PaymentMethod.YAPE_PLIN, new BigDecimal("77.80"), "YAPE-849201");
                p2.setStatus(PaymentStatus.COMPLETADO);
                order2.setPayment(p2);
                order2.addStatusLog(new OrderStatusLog(order2, null, OrderStatus.PENDIENTE, customer, "Pedido ingresado"));
                order2.addStatusLog(new OrderStatusLog(order2, OrderStatus.PENDIENTE, OrderStatus.EN_COCINA, admin, "Comanda en preparación en wok"));
                orderRepository.save(order2);
            }

            if (tallarin != null) {
                Order order3 = new Order("BW-7209", customer, PaymentMethod.EFECTIVO, "Av. Dos de Mayo 880, San Isidro", "971122334", "Paga con billete de S/ 100", new BigDecimal("36.90"), new BigDecimal("5.00"), new BigDecimal("41.90"));
                order3.setStatus(OrderStatus.EN_CAMINO);
                order3.addItem(new OrderItem(order3, tallarin, tallarin.getName(), 1, tallarin.getPrice(), tallarin.getPrice(), null));
                order3.setPayment(new Payment(order3, PaymentMethod.EFECTIVO, new BigDecimal("41.90"), "CASH-100"));
                order3.addStatusLog(new OrderStatusLog(order3, null, OrderStatus.PENDIENTE, customer, "Pedido ingresado"));
                order3.addStatusLog(new OrderStatusLog(order3, OrderStatus.PENDIENTE, OrderStatus.EN_COCINA, admin, "Comanda en preparación"));
                order3.addStatusLog(new OrderStatusLog(order3, OrderStatus.EN_COCINA, OrderStatus.EN_CAMINO, admin, "Despachado a delivery express"));
                orderRepository.save(order3);
            }

            if (medioPollo != null && chicha != null) {
                Order order4 = new Order("BW-5102", customer, PaymentMethod.TRANSFERENCIA, "Av. Conquistadores 410, San Isidro", "991234567", null, new BigDecimal("54.90"), new BigDecimal("5.00"), new BigDecimal("59.90"));
                order4.setStatus(OrderStatus.ENTREGADO);
                order4.addItem(new OrderItem(order4, medioPollo, medioPollo.getName(), 1, medioPollo.getPrice(), medioPollo.getPrice(), null));
                order4.addItem(new OrderItem(order4, chicha, chicha.getName(), 1, chicha.getPrice(), chicha.getPrice(), null));
                Payment p4 = new Payment(order4, PaymentMethod.TRANSFERENCIA, new BigDecimal("59.90"), "TRANS-948102");
                p4.setStatus(PaymentStatus.COMPLETADO);
                order4.setPayment(p4);
                order4.addStatusLog(new OrderStatusLog(order4, null, OrderStatus.PENDIENTE, customer, "Pedido ingresado"));
                order4.addStatusLog(new OrderStatusLog(order4, OrderStatus.PENDIENTE, OrderStatus.EN_COCINA, admin, "Comanda en preparación"));
                order4.addStatusLog(new OrderStatusLog(order4, OrderStatus.EN_COCINA, OrderStatus.EN_CAMINO, admin, "Despachado"));
                order4.addStatusLog(new OrderStatusLog(order4, OrderStatus.EN_CAMINO, OrderStatus.ENTREGADO, admin, "Entregado con éxito"));
                orderRepository.save(order4);
            }
        }
    }
}
