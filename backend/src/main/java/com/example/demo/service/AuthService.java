package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService 
{

    @Autowired
    private UserRepository repo;

    @Autowired
    private JwtUtil jwtUtil;

    public String register(User user) 
    {
        repo.save(user);
        return "User registered";
    }

    public String login(User user)
    {

        // ✅ Empty validation

        if(
            user.getUsername() == null
            ||
            user.getUsername().trim().isEmpty()
            ||
            user.getPassword() == null
            ||
            user.getPassword().trim().isEmpty()
        )
        {
            return "Username and password required";
        }

        User existing =
                repo
                .findByUsername(
                        user.getUsername()
                )
                .orElse(null);

        if(existing == null)
        {
            existing =
                    repo.findByEmail(
                            user.getUsername()
                    );
        }

        if(existing == null)
        {
            return "User not found";
        }

        // Google account without password

        if(
            existing.isGoogleUser()
            &&
            (
                existing.getPassword() == null
                ||
                existing.getPassword()
                        .isEmpty()
            )
        )
        {
            return
                "Please use Google login or reset password";
        }

        // REAL password check

        if(
            !existing
                .getPassword()
                .equals(
                    user.getPassword()
                )
        )
        {
            return "Invalid password";
        }

        return jwtUtil.generateToken(
                existing.getUsername()
        );
    }
}