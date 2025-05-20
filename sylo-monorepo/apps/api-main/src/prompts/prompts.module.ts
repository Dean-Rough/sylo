import { Module } from '@nestjs/common';
import { PromptsController } from './prompts.controller';
import { PromptsService } from './prompts.service';
import { SupabaseModule } from '../supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [PromptsController],
  providers: [PromptsService],
})
export class PromptsModule {}
