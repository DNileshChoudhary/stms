package com.example.demo.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

        private final OAuth2LoginSuccessHandler successHandler;
        @Autowired
        private JwtFilter jwtFilter;

        @Bean

        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration configuration = new CorsConfiguration();

                configuration
                                .addAllowedOrigin(
                                                "http://localhost:3000");
                configuration.addAllowedOrigin(
                                "https://stms-xi.vercel.app/");

                configuration.addAllowedMethod("*");

                configuration.addAllowedHeader("*");

                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration(
                                "/**",
                                configuration);

                return source;
        }

        public SecurityConfig(

                        OAuth2LoginSuccessHandler successHandler

        ) {
                this.successHandler = successHandler;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http) throws Exception {
                http.cors(cors -> {
                }).csrf(csrf -> csrf.disable()).sessionManagement(
                                session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                                .authorizeHttpRequests(auth -> auth.requestMatchers("/auth/**", "/login/**",
                                                "/oauth2/**", "/tasks/**", "/ai/**", "/files/**", "/admin/analytics")
                                                .permitAll().anyRequest()
                                                .authenticated())
                                .oauth2Login(oauth -> oauth.successHandler(successHandler))
                                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
                ;
                return http.build();
        }
}