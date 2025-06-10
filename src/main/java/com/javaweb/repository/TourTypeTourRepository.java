package com.javaweb.repository;

import com.javaweb.repository.entity.TourTypeTourEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TourTypeTourRepository extends JpaRepository<TourTypeTourEntity,Integer> {
    // ✅ Đúng theo tên biến trong entity:
    boolean existsByTour_IdAndTypeTour_Id(int tourId, int typeTourId);

    void deleteAllByTour_Id(int id);
}
