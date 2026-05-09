package com.example.demo;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class MaintenanceChargeService {

    private final MaintenanceChargeRepository chargeRepository;
    private final TenantRepository tenantRepository;
    private final ApartmentRepository apartmentRepository;

    public MaintenanceChargeService(
            MaintenanceChargeRepository chargeRepository,
            TenantRepository tenantRepository,
            ApartmentRepository apartmentRepository) {
        this.chargeRepository = chargeRepository;
        this.tenantRepository = tenantRepository;
        this.apartmentRepository = apartmentRepository;
    }

    // Create maintenance charge
    public MaintenanceCharge createCharge(Long tenantId, Long apartmentId,
                                          MaintenanceCharge charge) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        Apartment apartment = apartmentRepository.findById(apartmentId)
                .orElseThrow(() -> new RuntimeException("Apartment not found"));

        charge.setTenant(tenant);
        charge.setApartment(apartment);
        charge.setStatus("Unpaid");
        return chargeRepository.save(charge);
    }

    // Mark as paid
    public MaintenanceCharge markAsPaid(Long id) {
        MaintenanceCharge charge = chargeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Charge not found"));
        charge.setStatus("Paid");
        charge.setPaidAt(LocalDate.now());
        return chargeRepository.save(charge);
    }

    // Get all charges
    public List<MaintenanceCharge> getAllCharges() {
        return chargeRepository.findAll();
    }

    // Get one charge
    public MaintenanceCharge getChargeById(Long id) {
        return chargeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Charge not found"));
    }

    // Delete charge
    public void deleteCharge(Long id) {
        chargeRepository.deleteById(id);
    }

}