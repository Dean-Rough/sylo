import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';
import { Prompt } from './entities/prompt.entity';

@Injectable()
export class PromptsService {
  private readonly tableName = 'prompts';

  constructor(private readonly supabaseService: SupabaseService) {}

  async create(
    createPromptDto: CreatePromptDto,
    userId: string,
  ): Promise<Prompt> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.tableName)
      .insert([{ ...createPromptDto, user_id: userId }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data as Prompt;
  }

  async findAll(userId: string): Promise<Prompt[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }
    return data as Prompt[];
  }

  async findOne(id: string, userId: string): Promise<Prompt> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // PostgREST error for "No rows found"
        throw new NotFoundException(`Prompt with ID "${id}" not found`);
      }
      throw new Error(error.message);
    }
    if (!data) {
      // Should be caught by PGRST116, but as a fallback
      throw new NotFoundException(`Prompt with ID "${id}" not found`);
    }
    return data as Prompt;
  }

  async update(
    id: string,
    updatePromptDto: UpdatePromptDto,
    userId: string,
  ): Promise<Prompt> {
    // First, verify the prompt exists and belongs to the user
    await this.findOne(id, userId);

    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.tableName)
      .update({ ...updatePromptDto, updated_at: new Date() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    if (!data) {
      // Should not happen if findOne passed and update didn't error
      throw new NotFoundException(
        `Prompt with ID "${id}" could not be updated or was not found.`,
      );
    }
    return data as Prompt;
  }

  async remove(
    id: string,
    userId: string,
  ): Promise<{ message: string; deletedPrompt: Prompt }> {
    // First, verify the prompt exists and belongs to the user
    const promptToDelete = await this.findOne(id, userId);

    const { error } = await this.supabaseService
      .getClient()
      .from(this.tableName)
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    return {
      message: `Prompt with ID "${id}" successfully deleted.`,
      deletedPrompt: promptToDelete,
    };
  }
}
