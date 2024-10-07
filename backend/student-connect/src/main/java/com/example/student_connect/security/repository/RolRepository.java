package com.example.student_connect.security.repository;

import com.example.student_connect.security.entity.Rol;
import com.example.student_connect.security.enums.RolNombre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RolRepository extends JpaRepository<Rol, Integer> {  // Cambié String a Integer
    Optional<Rol> findByRolNombre(RolNombre rolNombre);
}
