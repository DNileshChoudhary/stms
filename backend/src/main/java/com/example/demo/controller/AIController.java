package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;

import com.example.demo.service.AIService;

import java.util.List;

import org.springframework.web.bind.annotation.RequestBody;

import com.example.demo.model.Task;

@RestController

@RequestMapping("/ai")

@CrossOrigin(
origins =
"http://localhost:3000"
)

public class AIController {

    private final AIService service;

    public AIController(
            AIService service
    ) {

        this.service =
                service;

    }

    @GetMapping

    public String suggest(

            @RequestParam
            String task

    ) {

        return service
                .analyzeTask(
                        task
                );

    }
    
    @PostMapping("/schedule")

        public String generateSchedule(

                @RequestBody

                List<Task>

                        tasks

        )
        {

        return

                service

                        .generateSchedule(

                                tasks

                        );

        }
}