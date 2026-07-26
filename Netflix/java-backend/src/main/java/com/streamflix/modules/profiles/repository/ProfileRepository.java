package com.streamflix.modules.profiles.repository;

import com.streamflix.modules.profiles.domain.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, String> {
    List<Profile> findByAccountId(String accountId);
    Optional<Profile> findByIdAndAccountId(String id, String accountId);
    long countByAccountId(String accountId);
    boolean existsByAccountIdAndName(String accountId, String name);
}
