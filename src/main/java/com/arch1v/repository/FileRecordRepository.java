package com.arch1v.repository;

import com.arch1v.model.FileRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FileRecordRepository extends JpaRepository<FileRecord, Long> {
    boolean existsByHash(String hash);
    Optional<FileRecord> findByHash(String hash);
    long deleteByHash(String hash);
}
