package com.arch1v.service;

import com.arch1v.util.HashUtils;
import org.springframework.stereotype.Service;
import java.nio.file.Path;

@Service
public class DuplicateService {
    public String computeHash(Path path) throws Exception {
        return HashUtils.sha256Of(path);
    }
}
