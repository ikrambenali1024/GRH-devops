package com.grh.backend.service;

import com.grh.backend.entity.Attendance;
import com.grh.backend.entity.AttendanceStatus;
import com.grh.backend.repository.AttendanceRepository;
import com.grh.backend.repository.EmployeeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    public List<Attendance> getAllAttendances() {
        return attendanceRepository.findAll();
    }

    public List<Attendance> getAttendancesByEmployee(Long employeeId) {
        return attendanceRepository.findByEmployeeId(employeeId);
    }

    public List<Attendance> getAttendancesByDate(LocalDate date) {
        return attendanceRepository.findByAttendanceDate(date);
    }

    public Attendance checkIn(Long employeeId) {
        var employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employé non trouvé avec l'id : " + employeeId));

        Attendance attendance = Attendance.builder()
                .employee(employee)
                .attendanceDate(LocalDate.now())
                .checkIn(LocalTime.now())
                .status(AttendanceStatus.PRESENT)
                .build();

        return attendanceRepository.save(attendance);
    }

    public Attendance checkOut(Long employeeId) {
        LocalDate today = LocalDate.now();
        List<Attendance> todayAttendances = attendanceRepository
                .findByEmployeeIdAndAttendanceDate(employeeId, today);

        if (todayAttendances.isEmpty()) {
            throw new RuntimeException("Aucun pointage d'entrée trouvé pour aujourd'hui");
        }

        Attendance attendance = todayAttendances.get(0);
        attendance.setCheckOut(LocalTime.now());
        return attendanceRepository.save(attendance);
    }

    public Attendance updateStatus(Long id, AttendanceStatus status) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pointage non trouvé avec l'id : " + id));
        attendance.setStatus(status);
        return attendanceRepository.save(attendance);
    }
}