package com.example.student_connect.dto;

public class ReservacionRequest {
    private Integer pasajeroId;
    private Integer rutaId;
    private Integer paradaId; // Cambiar a Integer
    private char tipoRuta;

    // Getters y Setters
    public Integer getPasajeroId() {
        return pasajeroId;
    }

    public void setPasajeroId(Integer pasajeroId) {
        this.pasajeroId = pasajeroId;
    }

    public Integer getRutaId() {
        return rutaId;
    }

    public void setRutaId(Integer rutaId) {
        this.rutaId = rutaId;
    }

    public Integer getParadaId() { // Cambiar a Integer
        return paradaId;
    }

    public void setParadaId(Integer paradaId) {
        this.paradaId = paradaId;
    }

    public char getTipoRuta() {
        return tipoRuta;
    }

    public void setTipoRuta(char tipoRuta) {
        this.tipoRuta = tipoRuta;
    }
}

