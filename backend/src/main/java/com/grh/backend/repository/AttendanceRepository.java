package com.grh.backend.repository;

import com.grh.backend.entity.Attendance;
import com.grh.backend.entity.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByEmployeeId(Long employeeId);
    List<Attendance> findByAttendanceDate(LocalDate date);
    List<Attendance> findByEmployeeIdAndAttendanceDate(Long employeeId, LocalDate date);
    List<Attendance> findByStatus(AttendanceStatus status);
}