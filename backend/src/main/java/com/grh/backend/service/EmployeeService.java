package com.grh.backend.service;

import com.grh.backend.entity.Employee;
import com.grh.backend.entity.EmployeeStatus;
import com.grh.backend.repository.EmployeeRepository;
import com.grh.backend.repository.DepartmentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    // Récupérer tous les employés
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // Récupérer un employé par id
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employé non trouvé avec l'id : " + id));
    }

    // Créer un nouvel employé
    public Employee createEmployee(Employee employee) {
        if (employeeRepository.existsByEmail(employee.getEmail())) {
            throw new RuntimeException("Un employé avec cet email existe déjà");
        }
        employee.setStatus(EmployeeStatus.ACTIVE);
        return employeeRepository.save(employee);
    }

    // Modifier un employé
    public Employee updateEmployee(Long id, Employee employeeDetails) {
        Employee employee = getEmployeeById(id);
        employee.setFirstName(employeeDetails.getFirstName());
        employee.setLastName(employeeDetails.getLastName());
        employee.setPhoneNumber(employeeDetails.getPhoneNumber());
        employee.setJobTitle(employeeDetails.getJobTitle());
        employee.setDepartment(employeeDetails.getDepartment());
        return employeeRepository.save(employee);
    }

    // Supprimer un employé
    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeById(id);
        employeeRepository.delete(employee);
    }

    // Récupérer les employés par département
    public List<Employee> getEmployeesByDepartment(Long departmentId) {
        return employeeRepository.findByDepartmentId(departmentId);
    }

    // Changer le statut d'un employé
    public Employee changeStatus(Long id, EmployeeStatus status) {
        Employee employee = getEmployeeById(id);
        employee.setStatus(status);
        return employeeRepository.save(employee);
    }
}