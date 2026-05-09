package com.example.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public routes - no token needed
                        .requestMatchers("/auth/**").permitAll()
                        // Admin only
                        .requestMatchers("/notices/**").hasRole("ADMIN")
                        .requestMatchers("/apartments/**").hasRole("ADMIN")
                        // Admin and Tenant and Owner
                        .requestMatchers("/tenants/**").hasAnyRole("ADMIN", "TENANT", "OWNER")
                        .requestMatchers("/complaints/**").hasAnyRole("ADMIN", "TENANT", "OWNER")
                        .requestMatchers("/rent/**").hasAnyRole("ADMIN", "TENANT")
                        .requestMatchers("/maintenance-charges/**").hasAnyRole("ADMIN", "TENANT", "OWNER")
                        // Everything else needs authentication
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}