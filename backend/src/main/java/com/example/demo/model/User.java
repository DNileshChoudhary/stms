package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class User 
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;
    private String role = "USER";
    
    @Column(unique = true)
    private String email;
    private String username;
    private String password;
    private boolean googleUser;

    public User(){}

    public boolean isGoogleUser()
    {
        return googleUser ; 
    }
    public void setGoogleUser(boolean googleUser)
    {
        this.googleUser = googleUser ; 
    }

    public String getUsername()
    {
        return username;
    }
    
    public String getRole()
    {
    return role;
    }

    public void setRole(
    String role
    )
    {
    this.role = role;
    }

    public Long getId() 
    {
        return id;
    }

    public void setId(Long id) 
    {
        this.id=id;
    }

    public String getPassword()
    {
        return password;
    }

    public void setUsername(String username)
    {
        this.username = username;
    }

    public void setPassword(String password)
    {
        this.password = password;
    }

    public String getEmail() 
    {
        return email;
    }

    public void setEmail(String email) 
    {
        this.email = email;
    }
    
}
