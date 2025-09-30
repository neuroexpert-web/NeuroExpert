/**
 * Type definitions for AI Chat Utility
 */

export declare function openAIChat(message?: string): void;

export declare const AI_CHAT_MESSAGES: {
  ROI_CALCULATION: string;
  PRICING_INFO: string;
  START_JOURNEY: string;
  CONTACT_SUPPORT: string;
  CUSTOM_SOLUTION: string;
  DEMO_REQUEST: string;
  TECHNICAL_QUESTION: string;
};

export declare function openAIChatWithMessage(messageType: keyof typeof AI_CHAT_MESSAGES): void;