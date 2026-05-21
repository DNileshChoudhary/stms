package com.example.demo.controller;

import com.example.demo.model.Task;
import com.example.demo.service.TaskService;

import jakarta.servlet.http.HttpServletRequest;

import com.example.demo.security.JwtUtil;

import com.example.demo.dto.ApiResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

        @Autowired
        private JwtUtil jwtUtil;

        @Autowired
        private TaskService service;

        @PostMapping
        public ApiResponse<Task> createTask(@Valid @RequestBody Task task, HttpServletRequest request) {
                String authHeader = request.getHeader("Authorization");

                String token = authHeader.substring(7);

                String username = jwtUtil.extractUsername(token);

                task.setUsername(username);
                Task saved = service.addTask(task);
                return new ApiResponse<>(true, "Task created successfully", saved);
        }

        @GetMapping
        public ApiResponse<List<Task>> getTasks(HttpServletRequest request) {
                String authHeader = request.getHeader("Authorization");

                String token = authHeader.substring(7);

                String username = jwtUtil.extractUsername(token);
                return new ApiResponse<List<Task>>(true, "Task fetched", service.getTasksByUsername(username));
        }

        @DeleteMapping("/{id}")
        public ApiResponse<String> deleteTask(@PathVariable Long id) {
                service.deleteTask(id);
                return new ApiResponse<>(true, "Task Deleted!", null);
        }

        @PutMapping("/{id}")

        public ApiResponse<Task> updateTask(

                        @PathVariable Long id,

                        @RequestBody Task updatedTask) {

                Task task = service.getTaskById(id);

                task.setTitle(updatedTask.getTitle());

                task.setDueDate(updatedTask.getDueDate());

                task.setCategory(updatedTask.getCategory());

                Task saved = service.addTask(task);

                return new ApiResponse<>(
                                true,
                                "Task updated",
                                saved);
        }

        @GetMapping("/filter")
        public ApiResponse<List<Task>> filterTask(@RequestParam String status) {
                return new ApiResponse<List<Task>>(true, "Filtered tasks", service.getTasksByStatus(status));
        }

        @PutMapping("/{id}/complete")
        public Task completeTask(@PathVariable Long id) {

                return service.completeTask(id);
        }

        @PutMapping("/toggle/{id}")

        public ApiResponse<Task> toggleTask(
                        @PathVariable Long id) {

                Task task = service.getTaskById(id);

                if (task.getStatus()
                                .equals("Completed")) {
                        task.setStatus("Pending");
                }

                else {
                        task.setStatus("Completed");
                }

                Task saved = service.addTask(task);

                return new ApiResponse<>(
                                true,
                                "Task updated",
                                saved);
        }

        @PutMapping("/status/{id}")
        public ApiResponse<Task> updateStatus(

                        @PathVariable Long id,

                        @RequestParam String status) {

                Task task = service.getTaskById(id);

                if (task == null) {
                        return new ApiResponse<>(
                                        false,
                                        "Task not found",
                                        null);
                }

                task.setStatus(status);

                Task saved = service.addTask(task);

                return new ApiResponse<>(
                                true,
                                "Status updated",
                                saved);
        }
}
