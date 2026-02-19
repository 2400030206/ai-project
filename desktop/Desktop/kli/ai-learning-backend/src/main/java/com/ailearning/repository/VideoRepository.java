package com.ailearning.repository;

import com.ailearning.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findByLanguage(String language);
    List<Video> findByStatus(String status);
    List<Video> findByTitleContaining(String title);
}
