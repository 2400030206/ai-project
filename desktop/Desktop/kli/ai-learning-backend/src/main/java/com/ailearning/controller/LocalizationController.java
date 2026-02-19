package com.ailearning.controller;

import com.ailearning.service.LocalizationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/localization")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class LocalizationController {

    private final LocalizationService localizationService;

    @GetMapping("/languages")
    public ResponseEntity<Map<String, String>> getSupportedLanguages() {
        Map<String, String> languages = localizationService.getSupportedLanguages();
        return ResponseEntity.ok(languages);
    }

    @GetMapping("/language/{language}")
    public ResponseEntity<String> getLanguageName(@PathVariable String language) {
        if (!localizationService.isSupportedLanguage(language)) {
            return ResponseEntity.badRequest().build();
        }
        String name = localizationService.getLanguageName(language);
        return ResponseEntity.ok(name);
    }

    @GetMapping("/translations")
    public ResponseEntity<Map<String, String>> getTranslations(
            @RequestParam(required = false, defaultValue = "en") String language) {
        if (!localizationService.isSupportedLanguage(language)) {
            language = "en";
        }
        Map<String, String> translations = localizationService.getTranslations(language);
        return ResponseEntity.ok(translations);
    }

    @GetMapping("/translate/{key}")
    public ResponseEntity<String> translate(
            @PathVariable String key,
            @RequestParam(required = false, defaultValue = "en") String language) {
        if (!localizationService.isSupportedLanguage(language)) {
            language = "en";
        }
        String translation = localizationService.translate(key, language);
        return ResponseEntity.ok(translation);
    }

    @GetMapping("/detect")
    public ResponseEntity<String> detectLanguage(
            @RequestHeader(required = false, value = "Accept-Language") String acceptLanguage) {
        String detected = localizationService.detectLanguage(acceptLanguage);
        return ResponseEntity.ok(detected);
    }

    @PostMapping("/validate/{language}")
    public ResponseEntity<Boolean> validateLanguage(@PathVariable String language) {
        boolean isSupported = localizationService.isSupportedLanguage(language);
        return ResponseEntity.ok(isSupported);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("✓ Localization service is running");
    }
}
