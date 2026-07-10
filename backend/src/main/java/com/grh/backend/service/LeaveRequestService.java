package com.grh.backend.service;

import com.grh.backend.entity.*;
import com.grh.backend.repository.EmployeeRepository;
import com.grh.backend.repository.LeaveRequestRepository;
import com.grh.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }

    public LeaveRequest getLeaveRequestById(Long id) {
        return leaveRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Demande de congé non trouvée avec l'id : " + id));
    }

    public List<LeaveRequest> getLeaveRequestsByEmployee(Long employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId);
    }

    public List<LeaveRequest> getPendingRequests() {
        return leaveRequestRepository.findByStatus(LeaveStatus.PENDING);
    }

    public LeaveRequest createLeaveRequest(Long employeeId, LeaveRequest leaveRequest) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employé non trouvé avec l'id : " + employeeId));

        if (leaveRequest.getStartDate().isAfter(leaveRequest.getEndDate())) {
            throw new RuntimeException("La date de début doit être avant la date de fin");
        }

        long daysRequested = ChronoUnit.DAYS.between(
                leaveRequest.getStartDate(),
                leaveRequest.getEndDate()
        ) + 1;

        if (employee.getLeaveBalance() == null || employee.getLeaveBalance() < daysRequested) {
            throw new RuntimeException("Solde de congés insuffisant. Solde disponible : "
                    + (employee.getLeaveBalance() != null ? employee.getLeaveBalance() : 0) + " jours");
        }

        leaveRequest.setEmployee(employee);
        leaveRequest.setStatus(LeaveStatus.PENDING);
        leaveRequest.setRequestedAt(LocalDate.now());
        leaveRequest.setDaysRequested((int) daysRequested);
        return leaveRequestRepository.save(leaveRequest);
    }

    public LeaveRequest approveLeaveRequest(Long id) {
        LeaveRequest leaveRequest = getLeaveRequestById(id);
        leaveRequest.setStatus(LeaveStatus.APPROVED);

        Employee employee = leaveRequest.getEmployee();
        if (leaveRequest.getDaysRequested() != null) {
            employee.setLeaveBalance(employee.getLeaveBalance() - leaveRequest.getDaysRequested());
            employeeRepository.save(employee);
        }

        return leaveRequestRepository.save(leaveRequest);
    }

    public LeaveRequest rejectLeaveRequest(Long id) {
        LeaveRequest leaveRequest = getLeaveRequestById(id);
        leaveRequest.setStatus(LeaveStatus.REJECTED);
        return leaveRequestRepository.save(leaveRequest);
    }

    public void deleteLeaveRequest(Long id) {
        LeaveRequest leaveRequest = getLeaveRequestById(id);
        leaveRequestRepository.delete(leaveRequest);
    }

    public List<LeaveRequest> getLeavesByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User non trouvé"));
        if (user.getEmployee() == null) {
            return new ArrayList<>();
        }
        return leaveRequestRepository.findByEmployeeId(user.getEmployee().getId());
    }

    public LeaveRequest createLeaveByUsername(String username, LeaveRequest leaveRequest) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User non trouvé"));
        if (user.getEmployee() == null) {
            throw new RuntimeException("Aucun employé lié à ce compte");
        }
        return createLeaveRequest(user.getEmployee().getId(), leaveRequest);
    }
}