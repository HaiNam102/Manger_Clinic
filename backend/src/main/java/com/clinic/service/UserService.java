package com.clinic.service;

import com.clinic.dto.request.PasswordChangeRequest;
import com.clinic.dto.request.ProfileUpdateRequest;
import com.clinic.dto.response.UserResponse;
import com.clinic.entity.User;
import com.clinic.entity.Doctor;
import com.clinic.entity.Patient;
import com.clinic.exception.AppException;
import com.clinic.exception.ErrorCode;
import com.clinic.repository.UserRepository;
import com.clinic.repository.DoctorRepository;
import com.clinic.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileService fileService;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    @Transactional
    public String uploadAvatar(UUID id, MultipartFile file) throws IOException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        String avatarUrl = fileService.uploadFile(file, "avatars");
        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);

        return avatarUrl;
    }

    @Transactional(readOnly = true)
    public UserResponse getMyProfile(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return mapToResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(UUID id, ProfileUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAvatarUrl(request.getAvatarUrl());

        return mapToResponse(userRepository.save(user));
    }

    @Transactional
    public void changePassword(UUID id, PasswordChangeRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED); // Or a more specific error
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private UserResponse mapToResponse(User user) {
        UUID doctorId = null;
        UUID patientId = null;

        if (user != null && user.getRole() != null && user.getRole().getName() != null) {
            String roleName = user.getRole().getName().name();
            if ("DOCTOR".equals(roleName)) {
                doctorId = doctorRepository.findByUserId(user.getId())
                        .map(Doctor::getId)
                        .orElse(null);
            } else if ("PATIENT".equals(roleName)) {
                patientId = patientRepository.findByUserId(user.getId())
                        .map(Patient::getId)
                        .orElse(null);
            }
        }

        return UserResponse.builder()
                .id(user != null ? user.getId() : null)
                .email(user != null ? user.getEmail() : null)
                .fullName(user != null ? user.getFullName() : null)
                .phone(user != null ? user.getPhone() : null)
                .avatarUrl(user != null ? user.getAvatarUrl() : null)
                .role(user != null && user.getRole() != null ? user.getRole().getName().name() : null)
                .isActive(user != null && user.getIsActive())
                .doctorId(doctorId)
                .patientId(patientId)
                .build();
    }
}
