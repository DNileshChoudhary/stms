package com.example.demo.service;

import com.example.demo.model.Task;
import com.example.demo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository repo;

    public Task addTask(Task task) {

        if (task.getStatus() == null) {
            task.setStatus("Pending");
        }

        task.setPriority(
                determinePriority(task.getTitle()));

        return repo.save(task);
    }

    public Task getTaskById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public List<Task> getTasksByUsername(String username) {
        return repo.findByUsername(username);
    }

    public List<Task> getAllTasks() {
        return repo.findAll();
    }

    public void deleteTask(Long id) {
        repo.deleteById(id);
    }

    public Task updateTask(Long id, Task newTask) {
        Task existing = repo.findById(id).orElse(null);

        if (existing != null) {
            if (newTask.getTitle() != null)
                existing.setTitle(newTask.getTitle());

            if (newTask.getStatus() != null)
                existing.setStatus(newTask.getStatus());

            return repo.save(existing);
        }
        return null;
    }

    public List<Task> getTasksByStatus(String status) {
        return repo.findByStatus(status);
    }

    public Task completeTask(Long id) {

        Task task = repo.findById(id).orElse(null);

        if (task != null) {

            task.setStatus("Completed");

            return repo.save(task);
        }

        return null;
    }

    private String determinePriority(String title) {

        title = title.toLowerCase();

        if (title.contains("urgent") ||
                title.contains("exam") ||
                title.contains("interview")) {

            return "HIGH";
        }

        else if (title.contains("assignment") ||
                title.contains("project")) {

            return "MEDIUM";
        }

        return "LOW";
    }

}