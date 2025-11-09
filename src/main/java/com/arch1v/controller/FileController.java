package com.arch1v.controller;

import com.arch1v.dto.UploadResponse;
import com.arch1v.model.FileRecord;
import com.arch1v.service.FileService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileController {

    private final FileService files;

    public FileController(FileService files) { this.files = files; }

    @PostMapping("/upload")
    public ResponseEntity<UploadResponse> upload(@RequestParam("file") MultipartFile file) throws Exception {
        return ResponseEntity.ok(files.upload(file));
    }

    @GetMapping("/all")
    public ResponseEntity<List<FileRecord>> all() { return ResponseEntity.ok(files.all()); }

    @GetMapping("/locate/{hash}")
    public ResponseEntity<Map<String, String>> locate(@PathVariable("hash") @NotBlank String hash) {
        String path = files.locate(hash);
        return ResponseEntity.ok(Map.of("hash", hash, "path", path));
    }

    @DeleteMapping("/delete/{hash}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable("hash") @NotBlank String hash) {
        boolean removed = files.delete(hash);
        return ResponseEntity.ok(Map.of("deleted", removed, "hash", hash));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Map<String, Object>> clear() {
        long removed = files.clearAll();
        return ResponseEntity.ok(Map.of("removed", removed));
    }
}
