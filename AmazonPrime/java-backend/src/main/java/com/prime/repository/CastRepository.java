package com.prime.repository;

import com.prime.domain.CastMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CastRepository extends JpaRepository<CastMember, String> {
    List<CastMember> findByMediaId(String mediaId);
}
