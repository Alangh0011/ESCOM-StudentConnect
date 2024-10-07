package com.example.student_connect.security.entity;

import com.example.student_connect.security.enums.RolNombre;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;

@Entity
public class Rol implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Enumerated(EnumType.STRING)
    private RolNombre rolNombre;

    public Rol() {}

    public Rol(RolNombre rolNombre) {
        this.rolNombre = rolNombre;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public RolNombre getRolNombre() {
        return rolNombre;
    }

    public void setRolNombre(RolNombre rolNombre) {
        this.rolNombre = rolNombre;
    }

    @Override
    public String getAuthority() {
        return rolNombre.name();
    }
}
