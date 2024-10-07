package com.example.student_connect.security.service;

import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobContainerClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class BlobStorageService {

    private final BlobContainerClient blobContainerClient;

    // Inyectamos las propiedades desde application.properties o application.yml
    @Value("${azure.storage.connection-string}")
    private String connectionString;

    @Value("${azure.storage.container-name}")
    private String containerName;

    // Constructor con la inicialización del cliente
    public BlobStorageService(@Value("${azure.storage.connection-string}") String connectionString,
                              @Value("${azure.storage.container-name}") String containerName) {
        this.connectionString = connectionString;
        this.containerName = containerName;
        this.blobContainerClient = new BlobContainerClientBuilder()
                .connectionString(this.connectionString)
                .containerName(this.containerName)
                .buildClient();
    }

    public String uploadFile(MultipartFile file) throws IOException {
        // Generar un nombre único para el archivo
        String fileName = file.getOriginalFilename();

        // Crear un cliente para el blob y subir el archivo
        blobContainerClient.getBlobClient(fileName).upload(file.getInputStream(), file.getSize(), true);

        // Devolver la URL del archivo subido
        return blobContainerClient.getBlobClient(fileName).getBlobUrl();
    }
}
