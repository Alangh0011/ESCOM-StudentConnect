package com.example.student_connect.security.jwt;

import com.example.student_connect.security.entity.Usuario;
import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import com.example.student_connect.security.entity.Conductor;


import java.util.Date;

/**
 * Clase que proporciona funcionalidad para generar, validar y obtener información de tokens JWT (JSON Web Tokens).
 * Esta clase se encarga de generar tokens JWT basados en la autenticación del usuario, validar la autenticidad y vigencia de los tokens,
 * y obtener información de usuario desde un token JWT.
 */
@Component
public class JwtProvider {
    private final static Logger logger = LoggerFactory.getLogger(JwtProvider.class);

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private int expiration;

    /**
     * Método para generar un token JWT basado en la autenticación del usuario.
     *
     * @param authentication La información de autenticación del usuario.
     * @return Un token JWT generado.
     */
    public String generateToken(Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration * 1000);

        return Jwts.builder()
                .setSubject(usuario.getUsername()) // Usa el correo como "nombre de usuario"
                .claim("roles", usuario.getAuthorities()) // Agrega los roles
                .claim("id", usuario.getId()) // ID del usuario
                .claim("nombre", usuario.getNombre()) // Nombre del usuario
                .claim("apellidoPaterno", usuario.getApellidoPaterno()) // Apellido paterno
                .claim("boleta", usuario.getBoleta()) // Boleta
                .claim("calificacion", usuario.getCalificacion()) // Calificación

                // Si el usuario es un conductor, agrega sus detalles del vehículo
                .claim("placas", usuario instanceof Conductor ? ((Conductor) usuario).getPlacas() : null)
                .claim("descripcion", usuario instanceof Conductor ? ((Conductor) usuario).getDescripcion() : null)
                .claim("modelo", usuario instanceof Conductor ? ((Conductor) usuario).getModelo() : null)
                .claim("color", usuario instanceof Conductor ? ((Conductor) usuario).getColor() : null)

                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }


    /**
     * Método para obtener el nombre de usuario desde un token JWT.
     *
     * @param token El token JWT.
     * @return El correo (nombre de usuario) extraído del token.
     */
    public String getNombreUsuarioFromToken(String token){
        return Jwts.parser()
                .setSigningKey(secret).parseClaimsJws(token).getBody().getSubject();
    }

    /**
     * Método para validar la autenticidad y vigencia de un token JWT.
     *
     * @param token El token JWT a validar.
     * @return true si el token es válido, false de lo contrario.
     */
    public boolean validateToken(String token){
        try {
            Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Token mal formado");
        } catch (UnsupportedJwtException e) {
            logger.error("Token no soportado");
        } catch (ExpiredJwtException e) {
            logger.error("Token expirado");
        } catch (IllegalArgumentException e) {
            logger.error("Token vacío");
        } catch (SignatureException e) {
            logger.error("Falla en la firma");
        }
        return false;
    }
}
