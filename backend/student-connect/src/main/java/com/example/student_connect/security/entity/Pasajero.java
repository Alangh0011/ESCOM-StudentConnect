package com.example.student_connect.security.entity;

import javax.persistence.Entity;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Table;
import java.util.Set;

@Entity
@DiscriminatorValue("PASAJERO")
@Table(name = "pasajero")
public class Pasajero extends Usuario {

    public Pasajero(String nombre, String apellidoPaterno, String apellidoMaterno, String email, String password, int boleta, boolean avisoPrivacidad, String sexo) {
        super(nombre, apellidoPaterno, apellidoMaterno, email, password, boleta, avisoPrivacidad, sexo);
    }

    public Pasajero() {
        // Constructor vacío para JPA
    }

    // Asegúrate de que el método setRoles esté disponible en la clase base Usuario
}
