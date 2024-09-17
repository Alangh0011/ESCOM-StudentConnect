package com.example.student_connect.security.Auth;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
public class FileStorageService {

    // Dentro de FileStorageService
    public byte[] convertToBytes(MultipartFile file) {
        try {
            return file.getBytes();
        } catch (IOException e) {
            // Maneja el error, lanza una RuntimeException o devuelve un valor predeterminado
            throw new RuntimeException("Error al convertir el archivo a bytes", e);
        }
    }

}
