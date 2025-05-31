package com.javaweb.api;

import com.javaweb.model.ListPoiDTO;
import com.javaweb.model.PoiDTO;
import com.javaweb.model.TourDTO;
import com.javaweb.model.TourPoiRequestDTO;
import com.javaweb.repository.PoiRepository;
import com.javaweb.repository.TourPoiRepository;
import com.javaweb.repository.TourRepository;
import com.javaweb.repository.entity.PoiEntity;
import com.javaweb.repository.entity.TourEntity;
import com.javaweb.service.PoiService;
import com.javaweb.service.TourService;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class NewAPI {
    @Autowired
    private TourService tourService;
    @Autowired
    private TourRepository tourRepository;
    @Autowired
    private TourPoiRepository tourPoiRepository;
    @Autowired
    private PoiRepository poiRepository;

    @GetMapping(value = "api/tour")
    public List<TourDTO> findAll(@RequestParam Map<String, Object> params,
                                 @RequestParam(name = "duration", required = false) List<String> durations) {
        List<TourDTO> tours = tourService.findAll(params, durations);
        return tours;

    }
    @Autowired
    private PoiService poiService;
    @GetMapping(value="api/listtour/{id}")
    public List<ListPoiDTO> findlist(@PathVariable int id){
    return poiService.getPoisByTourId(id);}


    @GetMapping(value="api/poi/{id}")
    public PoiDTO findpoi(@PathVariable int id){
        return poiService.findById(id);
    }

    @DeleteMapping(value="api/tour/{id}")
    public void delete(@PathVariable int id){
        tourRepository.deleteTourById(id);
    }

    @DeleteMapping(value = "api/poioftour/{id}")
    public void deletepoioftour(@PathVariable int id){
        tourPoiRepository.deleteById(id);
    }
    @DeleteMapping(value="api/onepoi/{id}")
    public void deleteonepoi(@PathVariable int id){
        poiRepository.deleteById(id);
    }



    @PostMapping(value="api/tour")
    public void saveOrUpdate(@RequestBody TourDTO dto) {
        tourService.saveOrUpdate(dto);
    }

    @PostMapping(value="api/assignpoi")
    public void assignPoisToTour(@RequestBody TourPoiRequestDTO tourPoiRequestDTO) {
        poiService.assignPoisToTour(tourPoiRequestDTO);
    }

    @RestController
    @RequestMapping("/api/poi")
    public class PoiController {

        @Autowired
        private PoiRepository poiRepository;

        @GetMapping("/all")
        public List<PoiDTO> findAllPoi() {
            List<PoiEntity> poiEntities = poiRepository.findAll();
            List<PoiDTO> poiDTOs = new ArrayList<>();

            for (PoiEntity entity : poiEntities) {
                PoiDTO dto = new PoiDTO(
                        entity.getId(),
                        entity.getName(),
                        entity.getTypename(),
                        entity.getAddress(),
                        entity.getDescription(),
                        entity.getImageUrl(),
                        entity.getOpenTime(),
                        entity.getCloseTime(),
                        entity.getPrice()
                );
                poiDTOs.add(dto);
            }

            return poiDTOs;
        }
    }


    @RestController
    @RequestMapping("/api/poi")
    public class PoisController {

        @Autowired
        private PoiRepository poiRepository;

        // Dùng query param: ?typename=Eco
        @GetMapping("/typename")
        public List<PoiDTO> getPoisByTypename(@RequestParam("typename") String typename) {
            List<PoiEntity> entities = poiRepository.findByTypename(typename);
            List<PoiDTO> dtos = new ArrayList<>();

            for (PoiEntity e : entities) {
                dtos.add(new PoiDTO(
                        e.getId(), e.getName(), e.getTypename(), e.getAddress(),
                        e.getDescription(), e.getImageUrl(), e.getOpenTime(),
                        e.getCloseTime(), e.getPrice()
                ));
            }

            return dtos;
        }
    }

    @PostMapping(value="api/onepoi")
    public void savepoi(@RequestBody PoiDTO poiDTO) {
        poiService.saveorupdate(poiDTO);
    }

    @GetMapping("api/onepoi/{id}")
    public PoiDTO getPoiById(@PathVariable int id) {
        // Tìm POI entity từ database
        Optional<PoiEntity> poiEntityOpt = poiRepository.findById(id);

        if (poiEntityOpt.isPresent()) {
            PoiEntity poiEntity = poiEntityOpt.get();

            // Tạo DTO và map data từ entity
            PoiDTO poiDTO = new PoiDTO();
            poiDTO.setId(poiEntity.getId());
            poiDTO.setName(poiEntity.getName());
            poiDTO.setAddress(poiEntity.getAddress());
            poiDTO.setDescription(poiEntity.getDescription());
            poiDTO.setPrice(poiEntity.getPrice());
            poiDTO.setOpenTime(poiEntity.getOpenTime());
            poiDTO.setCloseTime(poiEntity.getCloseTime());
            poiDTO.setTypename(poiEntity.getTypename());
            poiDTO.setImageUrl(poiEntity.getImageUrl());

            return poiDTO;
        } else {
            throw new RuntimeException("POI not found with id: " + id);
        }
    }

    @GetMapping(value="api/tour/{id}")  // Sửa "apl" thành "api"
    public TourDTO getTourById(@PathVariable int id) {
        // Tìm Tour entity từ database
        Optional<TourEntity> tourEntityOpt = tourRepository.findById(id); // Sửa tên biến

        if (tourEntityOpt.isPresent()) {
            TourEntity tourEntity = tourEntityOpt.get(); // Sửa conflict tên biến

            // Tạo TourDTO và map data từ entity
            TourDTO tourDTO = new TourDTO(); // Sửa thành TourDTO thay vì PoiDTO
            tourDTO.setId(tourEntity.getId());
            tourDTO.setName(tourEntity.getName());
            tourDTO.setAddress(tourEntity.getAddress());
            tourDTO.setDescription(tourEntity.getDescription());
            tourDTO.setPrice(tourEntity.getPrice());
            tourDTO.setDuration(tourEntity.getDuration()); // Thêm duration cho Tour
            tourDTO.setRating(tourEntity.getRating());     // Thêm rating cho Tour
            tourDTO.setImageUrl(tourEntity.getImageUrl());

            return tourDTO;
        } else {
            throw new RuntimeException("Tour not found with id: " + id);
        }
    }





}
