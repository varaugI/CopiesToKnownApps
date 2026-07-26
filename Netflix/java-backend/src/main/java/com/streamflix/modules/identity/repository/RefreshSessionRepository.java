package com.streamflix.modules.identity.repository;

import com.streamflix.modules.identity.domain.RefreshSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshSessionRepository extends JpaRepository<RefreshSession, String> {
    Optional<RefreshSession> findByRefreshTokenHash(String refreshTokenHash);
    List<RefreshSession> findByAccountIdAndIsRevokedFalse(String accountId);

    @Modifying
    @Query("UPDATE RefreshSession r SET r.isRevoked = true WHERE r.accountId = :accountId")
    void revokeAllForAccount(@Param("accountId") String accountId);
}
