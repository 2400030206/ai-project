package com.ailearning.repository;

import com.ailearning.entity.PDF;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PDFRepository extends JpaRepository<PDF, Long> {
    List<PDF> findByUserId(Long userId);
}
