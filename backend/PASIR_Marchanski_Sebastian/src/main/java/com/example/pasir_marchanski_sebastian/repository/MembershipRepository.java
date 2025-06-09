package com.example.pasir_marchanski_sebastian.repository;

import com.example.pasir_marchanski_sebastian.model.Membership;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MembershipRepository extends JpaRepository<Membership, Long> {
    List<Membership> findByGroupId(Long groupId);
}
