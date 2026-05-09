package com.example.demo;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "maintenance_charges")
public class MaintenanceCharge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;
    private String month;
    private String status; // Paid, Unpaid
    private LocalDate dueAt;
    private LocalDate paidAt;

    @ManyToOne
    @JoinColumn(name = "tenant_id")
    private Tenant tenant;

    @ManyToOne
    @JoinColumn(name = "apartment_id")
    private Apartment apartment;

}