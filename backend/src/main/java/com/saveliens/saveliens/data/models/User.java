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
//@Table(name = "app_user")
public class User {
    @Id
    @GeneratedValue(strategy = UUID)
    private String id;
    private String name;
    private String email;
    private String password;
    private LocalDateTime createdAt;
}
