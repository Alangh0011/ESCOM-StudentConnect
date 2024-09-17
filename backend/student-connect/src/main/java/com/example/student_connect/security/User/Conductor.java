package com.example.student_connect.security.User;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "conductores")
public class Conductor extends User {

    @Column(nullable = false)
    String Placas;

    @Column(nullable = false)
    String Descripcion;

    @Column(nullable = false)
    String Modelo;

    @Column(nullable = false)
    String Color;

    // Constructor completo
    public Conductor(String Correo, String Contrasena, String Nombres, String Apellido_Paterno, String Apellido_Materno,
                     int Boleta, byte[] fotoPerfil, boolean aviso_privacidad, Role role,
                     String Placas, String Descripcion, String Modelo, String Color) {
        super(Correo, Contrasena, Nombres, Apellido_Paterno, Apellido_Materno, Boleta, fotoPerfil, aviso_privacidad, role);
        this.Placas = Placas;
        this.Descripcion = Descripcion;
        this.Modelo = Modelo;
        this.Color = Color;
    }

    // Método estático de construcción (builder)
    public static Conductor build(String Correo, String Contrasena, String Nombres, String Apellido_Paterno, String Apellido_Materno,
                                  int Boleta, byte[] fotoPerfil, boolean aviso_privacidad, Role role,
                                  String Placas, String Descripcion, String Modelo, String Color) {
        return new Conductor(Correo, Contrasena, Nombres, Apellido_Paterno, Apellido_Materno, Boleta, fotoPerfil, aviso_privacidad, role,
                Placas, Descripcion, Modelo, Color);
    }
}

