package com.saveliens.saveliens.data.repositories;

import com.saveliens.saveliens.data.models.Link;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LinkRepository extends JpaRepository<Link, String> {
    Link findByTopicId(String topicId);
    boolean existsByTopicId(String topicId);
//    List<Link> findAllById(Long topicId);
    List<Link> findAllByTopicId(String topicId);


}
