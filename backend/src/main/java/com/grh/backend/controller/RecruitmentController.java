package com.grh.backend.controller;

import com.grh.backend.entity.JobApplication;
import com.grh.backend.entity.JobOffer;
import com.grh.backend.service.RecruitmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recruitment")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class RecruitmentController {

    private final RecruitmentService recruitmentService;

    @GetMapping("/offers")
    public ResponseEntity<List<JobOffer>> getAllOffers() {
        return ResponseEntity.ok(recruitmentService.getAllOffers());
    }

    @GetMapping("/offers/open")
    public ResponseEntity<List<JobOffer>> getOpenOffers() {
        return ResponseEntity.ok(recruitmentService.getOpenOffers());
    }

    @PostMapping("/offers")
    public ResponseEntity<JobOffer> createOffer(@RequestBody JobOffer jobOffer) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(recruitmentService.createOffer(jobOffer));
    }

    @PatchMapping("/offers/{id}/close")
    public ResponseEntity<JobOffer> closeOffer(@PathVariable Long id) {
        return ResponseEntity.ok(recruitmentService.closeOffer(id));
    }

    @DeleteMapping("/offers/{id}")
    public ResponseEntity<Void> deleteOffer(@PathVariable Long id) {
        recruitmentService.deleteOffer(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/offers/{offerId}/applications")
    public ResponseEntity<List<JobApplication>> getApplications(@PathVariable Long offerId) {
        return ResponseEntity.ok(recruitmentService.getApplicationsByOffer(offerId));
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<JobApplication>> getMyApplications(Principal principal) {
        return ResponseEntity.ok(recruitmentService.getMyApplications(principal.getName()));
    }

    @PostMapping("/offers/{offerId}/apply")
    public ResponseEntity<JobApplication> apply(
            Principal principal,
            @PathVariable Long offerId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(recruitmentService.apply(
                        principal.getName(),
                        offerId,
                        body.get("motivation")));
    }

    @PatchMapping("/applications/{id}/accept")
    public ResponseEntity<JobApplication> accept(@PathVariable Long id) {
        return ResponseEntity.ok(recruitmentService.acceptApplication(id));
    }

    @PatchMapping("/applications/{id}/reject")
    public ResponseEntity<JobApplication> reject(@PathVariable Long id) {
        return ResponseEntity.ok(recruitmentService.rejectApplication(id));
    }
}