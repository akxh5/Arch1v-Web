package com.arch1v.service;

import com.arch1v.model.User;
import com.arch1v.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Map;

@Service
public class AuthService {
    private final UserRepository repo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final Key key;

    public AuthService(UserRepository repo,
                       @Value("${arch1v.jwt.secret:arch1v-dev-secret-please-change-this-32-bytes-min}") String secret) {
        this.repo = repo;
        // derive a stable HMAC key from configuration so tokens survive restarts
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public Map<String,Object> register(String username, String password) {
        if (username == null || username.isBlank()) throw new IllegalArgumentException("Username required");
        if (password == null || password.isBlank()) throw new IllegalArgumentException("Password required");
        if (repo.existsByUsername(username)) throw new IllegalArgumentException("Username already taken");
        String hashed = encoder.encode(password);
        repo.save(new User(username, hashed));
        return Map.of("message", "User registered successfully");
    }

    public Map<String,Object> login(String username, String password) {
        User user = repo.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!encoder.matches(password, user.getPassword()))
            throw new IllegalArgumentException("Invalid credentials");

        String token = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
        return Map.of("token", token, "username", username);
    }

    public String validate(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }
}