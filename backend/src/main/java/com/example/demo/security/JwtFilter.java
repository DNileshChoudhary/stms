package com.example.demo.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();

        if (

        path.startsWith(
                "/auth")

                ||

                path.startsWith(
                        "/oauth2")

                ||

                path.startsWith(
                        "/login")

                ||

                path.startsWith(
                        "/ai"

                ) ||
                path.startsWith(
                        "/files"

                ) ||

                path.startsWith(
                "/admin/analytics"
                )

        ) {

            filterChain.doFilter(
                    request,
                    response);

            return;

        }

        // ✅ Skip auth endpoints properly
        if (path.startsWith("/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing Token");
            return;
        }

        String token = header.substring(7);

        try {
            jwtUtil.extractUsername(token);
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid Token");
            return;
        }

        filterChain.doFilter(request, response);
    }
}