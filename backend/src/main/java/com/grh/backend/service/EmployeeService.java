package com.grh.backend.service;

import com.grh.backend.entity.Employee;
import com.grh.backend.entity.EmployeeStatus;
import com.grh.backend.entity.User;
import com.grh.backend.repository.DepartmentRepository;
import com.grh.backend.repository.EmployeeRepository;
import com.grh.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import com.grh.backend.entity.User;
import java.security.Principal;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employé non trouvé avec l'id : " + id));
    }

    public Employee createEmployee(Employee employee) {
        if (employeeRepository.existsByEmail(employee.getEmail())) {
            throw new RuntimeException("Un employé avec cet email existe déjà");
        }
        employee.setStatus(EmployeeStatus.ACTIVE);
        employee.setLeaveBalance(30);
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Long id, Employee employeeDetails) {
        Employee employee = getEmployeeById(id);
        employee.setFirstName(employeeDetails.getFirstName());
        employee.setLastName(employeeDetails.getLastName());
        employee.setPhoneNumber(employeeDetails.getPhoneNumber());
        employee.setJobTitle(employeeDetails.getJobTitle());
        employee.setStatus(employeeDetails.getStatus());
        employee.setDepartment(employeeDetails.getDepartment());
        return employeeRepository.save(employee);
    }

    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeById(id);

        List<User> users = userRepository.findByEmployeeId(id);
        for (User user : users) {
            user.setEmployee(null);
            userRepository.save(user);
        }

        employeeRepository.delete(employee);
    }

    public List<Employee> getEmployeesByDepartment(Long departmentId) {
        return employeeRepository.findByDepartmentId(departmentId);
    }

    public Employee changeStatus(Long id, EmployeeStatus status) {
        Employee employee = getEmployeeById(id);
        employee.setStatus(status);
        return employeeRepository.save(employee);
    }
    public Employee getEmployeeByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User non trouvé"));
        if (user.getEmployee() == null) {
            throw new RuntimeException("Aucun employé lié à ce compte");
        }
        return user.getEmployee();
    }
}