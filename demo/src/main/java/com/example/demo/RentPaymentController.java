package com.example.demo;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/rent")
public class RentPaymentController {

    private final RentPaymentService rentPaymentService;

    public RentPaymentController(RentPaymentService rentPaymentService) {
        this.rentPaymentService = rentPaymentService;
    }

    // Create rent payment record
    @PostMapping("/tenant/{tenantId}/apartment/{apartmentId}")
    public RentPayment createPayment(@PathVariable Long tenantId,
                                     @PathVariable Long apartmentId,
                                     @RequestBody RentPayment rentPayment) {
        return rentPaymentService.createRentPayment(tenantId, apartmentId, rentPayment);
    }

    // Mark as paid
    @PutMapping("/{id}/pay")
    public RentPayment markAsPaid(@PathVariable Long id) {
        return rentPaymentService.markAsPaid(id);
    }

    // Get all payments
    @GetMapping
    public List<RentPayment> getAllPayments() {
        return rentPaymentService.getAllPayments();
    }

    // Get one payment
    @GetMapping("/{id}")
    public RentPayment getPaymentById(@PathVariable Long id) {
        return rentPaymentService.getPaymentById(id);
    }

}