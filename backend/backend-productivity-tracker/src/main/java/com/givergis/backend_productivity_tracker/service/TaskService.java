package com.givergis.backend_productivity_tracker.service;

import org.springframework.stereotype.Service;

import com.givergis.backend_productivity_tracker.DTO.TaskDTO;
import com.givergis.backend_productivity_tracker.model.Task;
import com.givergis.backend_productivity_tracker.model.User;
import com.givergis.backend_productivity_tracker.repository.TaskRepository;
import com.givergis.backend_productivity_tracker.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<TaskDTO> getAllTasks(String email) {
       User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    List<Task> tasks = taskRepository.findByUser(user);

    return tasks.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public TaskDTO createTask(TaskDTO dto, User user) {
        Task task = convertToEntity(dto);
        task.setUser(user);
        Task saved = taskRepository.save(task);
        return convertToDTO(saved);
    }

public TaskDTO updateTask(Long id, TaskDTO dto, User user) {
    Optional<Task> optionalTask = taskRepository.findById(id);
    
    
if(optionalTask.isEmpty()) {
    throw new RuntimeException("Task not found with id: " + id);
}

Task task = optionalTask.get();

if(task.getUser() == null) {
    throw new RuntimeException("Task user is null for task id: " + id + ". Cannot update task without user.");
}

if(!task.getUser().equals(user)) {
    throw new RuntimeException("Task does not belong to the user");
}

    task.setTitle(dto.getTitle());
    task.setDescription(dto.getDescription());
    task.setStatus(dto.getStatus());
    task.setPriority(dto.getPriority());
    task.setDueDate(dto.getDueDate());

    Task updated = taskRepository.save(task);
    return convertToDTO(updated);
}



    public void deleteTask(Long id, User user) {
        Task task = taskRepository.findById(id)
                .filter(t -> t.getUser().equals(user))
                .orElseThrow(() -> new RuntimeException("Task not found"));
        taskRepository.delete(task);
    }

    // --- Helpers ---
    private TaskDTO convertToDTO(Task task) {
        return TaskDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .build();
    }

    private Task convertToEntity(TaskDTO dto) {
        return Task.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .status(dto.getStatus())
                .priority(dto.getPriority())
                .dueDate(dto.getDueDate())
                .build();
    }

    
}
