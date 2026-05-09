package com.example.demo;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class RentPaymentService {

    private final RentPaymentRepository rentPaymentRepository;
    private final TenantRepository tenantRepository;
    private final ApartmentRepository apartmentRepository;

    public RentPaymentService(RentPaymentRepository rentPaymentRepository,
                              TenantRepository tenantRepository,
                              ApartmentRepository apartmentRepository) {
        this.rentPaymentRepository = rentPaymentRepository;
        this.tenantRepository = tenantRepository;
        this.apartmentRepository = apartmentRepository;
    }

    // Create a rent payment record
    public RentPayment createRentPayment(Long tenantId, Long apartmentId,
                                         RentPayment rentPayment) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        Apartment apartment = apartmentRepository.findById(apartmentId)
                .orElseThrow(() -> new RuntimeException("Apartment not found"));

        rentPayment.setTenant(tenant);
        rentPayment.setApartment(apartment);
        rentPayment.setStatus("Unpaid");
        return rentPaymentRepository.save(rentPayment);
    }

    // Mark rent as paid
    public RentPayment markAsPaid(Long id) {
        RentPayment payment = rentPaymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setStatus("Paid");
        payment.setPaidDate(LocalDate.now());
        return rentPaymentRepository.save(payment);
    }

    // Get all rent payments
    public List<RentPayment> getAllPayments() {
        return rentPaymentRepository.findAll();
    }

    // Get one payment
    public RentPayment getPaymentById(Long id) {
        return rentPaymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

}