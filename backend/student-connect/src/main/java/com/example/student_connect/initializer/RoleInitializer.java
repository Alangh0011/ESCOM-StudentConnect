package com.example.student_connect.initializer;

import com.example.student_connect.security.entity.Rol;
import com.example.student_connect.security.enums.RolNombre;
import com.example.student_connect.security.service.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class RoleInitializer implements CommandLineRunner {

    @Autowired
    private RolService rolService;

    @Override
    public void run(String... args) throws Exception {
        if (rolService.getByRolNombre(RolNombre.ROLE_PASAJERO).isEmpty()) {
            rolService.save(new Rol(RolNombre.ROLE_PASAJERO));
        }
        if (rolService.getByRolNombre(RolNombre.ROLE_CONDUCTOR).isEmpty()) {
            rolService.save(new Rol(RolNombre.ROLE_CONDUCTOR));
        }
        if (rolService.getByRolNombre(RolNombre.ROLE_ADMIN).isEmpty()) {
            rolService.save(new Rol(RolNombre.ROLE_ADMIN));
        }
    }
}
