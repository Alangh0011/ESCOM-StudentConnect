package com.example.student_connect.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UbicacionResponse {
    private double lat;
    private double lng;
    private LocalDateTime timestamp;
    private boolean activa;

    public UbicacionResponse(double lat, double lng, LocalDateTime timestamp) {
        this.lat = lat;
        this.lng = lng;
        this.timestamp = timestamp;
        this.activa = true;
    }
}