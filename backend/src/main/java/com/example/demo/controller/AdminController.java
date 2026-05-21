package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import com.example.demo.model.User;
import com.example.demo.repository.TaskRepository;
import com.example.demo.repository.UserRepository;
import java.util.Map;


@RestController

@RequestMapping("/admin")

@CrossOrigin(origins = "http://localhost:3000")

public class AdminController {

    @Autowired

    private UserRepository userRepo;

    @Autowired

private TaskRepository taskRepo;

    @GetMapping("/users")

    public List<User>

            getUsers() {

        return

        userRepo.findAll();

    }

    @DeleteMapping(

    "/users/{id}"

    )

    public String

            deleteUser(

                    @PathVariable

                    Long id

    ) {

        userRepo.deleteById(

                id

        );

        return

        "User deleted";

    }
    @GetMapping(

"/analytics"

)

public Map<String, Long>

analytics()

{

Map<String, Long>

data =

new HashMap<>();

data.put(

"users",

userRepo.count()

);

data.put(

"tasks",

taskRepo.count()

);

data.put(

"completed",

taskRepo.countByStatus(

"Completed"

)

);

data.put(

"pending",

taskRepo.countByStatus(

"Pending"

)

);

return data;

}

}