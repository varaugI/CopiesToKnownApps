package com.streamflix.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "streamflix")
public class StreamFlixProperties {

    private Storage storage = new Storage();
    private Security security = new Security();

    public Storage getStorage() {
        return storage;
    }

    public void setStorage(Storage storage) {
        this.storage = storage;
    }

    public Security getSecurity() {
        return security;
    }

    public void setSecurity(Security security) {
        this.security = security;
    }

    public static class Storage {
        private String endpoint = "http://localhost:9000";
        private String bucket = "streamflix-media";
        private String accessKey = "minioadmin";
        private String secretKey = "minioadmin";

        public String getEndpoint() {
            return endpoint;
        }

        public void setEndpoint(String endpoint) {
            this.endpoint = endpoint;
        }

        public String getBucket() {
            return bucket;
        }

        public void setBucket(String bucket) {
            this.bucket = bucket;
        }

        public String getAccessKey() {
            return accessKey;
        }

        public void setAccessKey(String accessKey) {
            this.accessKey = accessKey;
        }

        public String getSecretKey() {
            return secretKey;
        }

        public void setSecretKey(String secretKey) {
            this.secretKey = secretKey;
        }
    }

    public static class Security {
        private String jwtSecret = "streamflix_default_super_secret_jwt_key_2026_learning_environment";
        private int accessTokenExpirationMinutes = 15;
        private int refreshTokenExpirationDays = 7;

        public String getJwtSecret() {
            return jwtSecret;
        }

        public void setJwtSecret(String jwtSecret) {
            this.jwtSecret = jwtSecret;
        }

        public int getAccessTokenExpirationMinutes() {
            return accessTokenExpirationMinutes;
        }

        public void setAccessTokenExpirationMinutes(int accessTokenExpirationMinutes) {
            this.accessTokenExpirationMinutes = accessTokenExpirationMinutes;
        }

        public int getRefreshTokenExpirationDays() {
            return refreshTokenExpirationDays;
        }

        public void setRefreshTokenExpirationDays(int refreshTokenExpirationDays) {
            this.refreshTokenExpirationDays = refreshTokenExpirationDays;
        }
    }
}
