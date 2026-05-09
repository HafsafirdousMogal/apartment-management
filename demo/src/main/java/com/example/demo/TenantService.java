package com.example.demo;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TenantService {

    private final TenantRepository tenantRepository;
    private final ApartmentRepository apartmentRepository;

    public TenantService(TenantRepository tenantRepository,
                         ApartmentRepository apartmentRepository) {
        this.tenantRepository = tenantRepository;
        this.apartmentRepository = apartmentRepository;
    }

    // Save a new tenant
    public Tenant saveTenant(Long apartmentId, Tenant tenant) {
        Apartment apartment = apartmentRepository.findById(apartmentId)
                .orElseThrow(() -> new RuntimeException("Apartment not found with id: " + apartmentId));
        tenant.setApartment(apartment);
        apartment.setStatus("Occupied");
        apartmentRepository.save(apartment);
        return tenantRepository.save(tenant);
    }

    // Get all tenants
    public List<Tenant> getAllTenants() {
        return tenantRepository.findAll();
    }

    // Get one tenant
    public Tenant getTenantById(Long id) {
        return tenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found with id: " + id));
    }

    // Delete tenant
    public void deleteTenant(Long id) {
        tenantRepository.deleteById(id);
    }

}