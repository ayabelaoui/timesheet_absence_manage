package com.employe.repository;

import com.employe.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);

    @SuppressWarnings("unchecked")
    Role save(Role role);

    boolean existsByName(String string);
}
