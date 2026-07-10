package com.grh.backend.service;

import com.grh.backend.entity.*;
import com.grh.backend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecruitmentService {

    private final JobOfferRepository jobOfferRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    // --- Job Offers ---
    public List<JobOffer> getAllOffers() {
        return jobOfferRepository.findAll();
    }

    public List<JobOffer> getOpenOffers() {
        return jobOfferRepository.findByStatus(JobOfferStatus.OPEN);
    }

    public JobOffer createOffer(JobOffer jobOffer) {
        jobOffer.setStatus(JobOfferStatus.OPEN);
        jobOffer.setCreatedAt(LocalDate.now());
        return jobOfferRepository.save(jobOffer);
    }

    public JobOffer closeOffer(Long id) {
        JobOffer offer = jobOfferRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Offre non trouvée"));
        offer.setStatus(JobOfferStatus.CLOSED);
        return jobOfferRepository.save(offer);
    }

    public void deleteOffer(Long id) {
        jobOfferRepository.deleteById(id);
    }

    // --- Applications ---
    public List<JobApplication> getApplicationsByOffer(Long offerId) {
        return jobApplicationRepository.findByJobOfferId(offerId);
    }

    public List<JobApplication> getMyApplications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User non trouvé"));
        if (user.getEmployee() == null) return List.of();
        return jobApplicationRepository.findByEmployeeId(user.getEmployee().getId());
    }

    public JobApplication apply(String username, Long offerId, String motivation) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User non trouvé"));

        if (user.getEmployee() == null) {
            throw new RuntimeException("Aucun employé lié à ce compte");
        }

        if (jobApplicationRepository.existsByJobOfferIdAndEmployeeId(
                offerId, user.getEmployee().getId())) {
            throw new RuntimeException("Vous avez déjà postulé à cette offre");
        }

        JobOffer offer = jobOfferRepository.findById(offerId)
                .orElseThrow(() -> new EntityNotFoundException("Offre non trouvée"));

        if (offer.getStatus() != JobOfferStatus.OPEN) {
            throw new RuntimeException("Cette offre n'est plus disponible");
        }

        JobApplication application = JobApplication.builder()
                .jobOffer(offer)
                .employee(user.getEmployee())
                .status(ApplicationStatus.PENDING)
                .motivation(motivation)
                .appliedAt(LocalDate.now())
                .build();

        return jobApplicationRepository.save(application);
    }

    public JobApplication acceptApplication(Long id) {
        JobApplication app = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Candidature non trouvée"));
        app.setStatus(ApplicationStatus.ACCEPTED);
        return jobApplicationRepository.save(app);
    }

    public JobApplication rejectApplication(Long id) {
        JobApplication app = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Candidature non trouvée"));
        app.setStatus(ApplicationStatus.REJECTED);
        return jobApplicationRepository.save(app);
    }
}