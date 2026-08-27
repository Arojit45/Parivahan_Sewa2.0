package com.parivahan.backend.assistant.service;

import com.parivahan.backend.assistant.model.VehicleIntent;
import org.springframework.stereotype.Component;

/**
 * Simple keyword-based intent router.
 * Deterministic and transparent — no ML magic for the MVP.
 * The router just figures out which vehicle data is relevant to the user's question
 * so VehicleContextBuilder can fetch only that data from the dashboard.
 */
@Component
public class VehicleQuestionRouter {

    public VehicleIntent detectIntent(String question) {
        if (question == null || question.isBlank()) {
            return VehicleIntent.VEHICLE_OVERVIEW;
        }

        String q = question.toLowerCase().trim();

        // "What should I do today?" — signature feature
        if (containsAny(q, "today", "aaj", "आज", "kya karna", "what to do", "priorities",
                "priority", "action", "first thing")) {
            return VehicleIntent.WHAT_TO_DO_TODAY;
        }

        // Health score
        if (containsAny(q, "health score", "score", "health", "healthy", "why is my score",
                "why is my health", "स्वास्थ्य", "स्कोर", "health kyu")) {
            return VehicleIntent.HEALTH_SCORE;
        }

        // PUC
        if (containsAny(q, "puc", "pollution", "emission", "certificate",
                "प्रदूषण", "puc kab")) {
            return VehicleIntent.PUC_STATUS;
        }

        // Insurance
        if (containsAny(q, "insurance", "insure", "bima", "बीमा", "policy", "cover",
                "insurance kab", "insurance expire")) {
            return VehicleIntent.INSURANCE_STATUS;
        }

        // Tax
        if (containsAny(q, "tax", "road tax", "टैक्स", "कर", "tax due", "tax expire")) {
            return VehicleIntent.TAX_STATUS;
        }

        // RC
        if (containsAny(q, " rc ", "registration certificate", "rc expire", "registration card",
                "आरसी", "rc kab")) {
            return VehicleIntent.RC_STATUS;
        }

        // Permit
        if (containsAny(q, "permit", "परमिट")) {
            return VehicleIntent.PERMIT_STATUS;
        }

        // Fitness
        if (containsAny(q, "fitness", "fit certificate", "फिटनेस")) {
            return VehicleIntent.FITNESS_STATUS;
        }

        // Challan
        if (containsAny(q, "challan", "fine", "penalty", "dues", "pending", "चालान",
                "jurmana", "जुर्माना", "owe", "amount", "pay")) {
            return VehicleIntent.CHALLAN_STATUS;
        }

        // GPS / location
        if (containsAny(q, "where", "location", "gps", "track", "map", "speed",
                "kahan", "कहां", "live", "locate", "address")) {
            return VehicleIntent.LIVE_LOCATION;
        }

        // Alerts
        if (containsAny(q, "alert", "warning", "attention", "problem", "issue",
                "चेतावनी", "danger")) {
            return VehicleIntent.ACTIVE_ALERTS;
        }

        // Documents expiring
        if (containsAny(q, "expir", "expire", "renew", "renewal", "due",
                "खत्म", "समाप्त", "update")) {
            return VehicleIntent.EXPIRING_DOCUMENTS;
        }

        // Vehicle overview / is it okay
        if (containsAny(q, "okay", "ok", "fine", "good", "status", "overview",
                "theek", "ठीक", "condition", "summary", "how is")) {
            return VehicleIntent.VEHICLE_OVERVIEW;
        }

        // General vehicle question (definition questions, what is X, etc.)
        if (containsAny(q, "what is", "what are", "explain", "define", "kya hai",
                "क्या है", "tell me about")) {
            return VehicleIntent.GENERAL_VEHICLE_QUESTION;
        }

        // Fallback to overview
        return VehicleIntent.VEHICLE_OVERVIEW;
    }

    private boolean containsAny(String text, String... keywords) {
        for (String kw : keywords) {
            if (text.contains(kw)) return true;
        }
        return false;
    }
}
