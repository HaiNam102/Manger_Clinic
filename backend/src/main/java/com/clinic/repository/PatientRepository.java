package com.clinic.repository;

import com.clinic.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PatientRepository extends JpaRepository<Patient, UUID> {

    @Query("SELECT p FROM Patient p JOIN FETCH p.user WHERE p.user.id = :userId")
    Optional<Patient> findByUserId(@Param("userId") UUID userId);

    @Query("SELECT p FROM Patient p JOIN FETCH p.user WHERE p.user.email = :email")
    Optional<Patient> findByUserEmail(@Param("email") String email);

    @Query("SELECT p FROM Patient p JOIN FETCH p.user WHERE p.user.id = :userId")
    Optional<Patient> findByUserIdWithUser(@Param("userId") UUID userId);

    @Query("SELECT p FROM Patient p JOIN FETCH p.user WHERE p.id = :id")
    Optional<Patient> findByIdWithUser(@Param("id") UUID id);

    @Query("SELECT DISTINCT p FROM Patient p JOIN FETCH p.user JOIN p.medicalRecords mr WHERE mr.doctor.id = :doctorId")
    List<Patient> findDistinctPatientsByDoctorId(@Param("doctorId") UUID doctorId);
}
