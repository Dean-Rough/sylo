import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class AiChatCoreService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('AI_CHAT_CORE_URL') || 'http://localhost:4000';
  }

  /**
   * Generate a chat completion
   * @param userId The ID of the user
   * @param messages Array of messages in the conversation
   * @param sessionId Optional session ID for continuing a conversation
   * @param options Optional parameters (model, temperature, etc.)
   * @returns The chat completion response
   */
  async generateChatCompletion(
    userId: string,
    messages: Array<{ role: string; content: string }>,
    sessionId?: string,
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    },
  ) {
    const url = `${this.baseUrl}/v1/chat/completion`;
    
    const data = {
      messages,
      session_id: sessionId,
      model: options?.model,
      temperature: options?.temperature,
      max_tokens: options?.maxTokens,
    };

    const config: AxiosRequestConfig = {
      headers: {
        'X-User-ID': userId,
      },
    };

    const response = await firstValueFrom(
      this.httpService.post(url, data, config),
    );

    return response.data;
  }

  /**
   * Create a new chat session
   * @param userId The ID of the user
   * @returns The new session ID
   */
  async createChatSession(userId: string) {
    const url = `${this.baseUrl}/v1/chat/sessions`;
    
    const config: AxiosRequestConfig = {
      headers: {
        'X-User-ID': userId,
      },
    };

    const response = await firstValueFrom(
      this.httpService.post(url, {}, config),
    );

    return response.data;
  }

  /**
   * Delete a chat session
   * @param userId The ID of the user
   * @param sessionId The ID of the session to delete
   * @returns Success status
   */
  async deleteChatSession(userId: string, sessionId: string) {
    const url = `${this.baseUrl}/v1/chat/sessions/${sessionId}`;
    
    const config: AxiosRequestConfig = {
      headers: {
        'X-User-ID': userId,
      },
    };

    const response = await firstValueFrom(
      this.httpService.delete(url, config),
    );

    return response.data;
  }

  /**
   * Get user settings
   * @param userId The ID of the user
   * @returns The user's settings
   */
  async getUserSettings(userId: string) {
    const url = `${this.baseUrl}/v1/user-settings`;
    
    const config: AxiosRequestConfig = {
      headers: {
        'X-User-ID': userId,
      },
    };

    const response = await firstValueFrom(
      this.httpService.get(url, config),
    );

    return response.data;
  }

  /**
   * Update user settings
   * @param userId The ID of the user
   * @param settings The settings to update
   * @returns The updated settings
   */
  async updateUserSettings(
    userId: string,
    settings: {
      defaultModel?: string;
      temperature?: number;
      maxTokens?: number;
      memoryWindow?: number;
      preferences?: Record<string, any>;
    },
  ) {
    const url = `${this.baseUrl}/v1/user-settings`;
    
    const data = {
      default_model: settings.defaultModel,
      temperature: settings.temperature,
      max_tokens: settings.maxTokens,
      memory_window: settings.memoryWindow,
      preferences: settings.preferences,
    };

    const config: AxiosRequestConfig = {
      headers: {
        'X-User-ID': userId,
      },
    };

    const response = await firstValueFrom(
      this.httpService.put(url, data, config),
    );

    return response.data;
  }

  /**
   * Improve a prompt
   * @param userId The ID of the user
   * @param promptText The prompt text to improve
   * @param promptId Optional ID of the prompt in the repository
   * @returns The improved prompt
   */
  async improvePrompt(userId: string, promptText: string, promptId?: string) {
    const url = `${this.baseUrl}/v1/prompts/improve`;
    
    const data = {
      prompt_text: promptText,
      prompt_id: promptId,
    };

    const config: AxiosRequestConfig = {
      headers: {
        'X-User-ID': userId,
      },
    };

    const response = await firstValueFrom(
      this.httpService.post(url, data, config),
    );

    return response.data;
  }

  /**
   * Categorize a prompt
   * @param userId The ID of the user
   * @param promptText The prompt text to categorize
   * @param promptId Optional ID of the prompt in the repository
   * @returns Suggested categories for the prompt
   */
  async categorizePrompt(userId: string, promptText: string, promptId?: string) {
    const url = `${this.baseUrl}/v1/prompts/categorize`;
    
    const data = {
      prompt_text: promptText,
      prompt_id: promptId,
    };

    const config: AxiosRequestConfig = {
      headers: {
        'X-User-ID': userId,
      },
    };

    const response = await firstValueFrom(
      this.httpService.post(url, data, config),
    );

    return response.data;
  }
}