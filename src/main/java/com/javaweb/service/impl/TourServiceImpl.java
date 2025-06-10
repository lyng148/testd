package com.javaweb.service.impl;

import com.javaweb.builder.TourSearchBuilder;
import com.javaweb.converter.TourSearchBuilderConverter;
import com.javaweb.model.TourDTO;
import com.javaweb.repository.TourRepository;
import com.javaweb.repository.TourTypeTourRepository;
import com.javaweb.repository.TypeTourRepository;
import com.javaweb.repository.entity.TourEntity;
import com.javaweb.repository.entity.TourTypeTourEntity;
import com.javaweb.repository.entity.TypeTourEntity;
import com.javaweb.service.TourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class TourServiceImpl implements TourService {

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private TourSearchBuilderConverter tourSearchBuilderConverter;

    @Autowired
    private TypeTourRepository typeTourRepository;

    @Autowired
    private TourTypeTourRepository tourTypeTourRepository;

    @Override
    public List<TourDTO> findAll(Map<String, Object> params, List<String> durations) {
        TourSearchBuilder tourSearchBuilder = tourSearchBuilderConverter.toTourSearchBuilder(params, durations);
        List<TourEntity> tourEntities = tourRepository.findAll(tourSearchBuilder);
        List<TourDTO> result = new ArrayList<>();

        for (TourEntity entity : tourEntities) {
            TourDTO dto = new TourDTO();
            dto.setId(entity.getId());
            dto.setName(entity.getName());
            dto.setAddress(entity.getAddress());
            dto.setDescription(entity.getDescription());
            dto.setPrice(entity.getPrice());
            dto.setDuration(entity.getDuration());
            dto.setImageUrl(entity.getImageUrl());
            dto.setRating(entity.getRating());
            result.add(dto);
        }

        return result;
    }
@Transactional
    @Override
    public void saveOrUpdate(TourDTO tourDTO) {
        TourEntity tourEntity;

        if (tourDTO.getId() != null) {
            tourEntity = tourRepository.findById(tourDTO.getId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Tour ID: " + tourDTO.getId()));
        } else {
            tourEntity = new TourEntity();
        }

        // Gán thông tin cơ bản
        tourEntity.setName(tourDTO.getName());
        tourEntity.setAddress(tourDTO.getAddress());
        tourEntity.setDescription(tourDTO.getDescription());
        tourEntity.setPrice(tourDTO.getPrice());
        tourEntity.setDuration(tourDTO.getDuration());
        tourEntity.setImageUrl(tourDTO.getImageUrl());
        tourEntity.setRating(tourDTO.getRating());

        // Lưu tour vào DB
        tourEntity = tourRepository.save(tourEntity);
        System.out.println(">>> Typetour từ DTO: [" + tourDTO.getTypetour() + "]");


        if (tourDTO.getTypetour() != null && !tourDTO.getTypetour().isEmpty()) {
            TypeTourEntity typeTourEntity = typeTourRepository.findByNameIgnoreCase(tourDTO.getTypetour());

            System.out.println(">>> Kết quả tìm trong DB: " + (typeTourEntity != null ? typeTourEntity.getName() : "null"));


            if (typeTourEntity == null) {
                typeTourEntity = new TypeTourEntity();
                typeTourEntity.setName(tourDTO.getTypetour());
                typeTourEntity = typeTourRepository.save(typeTourEntity);
            }

            // Dù là update hay tạo mới → xóa liên kết cũ (nếu có)
            tourTypeTourRepository.deleteAllByTour_Id(tourEntity.getId());

            // Tạo liên kết mới
            TourTypeTourEntity tourTypeTour = new TourTypeTourEntity();
            tourTypeTour.setTour(tourEntity);
            tourTypeTour.setTypeTour(typeTourEntity);
            tourTypeTourRepository.save(tourTypeTour);
        }

    }

}
