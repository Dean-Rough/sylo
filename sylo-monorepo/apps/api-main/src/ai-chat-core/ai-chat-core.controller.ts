import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AiChatCoreService } from './ai-chat-core.service';

@Controller('ai-chat')
@UseGuards(AuthGuard('jwt'))
export class AiChatCoreController {
  constructor(private readonly aiChatCoreService: AiChatCoreService) {}

  @Post('completion')
  async generateChatCompletion(
    @Req() req: any,
    @Body()
    body: {
      messages: Array<{ role: string; content: string }>;
      session_id?: string;
      model?: string;
      temperature?: number;
      max_tokens?: number;
    },
  ) {
    const userId = req.user.userId;
    return this.aiChatCoreService.generateChatCompletion(
      userId,
      body.messages,
      body.session_id,
      {
        model: body.model,
        temperature: body.temperature,
        maxTokens: body.max_tokens,
      },
    );
  }

  @Post('sessions')
  async createChatSession(@Req() req: any) {
    const userId = req.user.userId;
    return this.aiChatCoreService.createChatSession(userId);
  }

  @Delete('sessions/:sessionId')
  async deleteChatSession(@Req() req: any, @Param('sessionId') sessionId: string) {
    const userId = req.user.userId;
    return this.aiChatCoreService.deleteChatSession(userId, sessionId);
  }

  @Get('settings')
  async getUserSettings(@Req() req: any) {
    const userId = req.user.userId;
    return this.aiChatCoreService.getUserSettings(userId);
  }

  @Put('settings')
  async updateUserSettings(
    @Req() req: any,
    @Body()
    body: {
      default_model?: string;
      temperature?: number;
      max_tokens?: number;
      memory_window?: number;
      preferences?: Record<string, any>;
    },
  ) {
    const userId = req.user.userId;
    return this.aiChatCoreService.updateUserSettings(userId, {
      defaultModel: body.default_model,
      temperature: body.temperature,
      maxTokens: body.max_tokens,
      memoryWindow: body.memory_window,
      preferences: body.preferences,
    });
  }

  @Post('prompts/improve')
  async improvePrompt(
    @Req() req: any,
    @Body() body: { prompt_text: string; prompt_id?: string },
  ) {
    const userId = req.user.userId;
    return this.aiChatCoreService.improvePrompt(
      userId,
      body.prompt_text,
      body.prompt_id,
    );
  }

  @Post('prompts/categorize')
  async categorizePrompt(
    @Req() req: any,
    @Body() body: { prompt_text: string; prompt_id?: string },
  ) {
    const userId = req.user.userId;
    return this.aiChatCoreService.categorizePrompt(
      userId,
      body.prompt_text,
      body.prompt_id,
    );
  }
}