package com.streamflix.modules.media.service;

import com.streamflix.config.StreamFlixProperties;
import io.minio.*;
import io.minio.http.Method;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.concurrent.TimeUnit;

@Service
public class MinioStorageService implements StorageService {

    private static final Logger log = LoggerFactory.getLogger(MinioStorageService.class);
    private final StreamFlixProperties properties;
    private MinioClient minioClient;

    public MinioStorageService(StreamFlixProperties properties) {
        this.properties = properties;
        initMinioClient();
    }

    private synchronized void initMinioClient() {
        try {
            this.minioClient = MinioClient.builder()
                    .endpoint(properties.getStorage().getEndpoint())
                    .credentials(properties.getStorage().getAccessKey(), properties.getStorage().getSecretKey())
                    .build();
        } catch (Exception e) {
            log.warn("Could not initialize MinIO client: {}", e.getMessage());
        }
    }

    @Override
    public void initializeBucket(String bucketName) {
        try {
            if (minioClient != null) {
                boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
                if (!found) {
                    minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
                    log.info("Successfully created MinIO bucket: {}", bucketName);
                }
            }
        } catch (Exception e) {
            log.warn("MinIO bucket initialization deferred or failed: {}", e.getMessage());
        }
    }

    @Override
    public void uploadFile(String bucketName, String objectName, byte[] data, String contentType) {
        try {
            if (minioClient != null) {
                initializeBucket(bucketName);
                try (InputStream is = new ByteArrayInputStream(data)) {
                    minioClient.putObject(
                            PutObjectArgs.builder()
                                    .bucket(bucketName)
                                    .object(objectName)
                                    .stream(is, data.length, -1)
                                    .contentType(contentType)
                                    .build()
                    );
                }
            }
        } catch (Exception e) {
            log.error("Failed to upload object {} to bucket {}: {}", objectName, bucketName, e.getMessage());
            throw new RuntimeException("MinIO upload failed: " + e.getMessage(), e);
        }
    }

    @Override
    public String generatePresignedUrl(String bucketName, String objectName, int expiryMinutes) {
        try {
            if (minioClient != null) {
                return minioClient.getPresignedObjectUrl(
                        GetPresignedObjectUrlArgs.builder()
                                .method(Method.GET)
                                .bucket(bucketName)
                                .object(objectName)
                                .expiry(expiryMinutes, TimeUnit.MINUTES)
                                .build()
                );
            }
        } catch (Exception e) {
            log.warn("MinIO presigned URL fallback generated: {}", e.getMessage());
        }
        return properties.getStorage().getEndpoint() + "/" + bucketName + "/" + objectName;
    }

    @Override
    public boolean objectExists(String bucketName, String objectName) {
        try {
            if (minioClient != null) {
                minioClient.statObject(StatObjectArgs.builder().bucket(bucketName).object(objectName).build());
                return true;
            }
        } catch (Exception e) {
            return false;
        }
        return false;
    }

    @Override
    public byte[] downloadFile(String bucketName, String objectName) {
        try {
            if (minioClient != null) {
                try (InputStream is = minioClient.getObject(GetObjectArgs.builder().bucket(bucketName).object(objectName).build())) {
                    return is.readAllBytes();
                }
            }
        } catch (Exception e) {
            log.error("Failed to download object {} from MinIO: {}", objectName, e.getMessage());
        }
        return new byte[0];
    }
}
