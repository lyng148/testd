package com.javaweb.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Cho phép các domain sau truy cập API
        config.setAllowedOrigins(Arrays.asList(
            "https://quanhne.id.vn",
            "http://localhost:3000",
            "http://localhost:8080",
            "http://127.0.0.1:5500",
            "https://gr1-lzkf.onrender.com"
        ));
        
        // Cho phép tất cả các HTTP methods
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Cho phép tất cả headers
        config.setAllowedHeaders(Arrays.asList("*"));
        
        // Cho phép gửi credentials (cookies, authorization headers)
        config.setAllowCredentials(true);
        
        // Thời gian cache preflight request (seconds)
        config.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
