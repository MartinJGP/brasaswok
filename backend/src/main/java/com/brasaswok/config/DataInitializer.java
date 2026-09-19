package com.brasaswok.config;

import com.brasaswok.model.Role;
import com.brasaswok.model.User;
import com.brasaswok.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User(
                    "admin",
                    "admin@brasaswok.pe",
                    passwordEncoder.encode("admin123"),
                    "Administrador Brasas & Wok",
                    "987654321",
                    "Av. Javier Prado Este 1234, San Borja",
                    Role.ROLE_ADMIN
            );
            admin.setIsActive(true);
            userRepository.save(admin);
        }

        if (!userRepository.existsByUsername("cliente")) {
            User customer = new User(
                    "cliente",
                    "cliente@gmail.com",
                    passwordEncoder.encode("cliente123"),
                    "Cliente de Prueba",
                    "991234567",
                    "Calle Los Pinos 432, San Isidro",
                    Role.ROLE_CUSTOMER
            );
            customer.setIsActive(true);
            userRepository.save(customer);
        }
    }
}
