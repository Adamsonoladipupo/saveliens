package com.saveliens.saveliens.data.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@Entity
@Getter
@Setter
@NoArgsConstructor
public class Link {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String url;

    @ManyToOne
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;
    private LocalDateTime createdAt;
}
