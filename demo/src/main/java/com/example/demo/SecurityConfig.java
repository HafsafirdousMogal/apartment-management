package com.example.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
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
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public
                        .requestMatchers("/auth/**").permitAll()

                        // Notices — everyone reads, only admin creates/deletes
                        .requestMatchers(HttpMethod.GET, "/notices/**").hasAnyRole("ADMIN", "TENANT", "OWNER")
                        .requestMatchers("/notices/**").hasRole("ADMIN")

                        // Apartments — admin only
                        .requestMatchers("/apartments/**").hasRole("ADMIN")

                        // Tenants — all roles
                        .requestMatchers("/tenants/**").hasAnyRole("ADMIN", "TENANT", "OWNER")

                        // Complaints — all roles can read and create
                        .requestMatchers("/complaints/**").hasAnyRole("ADMIN", "TENANT", "OWNER")

                        // Rent — admin and tenant only
                        .requestMatchers("/rent/**").hasAnyRole("ADMIN", "TENANT")

                        // Maintenance charges — all roles
                        .requestMatchers("/maintenance-charges/**").hasAnyRole("ADMIN", "TENANT", "OWNER")

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