import React, { createContext, useState, useCallback } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [learningMode, setLearningMode] = useState("simple"); // simple, exam, advanced
  const [language, setLanguage] = useState("en"); // en, te, hi
  const [currentPDF, setCurrentPDF] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [aiExplanation, setAiExplanation] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [examMode, setExamMode] = useState(false);
  const [examStartTime, setExamStartTime] = useState(null);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [userProfile, setUserProfile] = useState({
    name: "Student",
    level: "high-school",
  });

  const updateLearningMode = useCallback((mode) => {
    setLearningMode(mode);
  }, []);

  const updateLanguage = useCallback((lang) => {
    setLanguage(lang);
  }, []);

  const updatePDF = useCallback((pdf) => {
    setCurrentPDF(pdf);
    setExtractedText("");
    setAiExplanation("");
  }, []);

  const updateExtractedText = useCallback((text) => {
    setExtractedText(text);
  }, []);

  const updateAiExplanation = useCallback((explanation, loading = false) => {
    setAiExplanation(explanation);
    setIsLoadingAI(loading);
  }, []);

  const startExamSession = useCallback(() => {
    setExamMode(true);
    setExamStartTime(new Date());
    setTabSwitchCount(0);
  }, []);

  const endExamSession = useCallback(() => {
    setExamMode(false);
    setExamStartTime(null);
  }, []);

  const incrementTabSwitch = useCallback(() => {
    setTabSwitchCount((prev) => prev + 1);
  }, []);

  const value = {
    // Learning Mode
    learningMode,
    updateLearningMode,
    language,
    updateLanguage,

    // PDF Management
    currentPDF,
    updatePDF,
    extractedText,
    updateExtractedText,

    // AI Explanation
    aiExplanation,
    updateAiExplanation,
    isLoadingAI,

    // Quiz
    currentQuiz,
    setCurrentQuiz,
    quizAnswers,
    setQuizAnswers,

    // Exam Mode
    examMode,
    startExamSession,
    endExamSession,
    examStartTime,
    tabSwitchCount,
    incrementTabSwitch,

    // User Profile
    userProfile,
    setUserProfile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
