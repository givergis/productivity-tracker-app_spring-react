package com.givergis.backend_productivity_tracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.givergis.backend_productivity_tracker.model.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task,Long> {
    List<Task> findByUserId(Long userId);
}