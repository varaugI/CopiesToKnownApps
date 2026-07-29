package com.streamflix.modules.profiles.service;

import com.streamflix.common.exception.BusinessValidationException;
import com.streamflix.common.exception.ResourceNotFoundException;
import com.streamflix.modules.profiles.domain.Profile;
import com.streamflix.modules.profiles.dto.CreateProfileRequest;
import com.streamflix.modules.profiles.dto.ProfileResponse;
import com.streamflix.modules.profiles.dto.UpdateProfileRequest;
import com.streamflix.modules.profiles.repository.ProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public List<ProfileResponse> getAccountProfiles(String accountId) {
        return profileRepository.findByAccountId(accountId)
                .stream()
                .map(ProfileResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfileById(String accountId, String profileId) {
        Profile profile = profileRepository.findByIdAndAccountId(profileId, accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
        return new ProfileResponse(profile);
    }

    @Transactional
    public ProfileResponse createProfile(String accountId, CreateProfileRequest request) {
        long existingCount = profileRepository.countByAccountId(accountId);
        if (existingCount >= 5) {
            throw new BusinessValidationException("Maximum profile limit (5) reached for this account");
        }

        String name = request.getName().trim();
        if (profileRepository.existsByAccountIdAndName(accountId, name)) {
            throw new BusinessValidationException("A profile with this name already exists");
        }

        Profile profile = new Profile(
                accountId,
                name,
                request.getAvatarUrl(),
                request.getColorHex(),
                request.isKids(),
                request.getMaturityRating(),
                request.getPinCode()
        );

        Profile saved = profileRepository.save(profile);
        return new ProfileResponse(saved);
    }

    @Transactional
    public ProfileResponse updateProfile(String accountId, String profileId, UpdateProfileRequest request) {
        Profile profile = profileRepository.findByIdAndAccountId(profileId, accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        if (request.getName() != null && !request.getName().isBlank()) {
            String newName = request.getName().trim();
            if (!newName.equalsIgnoreCase(profile.getName()) && profileRepository.existsByAccountIdAndName(accountId, newName)) {
                throw new BusinessValidationException("A profile with this name already exists");
            }
            profile.setName(newName);
        }

        if (request.getAvatarUrl() != null) profile.setAvatarUrl(request.getAvatarUrl());
        if (request.getColorHex() != null) profile.setColorHex(request.getColorHex());
        profile.setKids(request.isKids());
        if (request.getMaturityRating() != null) profile.setMaturityRating(request.getMaturityRating());
        if (request.getPinCode() != null) profile.setPinCode(request.getPinCode());

        Profile updated = profileRepository.save(profile);
        return new ProfileResponse(updated);
    }

    @Transactional
    public void deleteProfile(String accountId, String profileId) {
        Profile profile = profileRepository.findByIdAndAccountId(profileId, accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        long count = profileRepository.countByAccountId(accountId);
        if (count <= 1) {
            throw new BusinessValidationException("Cannot delete the only remaining profile on the account");
        }

        profileRepository.delete(profile);
    }

    @Transactional(readOnly = true)
    public boolean verifyProfilePin(String accountId, String profileId, String pinCode) {
        Profile profile = profileRepository.findByIdAndAccountId(profileId, accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        if (profile.getPinCode() == null || profile.getPinCode().isBlank()) {
            return true; // No PIN configured
        }

        return profile.getPinCode().equals(pinCode);
    }
}
