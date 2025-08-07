package com.employe.service;

import com.employe.model.User;
import java.util.List;

public interface UserService {
    User saveUser(User user);

    User findByEmail(String email);

    List<User> findUsersByRole(String roleName); // Ajouté ici
}
