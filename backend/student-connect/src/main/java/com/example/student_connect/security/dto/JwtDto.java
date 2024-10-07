package com.example.student_connect.security.dto;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class JwtDto {
    private String token;
    private String bearer = "Bearer";
    private String username;
    private Collection<? extends GrantedAuthority> authorities;

    /**
     * Constructor de JwtDto.
     * @param token El token JWT generado para la autenticación del usuario.
     * @param username El nombre de usuario del usuario autenticado.
     * @param authorities Las autoridades (roles) del usuario autenticado.
     */
    public JwtDto(String token, String username, Collection<? extends GrantedAuthority> authorities) {
        this.token = token;
        this.username = username;
        this.authorities = authorities;
    }

    // Getters y Setters para los campos de la clase

    /**
     * Obtiene el token JWT.
     * @return El token JWT generado para la autenticación del usuario.
     */
    public String getToken() {
        return token;
    }

    /**
     * Establece el token JWT.
     * @param token El token JWT generado para la autenticación del usuario.
     */
    public void setToken(String token) {
        this.token = token;
    }

    /**
     * Obtiene el prefijo "Bearer" utilizado en el token JWT.
     * @return El prefijo "Bearer".
     */
    public String getBearer() {
        return bearer;
    }

    /**
     * Establece el prefijo "Bearer".
     * @param bearer El prefijo "Bearer".
     */
    public void setBearer(String bearer) {
        this.bearer = bearer;
    }

    /**
     * Obtiene el nombre de usuario del usuario autenticado.
     * @return El nombre de usuario del usuario autenticado.
     */
    public String getUsername() {
        return username;
    }

    /**
     * Establece el nombre de usuario del usuario autenticado.
     * @param username El nombre de usuario del usuario autenticado.
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Obtiene las autoridades (roles) del usuario autenticado.
     * @return Las autoridades (roles) del usuario autenticado.
     */
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    /**
     * Establece las autoridades (roles) del usuario autenticado.
     * @param authorities Las autoridades (roles) del usuario autenticado.
     */
    public void setAuthorities(Collection<? extends GrantedAuthority> authorities) {
        this.authorities = authorities;
    }
}
