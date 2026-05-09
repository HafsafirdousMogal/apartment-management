package com.example.demo;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/maintenance-charges")
public class MaintenanceChargeController {

    private final MaintenanceChargeService chargeService;

    public MaintenanceChargeController(MaintenanceChargeService chargeService) {
        this.chargeService = chargeService;
    }

    // Create charge
    @PostMapping("/tenant/{tenantId}/apartment/{apartmentId}")
    public MaintenanceCharge createCharge(
            @PathVariable Long tenantId,
            @PathVariable Long apartmentId,
            @RequestBody MaintenanceCharge charge) {
        return chargeService.createCharge(tenantId, apartmentId, charge);
    }

    // Mark as paid
    @PutMapping("/{id}/pay")
    public MaintenanceCharge markAsPaid(@PathVariable Long id) {
        return chargeService.markAsPaid(id);
    }

    // Get all
    @GetMapping
    public List<MaintenanceCharge> getAllCharges() {
        return chargeService.getAllCharges();
    }

    // Get one
    @GetMapping("/{id}")
    public MaintenanceCharge getChargeById(@PathVariable Long id) {
        return chargeService.getChargeById(id);
    }

    // Delete
    @DeleteMapping("/{id}")
    public String deleteCharge(@PathVariable Long id) {
        chargeService.deleteCharge(id);
        return "Maintenance charge deleted successfully!";
    }

}