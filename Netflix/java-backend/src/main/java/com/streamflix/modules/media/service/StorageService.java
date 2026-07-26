package com.streamflix.modules.media.service;

public interface StorageService {
    void initializeBucket(String bucketName);
    void uploadFile(String bucketName, String objectName, byte[] data, String contentType);
    String generatePresignedUrl(String bucketName, String objectName, int expiryMinutes);
    boolean objectExists(String bucketName, String objectName);
    byte[] downloadFile(String bucketName, String objectName);
}
