package com.auxiliar.server.chat;

import java.util.HashMap;
import java.util.Map;

/**
 * Model providers Auxi can use (AI_PROVIDER). Both speak the OpenAI API, but each one
 * has its own way to turn the model's reasoning off.
 */
public enum AiProvider {

    /** build.nvidia.com: Nemotron takes chat_template_kwargs.enable_thinking */
    NVIDIA {
        @Override
        Map<String, Object> reasoning(boolean enabled) {
            return Map.of("chat_template_kwargs", Map.of("enable_thinking", enabled));
        }
    },

    /** openrouter.ai: its own reasoning switch, the same for every model */
    OPENROUTER {
        @Override
        Map<String, Object> reasoning(boolean enabled) {
            return Map.of("reasoning", Map.of("enabled", enabled));
        }
    };

    /** Extra request fields that turn the model's reasoning step on or off */
    abstract Map<String, Object> reasoning(boolean enabled);

    /** Extra request fields that make the model reply with exactly this JSON schema (OpenAI's response_format) */
    Map<String, Object> jsonSchema(String name, Map<String, Object> schema) {
        return Map.of("response_format", Map.of(
                "type", "json_schema",
                "json_schema", Map.of("name", name, "strict", true, "schema", schema)));
    }

    /** Both, for the answer */
    Map<String, Object> reasoningAndJsonSchema(boolean reasoning, String name, Map<String, Object> schema) {
        Map<String, Object> body = new HashMap<>(reasoning(reasoning));
        body.putAll(jsonSchema(name, schema));
        return body;
    }

    static AiProvider from(String name) {
        return valueOf(name.trim().toUpperCase());
    }
}
