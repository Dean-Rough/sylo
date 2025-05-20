import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';
import { AuthGuard } from '@nestjs/passport';
import { Prompt } from './entities/prompt.entity';

@Controller('prompts')
@UseGuards(AuthGuard('jwt'))
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createPromptDto: CreatePromptDto,
    @Req() req: any,
  ): Promise<Prompt> {
    const userId = req.user.userId; // Assuming userId is on req.user
    return this.promptsService.create(createPromptDto, userId);
  }

  @Get()
  async findAll(@Req() req: any): Promise<Prompt[]> {
    const userId = req.user.userId;
    return this.promptsService.findAll(userId);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ): Promise<Prompt> {
    const userId = req.user.userId;
    return this.promptsService.findOne(id, userId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updatePromptDto: UpdatePromptDto,
    @Req() req: any,
  ): Promise<Prompt> {
    const userId = req.user.userId;
    return this.promptsService.update(id, updatePromptDto, userId);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ): Promise<{ message: string; deletedPrompt: Prompt }> {
    const userId = req.user.userId;
    return this.promptsService.remove(id, userId);
  }
}
