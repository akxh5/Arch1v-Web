package com.arch1v.dto;

public class UploadResponse {
    private boolean duplicate;
    private String message;
    private String hash;
    private String existingPath;
    private String savedPath;
    private String filename;
    private long size;

    public UploadResponse() {}
    public UploadResponse(boolean duplicate, String message, String hash,
                          String existingPath, String savedPath,
                          String filename, long size) {
        this.duplicate = duplicate; this.message = message; this.hash = hash;
        this.existingPath = existingPath; this.savedPath = savedPath;
        this.filename = filename; this.size = size;
    }

    public boolean isDuplicate() { return duplicate; }
    public void setDuplicate(boolean duplicate) { this.duplicate = duplicate; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getHash() { return hash; }
    public void setHash(String hash) { this.hash = hash; }
    public String getExistingPath() { return existingPath; }
    public void setExistingPath(String existingPath) { this.existingPath = existingPath; }
    public String getSavedPath() { return savedPath; }
    public void setSavedPath(String savedPath) { this.savedPath = savedPath; }
    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }
    public long getSize() { return size; }
    public void setSize(long size) { this.size = size; }
}
