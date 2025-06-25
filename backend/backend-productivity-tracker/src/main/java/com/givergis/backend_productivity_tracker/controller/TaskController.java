package com.givergis.backend_productivity_tracker.controller;


import org.springframework.web.bind.annotation.*;

import com.givergis.backend_productivity_tracker.DTO.TaskDTO;
import com.givergis.backend_productivity_tracker.service.TaskService;

import jakarta.validation.Valid;

import java.util.List;
import com.givergis.backend_productivity_tracker.model.User;
import com.givergis.backend_productivity_tracker.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;



@RestController
@RequestMapping("/api/tasks")
@CrossOrigin
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    // GET all tasks for current user
   @GetMapping
    public List<TaskDTO> getAllTasks(@AuthenticationPrincipal UserDetails userDetails) {
    String email = userDetails.getUsername();
    return taskService.getAllTasks(email);
    }

    // POST create new task for current user
    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@Valid @RequestBody TaskDTO taskDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));;
        TaskDTO createdTask = taskService.createTask(taskDTO, user);
        return ResponseEntity.ok(createdTask);
    }

    // PUT update task
    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskDTO taskDTO
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));;
        TaskDTO updatedTask = taskService.updateTask(id, taskDTO, user);
        return ResponseEntity.ok(updatedTask);
    }

    // DELETE task
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                                 .orElseThrow(() -> new RuntimeException("User not found"));;

        taskService.deleteTask(id, user);
        return ResponseEntity.ok().build();
    }
}
