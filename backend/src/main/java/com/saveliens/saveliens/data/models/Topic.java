package com.saveliens.saveliens.data.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

import static jakarta.persistence.GenerationType.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Topic{
    @Id
    @GeneratedValue(strategy = UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id")

    private User user;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
