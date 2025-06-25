package com.givergis.backend_productivity_tracker.DTO;

import java.time.LocalDate;

import com.givergis.backend_productivity_tracker.model.TaskStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskDTO {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private String priority;
    private LocalDate dueDate;

    // Constructors, Getters and Setters
}
