package com.example.demo.security;

import java.io.IOException;

import org.springframework.security.core.Authentication;

import org.springframework.security.oauth2.core.user.OAuth2User;

import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;

import jakarta.servlet.http.HttpServletRequest;

import jakarta.servlet.http.HttpServletResponse;

import com.example.demo.model.User;

import com.example.demo.repository.UserRepository;

@Component
public class OAuth2LoginSuccessHandler
        implements AuthenticationSuccessHandler
{

    private final JwtUtil jwtUtil;

    private final UserRepository repo;

    public OAuth2LoginSuccessHandler(
            JwtUtil jwtUtil,
            UserRepository repo
    )
    {
        this.jwtUtil = jwtUtil;
        this.repo = repo ;
    }

    @Override
    public void onAuthenticationSuccess(

            HttpServletRequest request,

            HttpServletResponse response,

            Authentication authentication

    )
            throws IOException,
            ServletException
    {

        OAuth2User oauthUser =
                (OAuth2User)
                        authentication.getPrincipal();

        String email =
                oauthUser.getAttribute("email");

        User existingUser =
                repo.findByEmail(email);

        if(existingUser == null)
        {

            User newUser = new User();

            // username from email

            String username =
                    email.split("@")[0];

            newUser.setUsername(username);

            newUser.setEmail(email);

            // random password

            newUser.setPassword("");

            newUser.setGoogleUser(
                true
            );

            repo.save(newUser);
            existingUser = newUser ; 
        }

        String username =
                repo.findByEmail(email)
                    .getUsername();

        String token =
                jwtUtil.generateToken(username);

        response.sendRedirect(

            "https://stms-xi.vercel.app/oauth-success?token="

            + token
            + "&username="
            + existingUser.getUsername()
        );
    }
}