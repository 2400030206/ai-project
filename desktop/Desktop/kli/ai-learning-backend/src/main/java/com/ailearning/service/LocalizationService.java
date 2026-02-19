package com.ailearning.service;

import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Service
@Slf4j
public class LocalizationService {

    private final Gson gson = new Gson();
    
    private static final Map<String, String> SUPPORTED_LANGUAGES = new HashMap<>();
    
    static {
        SUPPORTED_LANGUAGES.put("en", "English");
        SUPPORTED_LANGUAGES.put("es", "Español");
        SUPPORTED_LANGUAGES.put("fr", "Français");
        SUPPORTED_LANGUAGES.put("de", "Deutsch");
        SUPPORTED_LANGUAGES.put("hi", "हिन्दी");
        SUPPORTED_LANGUAGES.put("ja", "日本語");
        SUPPORTED_LANGUAGES.put("zh", "中文");
        SUPPORTED_LANGUAGES.put("pt", "Português");
        SUPPORTED_LANGUAGES.put("ru", "Русский");
        SUPPORTED_LANGUAGES.put("ar", "العربية");
    }

    private static final Map<String, Map<String, String>> LOCALIZATION_KEYS = new HashMap<>();

    static {
        // English
        Map<String, String> en = new HashMap<>();
        en.put("quiz.title", "Quiz");
        en.put("quiz.what_is", "What is");
        en.put("quiz.which", "Which");
        en.put("quiz.how", "How does");
        en.put("quiz.why", "Why is");
        en.put("question", "Question");
        en.put("answer", "Answer");
        en.put("submit", "Submit");
        en.put("correct", "Correct!");
        en.put("incorrect", "Incorrect");
        en.put("score", "Score");
        en.put("upload_pdf", "Upload PDF");
        en.put("upload_video", "Upload Video");
        en.put("select_language", "Select Language");
        en.put("video_title", "Video Title");
        en.put("video_description", "Video Description");
        en.put("supported_formats", "Supported formats: MP4, AVI, MOV, MKV, WebM");
        en.put("max_size", "Maximum size: 500MB");
        LOCALIZATION_KEYS.put("en", en);

        // Spanish
        Map<String, String> es = new HashMap<>();
        es.put("quiz.title", "Cuestionario");
        es.put("quiz.what_is", "¿Qué es");
        es.put("quiz.which", "¿Cuál");
        es.put("quiz.how", "¿Cómo");
        es.put("quiz.why", "¿Por qué");
        es.put("question", "Pregunta");
        es.put("answer", "Respuesta");
        es.put("submit", "Enviar");
        es.put("correct", "¡Correcto!");
        es.put("incorrect", "Incorrecto");
        es.put("score", "Puntuación");
        es.put("upload_pdf", "Cargar PDF");
        es.put("upload_video", "Cargar Video");
        es.put("select_language", "Seleccionar Idioma");
        es.put("video_title", "Título del Video");
        es.put("video_description", "Descripción del Video");
        LOCALIZATION_KEYS.put("es", es);

        // French
        Map<String, String> fr = new HashMap<>();
        fr.put("quiz.title", "Quiz");
        fr.put("quiz.what_is", "Qu'est-ce que");
        fr.put("quiz.which", "Lequel");
        fr.put("quiz.how", "Comment");
        fr.put("quiz.why", "Pourquoi");
        fr.put("question", "Question");
        fr.put("answer", "Réponse");
        fr.put("submit", "Soumettre");
        fr.put("correct", "Correct!");
        fr.put("incorrect", "Incorrect");
        fr.put("score", "Score");
        fr.put("upload_pdf", "Télécharger PDF");
        fr.put("upload_video", "Télécharger Vidéo");
        fr.put("select_language", "Sélectionner la Langue");
        fr.put("video_title", "Titre de la Vidéo");
        fr.put("video_description", "Description de la Vidéo");
        LOCALIZATION_KEYS.put("fr", fr);

        // German
        Map<String, String> de = new HashMap<>();
        de.put("quiz.title", "Quiz");
        de.put("quiz.what_is", "Was ist");
        de.put("quiz.which", "Welche");
        de.put("quiz.how", "Wie");
        de.put("quiz.why", "Warum");
        de.put("question", "Frage");
        de.put("answer", "Antwort");
        de.put("submit", "Absenden");
        de.put("correct", "Richtig!");
        de.put("incorrect", "Falsch");
        de.put("score", "Punktzahl");
        de.put("upload_pdf", "PDF hochladen");
        de.put("upload_video", "Video hochladen");
        de.put("select_language", "Sprache wählen");
        de.put("video_title", "Videotitel");
        de.put("video_description", "Videobeschreibung");
        LOCALIZATION_KEYS.put("de", de);

        // Hindi
        Map<String, String> hi = new HashMap<>();
        hi.put("quiz.title", "क्विज़");
        hi.put("quiz.what_is", "क्या है");
        hi.put("quiz.which", "कौन सा");
        hi.put("quiz.how", "कैसे");
        hi.put("quiz.why", "क्यों");
        hi.put("question", "प्रश्न");
        hi.put("answer", "उत्तर");
        hi.put("submit", "जमा करें");
        hi.put("correct", "सही!");
        hi.put("incorrect", "गलत");
        hi.put("score", "स्कोर");
        hi.put("upload_pdf", "PDF अपलोड करें");
        hi.put("upload_video", "वीडियो अपलोड करें");
        hi.put("select_language", "भाषा चुनें");
        hi.put("video_title", "वीडियो शीर्षक");
        hi.put("video_description", "वीडियो विवरण");
        LOCALIZATION_KEYS.put("hi", hi);
    }

    public boolean isSupportedLanguage(String language) {
        return SUPPORTED_LANGUAGES.containsKey(language);
    }

    public String getLanguageName(String languageCode) {
        return SUPPORTED_LANGUAGES.getOrDefault(languageCode, "Unknown");
    }

    public Map<String, String> getSupportedLanguages() {
        return new HashMap<>(SUPPORTED_LANGUAGES);
    }

    public String translate(String key, String language) {
        language = language != null ? language : "en";
        
        if (!LOCALIZATION_KEYS.containsKey(language)) {
            language = "en";
        }

        Map<String, String> translations = LOCALIZATION_KEYS.get(language);
        return translations.getOrDefault(key, getEnglishTranslation(key));
    }

    private String getEnglishTranslation(String key) {
        return LOCALIZATION_KEYS.get("en").getOrDefault(key, key);
    }

    public Map<String, String> getTranslations(String language) {
        language = language != null ? language : "en";
        
        if (!LOCALIZATION_KEYS.containsKey(language)) {
            language = "en";
        }

        return new HashMap<>(LOCALIZATION_KEYS.get(language));
    }

    public String detectLanguage(String userAgent) {
        if (userAgent == null) return "en";
        
        // Simple language detection based on locale hints
        if (userAgent.contains("es_") || userAgent.contains("es-")) return "es";
        if (userAgent.contains("fr_") || userAgent.contains("fr-")) return "fr";
        if (userAgent.contains("de_") || userAgent.contains("de-")) return "de";
        if (userAgent.contains("hi_") || userAgent.contains("hi-")) return "hi";
        if (userAgent.contains("ja_") || userAgent.contains("ja-")) return "ja";
        if (userAgent.contains("zh_") || userAgent.contains("zh-")) return "zh";
        if (userAgent.contains("pt_") || userAgent.contains("pt-")) return "pt";
        if (userAgent.contains("ru_") || userAgent.contains("ru-")) return "ru";
        if (userAgent.contains("ar_") || userAgent.contains("ar-")) return "ar";
        
        return "en";
    }

    public String formatLocale(String language) {
        // Convert language code to Locale object
        try {
            Locale locale = Locale.forLanguageTag(language);
            return locale.getDisplayLanguage(Locale.ENGLISH) + " (" + language.toUpperCase() + ")";
        } catch (Exception e) {
            return language;
        }
    }
}
