package com.example.student_connect.security.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class VehiculoResponse {
    private Integer vehiculoId;
    private String placas;
    private String descripcion;
    private String modelo;
    private String color;
}
