package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Task
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @NotBlank(message = "Title cannot be empty")
    private String title;
    private String priority ; 
    private String dueDate;
    private String username;
    private String category;
    private String fileName;
    
    private String status;

    public Task(){}

    public Task(String title , String status)
    {
        this.title = title ;
        this.status = status;
    }

    public Long getId()
    {
        return Id;
    }
    public String getTitle()
    {
        return title;
    }

    public String getStatus()
    {
        return status;
    }

    public void setTitle(String title)
    {
        this.title = title;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    public String getPriority()
    {
        return priority;
    }

    public void setPriority(String priority)
    {
        this.priority = priority ; 
    }
    
    public String getDueDate() 
    {
        return dueDate;
    }

    public void setDueDate(String dueDate) 
    {
        this.dueDate = dueDate;
    }

    public String getUsername() 
    {
        return username;
    }

    public void setUsername(String username) 
    {
        this.username = username;
    }
    public String getCategory() 
    {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getFileName() 
    {
        return fileName;
    }

    public void setFileName(
            String fileName) 
    {
        this.fileName = fileName;
    }
}