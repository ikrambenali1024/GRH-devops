package com.grh.backend.repository;

import com.grh.backend.entity.JobApplication;
import com.grh.backend.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByJobOfferId(Long jobOfferId);
    List<JobApplication> findByEmployeeId(Long employeeId);
    boolean existsByJobOfferIdAndEmployeeId(Long jobOfferI , Long employeeId);
}