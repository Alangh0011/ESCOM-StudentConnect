package com.example.student_connect.security.jwt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Clase que implementa AuthenticationEntryPoint de Spring Security para manejar errores de autenticación.
 * Esta clase se utiliza para responder con un mensaje de error personalizado cuando se produce una excepción de autenticación al intentar acceder a recursos protegidos.
 */
@Component
public class JwtEntryPoint implements AuthenticationEntryPoint {

    private final static Logger logger = LoggerFactory.getLogger(JwtEntryPoint.class);

    /**
     * Método para manejar el inicio de la autenticación.
     * Se llama cuando se produce una excepción de autenticación al intentar acceder a recursos protegidos sin autenticación.
     * Responde con un mensaje de error HTTP 401 no autorizado.
     *
     * @param request  La solicitud HTTP.
     * @param response La respuesta HTTP.
     * @param authException   La excepción de autenticación.
     * @throws IOException Si ocurre un error al escribir en el flujo de salida.
     */
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        logger.error("Error en el método commence: {}", authException.getMessage());
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "No autorizado");
    }
}
