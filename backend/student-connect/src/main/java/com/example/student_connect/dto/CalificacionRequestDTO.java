package com.example.student_connect.dto;

import com.example.student_connect.security.entity.Pasajero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CalificacionRequestDTO {
    private Integer viajeId;
    private Integer pasajeroId;
    private Pasajero pasajero;
    private double calificacion;
    private String comentario;
}
