package com.example.pasir_marchanski_sebastian.repository;

import com.example.pasir_marchanski_sebastian.model.Group;
import com.example.pasir_marchanski_sebastian.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupRepository extends JpaRepository<Group, Long> {
    List<Group> findByMemberships_User(User user);
}
