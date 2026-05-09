package com.example.demo;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/complaints")
public class MaintenanceComplaintController {

    private final MaintenanceComplaintService complaintService;

    public MaintenanceComplaintController(
            MaintenanceComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    // Raise a complaint
    @PostMapping("/tenant/{tenantId}/apartment/{apartmentId}")
    public MaintenanceComplaint raiseComplaint(
            @PathVariable Long tenantId,
            @PathVariable Long apartmentId,
            @RequestBody MaintenanceComplaint complaint) {
        return complaintService.raiseComplaint(tenantId, apartmentId, complaint);
    }

    // Update status
    @PutMapping("/{id}/status")
    public MaintenanceComplaint updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return complaintService.updateStatus(id, status);
    }

    // Get all complaints
    @GetMapping
    public List<MaintenanceComplaint> getAllComplaints() {
        return complaintService.getAllComplaints();
    }

    // Get one complaint
    @GetMapping("/{id}")
    public MaintenanceComplaint getComplaintById(@PathVariable Long id) {
        return complaintService.getComplaintById(id);
    }

}