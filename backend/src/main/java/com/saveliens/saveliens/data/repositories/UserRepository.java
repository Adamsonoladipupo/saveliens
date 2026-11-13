package com.saveliens.saveliens.data.repositories;

import com.saveliens.saveliens.data.models.User;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
    SELECT u FROM User u
    WHERE u.email = :email
    """)
    Optional<User> findByEmailForUpdate(
            @Param("email") String email
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
    SELECT u FROM User u
    WHERE u.id = :id
    """)
    Optional<User> findByIdForUpdate(
            @Param("id") String id
    );
}
