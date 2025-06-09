package com.example.pasir_marchanski_sebastian.repository;

import com.example.pasir_marchanski_sebastian.model.Transaction;
import com.example.pasir_marchanski_sebastian.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser(User user);
}
