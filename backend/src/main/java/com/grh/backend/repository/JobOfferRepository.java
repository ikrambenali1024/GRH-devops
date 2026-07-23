package com.grh.backend.repository;

import com.grh.backend.entity.JobOffer;
import com.grh.backend.entity.JobOfferStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {
    List<JobOffer> findByStatus(JobOfferStatus status);
}