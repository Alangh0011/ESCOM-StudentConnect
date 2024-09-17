package com.example.student_connect.security.User;

import java.util.Collection;
import java.util.List;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="user", uniqueConstraints = {@UniqueConstraint(columnNames = {"Correo"})})
@Inheritance(strategy = InheritanceType.JOINED)
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    @Column(nullable = false, unique = true)
    String Correo;

    @Column(nullable = false)
    String Nombres;

    String Apellido_Paterno;
    String Apellido_Materno;

    @Column(nullable = false)
    int Boleta;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    byte[] fotoPerfil; // Almacena el contenido de la imagen como un array de bytes

    boolean aviso_privacidad;

    @Column(nullable = false)
    String Contrasena;

    @Enumerated(EnumType.STRING)
    Role role;

    public User(String correo, String contrasena, String nombres, String apellidoPaterno, String apellidoMaterno, int boleta, byte[] fotoPerfil, boolean avisoPrivacidad, Role role) {
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return this.Contrasena;
    }

    @Override
    public String getUsername() {
        return this.Correo;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
