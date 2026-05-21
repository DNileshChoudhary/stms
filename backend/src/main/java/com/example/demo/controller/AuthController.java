package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AuthService;
import com.example.demo.service.EmailService;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController 
{

    @Autowired
    private AuthService service;

    @Autowired
    private UserRepository userRepo;

    private Map<String, String> otpStorage =
        new HashMap<>();

    @Autowired
    private EmailService emailService;

    @PostMapping("/forgot-password")

    public String forgotPassword(
            @RequestParam String input
    )
    {

        User user =
                userRepo.findByEmail(input);

        // ✅ If email not found,
        // try username

        if(user == null)
        {

            user =
                    userRepo
                    .findByUsername(input)
                    .orElse(null);
        }

        // ✅ User not found

        if(user == null)
        {
            return "User not found";
        }

        // ✅ Generate OTP

        String otp =
                String.valueOf(
                        100000 +
                        new Random().nextInt(900000)
                );

        // ✅ Store OTP using email

        otpStorage.put(
                user.getEmail(),
                otp
        );

        // ✅ Send email

        emailService.sendOtpEmail(
                user.getEmail(),
                otp
        );

        return "OTP sent successfully";
    }

    @PostMapping("/verify-otp")

    public String verifyOtp(

            @RequestParam String email,

            @RequestParam String otp
    )
    {

        String storedOtp =
                otpStorage.get(email);

        if(
            storedOtp != null
            &&
            storedOtp.equals(otp)
        )
        {
            return "OTP verified successfully";
        }

        return "Invalid OTP";
    }

    @PostMapping("/reset-password")

    public String resetPassword(

            @RequestParam String input,

            @RequestParam String newPassword

    )
    {

        User user =
                userRepo.findByEmail(
                        input
                );

        // if email not found

        if(user == null)
        {

            user =
                    userRepo
                    .findByUsername(input)
                    .orElse(null);
        }

        if(user == null)
        {
            return "User not found";
        }

        user.setPassword(
                newPassword
        );

        user.setGoogleUser(
                false
        );

        userRepo.save(
                user
        );

        return
                "Password reset successful";
    }

    @PostMapping("/register")
    public String register(@RequestBody User user) 
    {
        return service.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) 
    {
        return service.login(user);
    }
}