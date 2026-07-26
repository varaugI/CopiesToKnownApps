package com.streamflix.common.dto;

import java.time.Instant;

public class ApiResponse<T> {
    private T data;
    private String requestId;
    private Instant timestamp;
    private String nextCursor;
    private Boolean hasMore;

    public ApiResponse() {
        this.timestamp = Instant.now();
    }

    public ApiResponse(T data, String requestId) {
        this();
        this.data = data;
        this.requestId = requestId;
    }

    public ApiResponse(T data, String requestId, String nextCursor, Boolean hasMore) {
        this(data, requestId);
        this.nextCursor = nextCursor;
        this.hasMore = hasMore;
    }

    public T getData() { return data; }
    public void setData(T data) { this.data = data; }

    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public String getNextCursor() { return nextCursor; }
    public void setNextCursor(String nextCursor) { this.nextCursor = nextCursor; }

    public Boolean getHasMore() { return hasMore; }
    public void setHasMore(Boolean hasMore) { this.hasMore = hasMore; }

    public static <T> ApiResponse<T> of(T data, String requestId) {
        return new ApiResponse<>(data, requestId);
    }

    public static <T> ApiResponse<T> paginated(T data, String requestId, String nextCursor, boolean hasMore) {
        return new ApiResponse<>(data, requestId, nextCursor, hasMore);
    }
}
