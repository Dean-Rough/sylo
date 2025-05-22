import { 
  Controller, 
  Get, 
  Param, 
  UseGuards, 
  Request, 
  Logger,
  ParseIntPipe
} from '@nestjs/common';
import { AiProjectManagerService } from './ai-project-manager.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectRiskAssessmentDto } from './dto/project-risk-assessment.dto';
import { TaskPredictionDto } from './dto/task-prediction.dto';
import { WorkloadAnalysisDto } from './dto/workload-analysis.dto';

@Controller('ai-project-manager')
@UseGuards(JwtAuthGuard)
export class AiProjectManagerController {
  private readonly logger = new Logger(AiProjectManagerController.name);

  constructor(
    private readonly aiProjectManagerService: AiProjectManagerService
  ) {}

  @Get('/project/:projectId/risk-assessment')
  async getProjectRiskAssessment(
    @Param('projectId', ParseIntPipe) projectId: number
  ): Promise<ProjectRiskAssessmentDto> {
    this.logger.log(`Analyzing risk for project ${projectId}`);
    return this.aiProjectManagerService.analyzeProjectRisk(projectId);
  }

  @Get('/project/:projectId/task-predictions')
  async getTaskPredictions(
    @Param('projectId', ParseIntPipe) projectId: number
  ): Promise<TaskPredictionDto[]> {
    this.logger.log(`Predicting task delays for project ${projectId}`);
    return this.aiProjectManagerService.predictTaskDelays(projectId);
  }

  @Get('/project/:projectId/timeline-projection')
  async getTimelineProjection(
    @Param('projectId', ParseIntPipe) projectId: number
  ): Promise<any> {
    this.logger.log(`Generating timeline projection for project ${projectId}`);
    return this.aiProjectManagerService.generateTimelineProjection(projectId);
  }

  @Get('/team/:teamId/workload-analysis')
  async getTeamWorkloadAnalysis(
    @Param('teamId', ParseIntPipe) teamId: number
  ): Promise<WorkloadAnalysisDto> {
    this.logger.log(`Analyzing workload for team ${teamId}`);
    return this.aiProjectManagerService.analyzeTeamWorkload(teamId);
  }

  @Get('/project/:projectId/task-status-suggestions')
  async getTaskStatusSuggestions(
    @Param('projectId', ParseIntPipe) projectId: number
  ): Promise<any[]> {
    this.logger.log(`Suggesting task status updates for project ${projectId}`);
    return this.aiProjectManagerService.suggestTaskStatusUpdates(projectId);
  }
}