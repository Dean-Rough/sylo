import { Module } from '@nestjs/common';
import { AiProjectManagerService } from './ai-project-manager.service';
import { AiProjectManagerController } from './ai-project-manager.controller';
import { SupabaseModule } from '../supabase.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    SupabaseModule,
    ProjectsModule
  ],
  providers: [AiProjectManagerService],
  controllers: [AiProjectManagerController],
  exports: [AiProjectManagerService]
})
export class AiProjectManagerModule {}