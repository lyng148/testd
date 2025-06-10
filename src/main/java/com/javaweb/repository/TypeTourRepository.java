package com.javaweb.repository;

import com.javaweb.repository.entity.TypeTourEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TypeTourRepository extends JpaRepository<TypeTourEntity, Integer> {
    TypeTourEntity findByName(String name);

    TypeTourEntity findByNameIgnoreCase(String typetour);
}
