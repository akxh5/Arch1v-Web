package com.arch1v.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "file_records", indexes = {
        @Index(name = "idx_file_hash_unique", columnList = "hash", unique = true)
})
public class FileRecord {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 128)
    private String hash;

    @Column(nullable = false)
    private String filename;

    @Column(nullable = false, length = 2048)
    private String path;

    @Column(nullable = false)
    private long size;

    @Column(length = 255)
    private String mimeType;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public FileRecord() {}
    public FileRecord(String hash, String filename, String path, long size, String mimeType) {
        this.hash = hash; this.filename = filename; this.path = path;
        this.size = size; this.mimeType = mimeType;
    }

    public Long getId() { return id; }
    public String getHash() { return hash; }
    public void setHash(String hash) { this.hash = hash; }
    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
    public long getSize() { return size; }
    public void setSize(long size) { this.size = size; }
    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }
    public Instant getCreatedAt() { return createdAt; }
}
