package com.brasaswok.service;

import com.brasaswok.dto.user.UpdateProfileRequest;
import com.brasaswok.dto.user.UserResponse;
import com.brasaswok.exception.ResourceNotFoundException;
import com.brasaswok.model.User;
import com.brasaswok.repository.UserRepository;
import com.brasaswok.security.service.UserDetailsImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UserResponse updateProfile(UserDetailsImpl userDetails, UpdateProfileRequest request) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + userDetails.getId()));

        user.setFullName(request.getFullName());
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }

        User updated = userRepository.save(user);
        return toResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public UserResponse toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + userId));

        user.setIsActive(!Boolean.TRUE.equals(user.getIsActive()));
        User updated = userRepository.save(user);
        return toResponse(updated);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getAddress(),
                user.getRole(),
                user.getIsActive(),
                user.getCreatedAt()
        );
    }
}
