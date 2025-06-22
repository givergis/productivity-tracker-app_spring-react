package com.givergis.backend_productivity_tracker.service;

import org.springframework.stereotype.Service;

import com.givergis.backend_productivity_tracker.DTO.TaskDTO;
import com.givergis.backend_productivity_tracker.model.Task;
import com.givergis.backend_productivity_tracker.repository.TaskRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public TaskDTO createTask(Task task) {
        Task saved = taskRepository.save(task);
        return convertToDTO(saved);
    }

    public TaskDTO updateTask(Long id, Task taskData) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(taskData.getTitle());
        task.setDescription(taskData.getDescription());
        task.setStatus(taskData.getStatus());
        task.setPriority(taskData.getPriority());
        task.setDueDate(taskData.getDueDate());

        Task updated = taskRepository.save(task);
        return convertToDTO(updated);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    private TaskDTO convertToDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setPriority(task.getPriority());
        dto.setDueDate(task.getDueDate());
        return dto;
    }
}
