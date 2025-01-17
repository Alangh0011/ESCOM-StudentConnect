package com.example.student_connect.security.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "usuario",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"email"}),
                @UniqueConstraint(columnNames = {"boleta"})
        })
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "tipo_usuario", discriminatorType = DiscriminatorType.STRING)
public abstract class Usuario implements UserDetails {

    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Getter
    @Setter
    @Column(unique = true, nullable = false)
    private String email;

    @Getter
    @Setter
    @Column(unique = true, nullable = false)
    private int boleta;

    @Getter
    @Setter
    @Column(nullable = false)
    private String nombre;

    @Getter
    @Setter
    @Column(nullable = false)
    private String apellidoPaterno;

    @Getter
    @Setter
    @Column(nullable = false)
    private String apellidoMaterno;

    @Getter
    @Setter
    @Column(nullable = false)
    private String password;

    @Getter
    @Setter
    @Column(nullable = false)
    private boolean avisoPrivacidad;

    @Getter
    @Setter
    @Column(nullable = false)
    private String sexo;

    @Getter
    @Setter
    private double calificacion;

    @Getter
    @Setter
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "usuario_roles",
            joinColumns = @JoinColumn(name = "usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "rol_id"))
    private Set<Rol> roles = new HashSet<>();

    @Getter
    @Setter
    private String fotoPerfilUrl;

    public Usuario() {}

    public Usuario(String nombre, String apellidoPaterno, String apellidoMaterno, String email, String password,
                   int boleta, boolean avisoPrivacidad, String sexo, double calificacion) {
        this.nombre = nombre;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.email = email;
        this.password = password;
        this.boleta = boleta;
        this.avisoPrivacidad = avisoPrivacidad;
        this.sexo = sexo;
        this.calificacion = calificacion;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles; // Asumiendo que la entidad Rol implementa GrantedAuthority
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email; // Usamos el email como nombre de usuario
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

    public int getId() {
        return id;
    }
}
