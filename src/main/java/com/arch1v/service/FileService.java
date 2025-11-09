package com.arch1v.service;

import com.arch1v.dto.UploadResponse;
import com.arch1v.model.FileRecord;
import com.arch1v.repository.FileRecordRepository;
import com.arch1v.util.FileTypeUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;

@Service
public class FileService {

    private final FileRecordRepository repo;
    private final DuplicateService duplicateService;
    private final Path root;

    public FileService(FileRecordRepository repo,
                       DuplicateService duplicateService,
                       @Value("${arch1v.storage.root:./storage}") String rootDir) throws Exception {
        this.repo = repo;
        this.duplicateService = duplicateService;
        this.root = Path.of(rootDir).toAbsolutePath().normalize();
        Files.createDirectories(this.root);
    }

    public UploadResponse upload(MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("File is empty");

        String originalName = StringUtils.cleanPath(
                file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload.bin");
        String mime = file.getContentType();
        long size = file.getSize();

        Path temp = Files.createTempFile("arch1v-upload-", ".tmp");
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, temp, StandardCopyOption.REPLACE_EXISTING);
        }

        String hash = duplicateService.computeHash(temp);

        Optional<FileRecord> existing = repo.findByHash(hash);
        if (existing.isPresent()) {
            Files.deleteIfExists(temp);
            FileRecord er = existing.get();
            return new UploadResponse(true, "Duplicate found", hash, er.getPath(), null, originalName, size);
        }

        String topLevel = FileTypeUtils.topLevelFolder(originalName, mime);
        Path targetDir = root.resolve(topLevel);
        Files.createDirectories(targetDir);

        Path dest = targetDir.resolve(originalName).normalize();
        if (Files.exists(dest)) {
            String base = originalName, ext = "", stem = base;
            int dot = base.lastIndexOf('.');
            if (dot >= 0) { stem = base.substring(0, dot); ext = base.substring(dot); }
            dest = targetDir.resolve(stem + "-" + hash.substring(0, 8) + ext).normalize();
        }

        Files.createDirectories(dest.getParent());
        Files.move(temp, dest, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);

        FileRecord rec = new FileRecord(hash, dest.getFileName().toString(), dest.toString(), Files.size(dest), mime);
        repo.save(rec);

        return new UploadResponse(false, "File uploaded successfully", hash, null, dest.toString(), rec.getFilename(), rec.getSize());
    }

    public List<FileRecord> all() { return repo.findAll(); }

    public String locate(String hash) {
        return repo.findByHash(hash).map(FileRecord::getPath)
                .orElseThrow(() -> new IllegalArgumentException("No file with given hash"));
    }

    public boolean delete(String hash) {
        return repo.findByHash(hash).map(rec -> {
            try { Files.deleteIfExists(Path.of(rec.getPath())); } catch (Exception ignored) {}
            repo.delete(rec);
            return true;
        }).orElse(false);
    }

    public long clearAll() {
        repo.findAll().forEach(rec -> { try { Files.deleteIfExists(Path.of(rec.getPath())); } catch (Exception ignored) {} });
        long count = repo.count();
        repo.deleteAll();
        return count;
    }
}
