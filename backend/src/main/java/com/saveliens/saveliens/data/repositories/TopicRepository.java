package com.saveliens.saveliens.data.repositories;

import com.saveliens.saveliens.data.models.Link;
import com.saveliens.saveliens.data.models.Topic;
import com.saveliens.saveliens.data.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TopicRepository extends JpaRepository<Topic, String> {
    boolean existsById(String id);
    List<Topic> findByUserId(String userId);
    List<Topic> findAllByUser(User user);

}
