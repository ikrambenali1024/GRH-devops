package com.grh.backend.controller;

import com.grh.backend.entity.Attendance;
import com.grh.backend.entity.AttendanceStatus;
import com.grh.backend.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendances")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    public ResponseEntity<List<Attendance>> getAllAttendances() {
        return ResponseEntity.ok(attendanceService.getAllAttendances());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Attendance>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(attendanceService.getAttendancesByEmployee(employeeId));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Attendance>> getByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getAttendancesByDate(date));
    }

    @PostMapping("/checkin/{employeeId}")
    public ResponseEntity<Attendance> checkIn(@PathVariable Long employeeId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(attendanceService.checkIn(employeeId));
    }

    @PatchMapping("/checkout/{employeeId}")
    public ResponseEntity<Attendance> checkOut(@PathVariable Long employeeId) {
        return ResponseEntity.ok(attendanceService.checkOut(employeeId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Attendance> updateStatus(
            @PathVariable Long id,
            @RequestParam AttendanceStatus status) {
        return ResponseEntity.ok(attendanceService.updateStatus(id, status));
    }
}