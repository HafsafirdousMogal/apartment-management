package com.example.demo;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ApartmentService {

    private final ApartmentRepository apartmentRepository;

    public ApartmentService(ApartmentRepository apartmentRepository) {
        this.apartmentRepository = apartmentRepository;
    }

    // Save a new apartment
    public Apartment saveApartment(Apartment apartment) {
        return apartmentRepository.save(apartment);
    }

    // Get all apartments
    public List<Apartment> getAllApartments() {
        return apartmentRepository.findAll();
    }

    // Get one apartment by ID
    public Apartment getApartmentById(Long id) {
        return apartmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Apartment not found with id: " + id));
    }

    // Update an apartment
    public Apartment updateApartment(Long id, Apartment updatedApartment) {
        Apartment existing = getApartmentById(id);
        existing.setFlatNumber(updatedApartment.getFlatNumber());
        existing.setFloor(updatedApartment.getFloor());
        existing.setType(updatedApartment.getType());
        existing.setRentAmount(updatedApartment.getRentAmount());
        existing.setStatus(updatedApartment.getStatus());
        return apartmentRepository.save(existing);
    }

    // Delete an apartment
    public void deleteApartment(Long id) {
        apartmentRepository.deleteById(id);
    }

}