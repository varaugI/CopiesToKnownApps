package com.streamflix.modules.profiles.controller;

import com.streamflix.common.dto.ApiResponse;
import com.streamflix.common.filter.RequestIdFilter;
import com.streamflix.modules.profiles.dto.CreateProfileRequest;
import com.streamflix.modules.profiles.dto.ProfileResponse;
import com.streamflix.modules.profiles.dto.UpdateProfileRequest;
import com.streamflix.modules.profiles.dto.VerifyPinRequest;
import com.streamflix.modules.profiles.service.ProfileService;
import jakarta.validation.Valid;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProfileResponse>>> getProfiles(
            @AuthenticationPrincipal String accountId
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        List<ProfileResponse> profiles = profileService.getAccountProfiles(accountId);
        return ResponseEntity.ok(ApiResponse.of(profiles, requestId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfileById(
            @AuthenticationPrincipal String accountId,
            @PathVariable String id
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        ProfileResponse profile = profileService.getProfileById(accountId, id);
        return ResponseEntity.ok(ApiResponse.of(profile, requestId));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> createProfile(
            @AuthenticationPrincipal String accountId,
            @Valid @RequestBody CreateProfileRequest request
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        ProfileResponse profile = profileService.createProfile(accountId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(profile, requestId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(
            @AuthenticationPrincipal String accountId,
            @PathVariable String id,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        ProfileResponse profile = profileService.updateProfile(accountId, id, request);
        return ResponseEntity.ok(ApiResponse.of(profile, requestId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, String>>> deleteProfile(
            @AuthenticationPrincipal String accountId,
            @PathVariable String id
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        profileService.deleteProfile(accountId, id);
        return ResponseEntity.ok(ApiResponse.of(Map.of("message", "Profile deleted successfully"), requestId));
    }

    @PostMapping("/{id}/verify-pin")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> verifyPin(
            @AuthenticationPrincipal String accountId,
            @PathVariable String id,
            @Valid @RequestBody VerifyPinRequest request
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        boolean isValid = profileService.verifyProfilePin(accountId, id, request.getPinCode());
        return ResponseEntity.ok(ApiResponse.of(Map.of("valid", isValid), requestId));
    }
}
