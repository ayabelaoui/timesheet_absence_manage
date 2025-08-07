package com.employe.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.employe.model.Role;
import com.employe.model.User;
import com.employe.repository.RoleRepository;
import com.employe.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User saveUser(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            Role defaultRole = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new RuntimeException("Default role not found"));
            Set<Role> roles = new HashSet<>();
            roles.add(defaultRole);
            user.setRoles(roles);
        }
        return userRepository.save(user);
    }

    @Override
    public User findByEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        return userOpt.orElse(null);
    }

    @Override
    public List<User> findUsersByRole(String roleName) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findUsersByRole'");
    }
}
