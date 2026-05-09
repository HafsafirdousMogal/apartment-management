package com.example.demo;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class MaintenanceComplaintService {

    private final MaintenanceComplaintRepository complaintRepository;
    private final TenantRepository tenantRepository;
    private final ApartmentRepository apartmentRepository;

    public MaintenanceComplaintService(
            MaintenanceComplaintRepository complaintRepository,
            TenantRepository tenantRepository,
            ApartmentRepository apartmentRepository) {
        this.complaintRepository = complaintRepository;
        this.tenantRepository = tenantRepository;
        this.apartmentRepository = apartmentRepository;
    }

    // Raise a complaint
    public MaintenanceComplaint raiseComplaint(Long tenantId, Long apartmentId,
                                               MaintenanceComplaint complaint) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        Apartment apartment = apartmentRepository.findById(apartmentId)
                .orElseThrow(() -> new RuntimeException("Apartment not found"));

        complaint.setTenant(tenant);
        complaint.setApartment(apartment);
        complaint.setStatus("Pending");
        complaint.setCreatedAt(LocalDate.now());
        return complaintRepository.save(complaint);
    }

    // Update status
    public MaintenanceComplaint updateStatus(Long id, String status) {
        MaintenanceComplaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setStatus(status);
        if (status.equals("Resolved")) {
            complaint.setResolvedAt(LocalDate.now());
        }
        return complaintRepository.save(complaint);
    }

    // Get all complaints
    public List<MaintenanceComplaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    // Get one complaint
    public MaintenanceComplaint getComplaintById(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
    }
}
