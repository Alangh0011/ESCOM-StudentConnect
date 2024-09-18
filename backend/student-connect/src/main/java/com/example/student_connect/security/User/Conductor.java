package com.example.student_connect.security.User;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Conductor")
public class Conductor extends User {

    @Column(nullable = false)
    String Placas;

    @Column(nullable = false)
    String Descripcion;

    @Column(nullable = false)
    String Modelo;

    @Column(nullable = false)
    String Color;
}