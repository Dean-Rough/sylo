import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';
import { ProjectsService } from '../projects/projects.service';
import { ProjectRiskAssessmentDto, RiskLevel } from './dto/project-risk-assessment.dto';
import { TaskPredictionDto } from './dto/task-prediction.dto';
import { WorkloadAnalysisDto } from './dto/workload-analysis.dto';

@Injectable()
export class AiProjectManagerService {
  private readonly logger = new Logger(AiProjectManagerService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly projectsService: ProjectsService
  ) {}

  async analyzeProjectRisk(projectId: number): Promise<ProjectRiskAssessmentDto> {
    try {
      // Fetch project and task data
      const project = await this.projectsService.findOne(projectId);
      const tasks = await this.projectsService.findProjectTasks(projectId);

      // Basic risk assessment logic
      const completedTasks = tasks.filter(task => task.status === 'completed');
      const delayedTasks = tasks.filter(task => task.status === 'delayed');
      
      const riskScore = 
        (delayedTasks.length / tasks.length) * 100 +
        (project.deadline && new Date(project.deadline) < new Date() ? 20 : 0);

      let riskLevel: RiskLevel;
      if (riskScore < 20) riskLevel = RiskLevel.LOW;
      else if (riskScore < 50) riskLevel = RiskLevel.MEDIUM;
      else riskLevel = RiskLevel.HIGH;

      return {
        projectId,
        overallRiskLevel: riskLevel,
        riskScore,
        delayedTaskCount: delayedTasks.length,
        totalTaskCount: tasks.length
      };
    } catch (error) {
      this.logger.error(`Error analyzing project risk: ${error.message}`, error.stack);
      throw error;
    }
  }

  async predictTaskDelays(projectId: number): Promise<TaskPredictionDto[]> {
    try {
      const tasks = await this.projectsService.findProjectTasks(projectId);
      
      return tasks.map(task => ({
        taskId: task.id,
        taskName: task.name,
        originalEstimate: task.estimatedHours,
        predictedDelay: this.calculatePredictedDelay(task)
      }));
    } catch (error) {
      this.logger.error(`Error predicting task delays: ${error.message}`, error.stack);
      throw error;
    }
  }

  private calculatePredictedDelay(task: any): number {
    // Simple delay prediction based on task complexity and historical data
    const complexityFactor = task.complexity || 1;
    const historicalDelayFactor = task.previousDelays ? task.previousDelays * 0.5 : 0;
    
    return Math.max(0, complexityFactor + historicalDelayFactor);
  }

  async analyzeTeamWorkload(teamId: number): Promise<WorkloadAnalysisDto> {
    try {
      // Fetch team's active projects and tasks
      const teamProjects = await this.projectsService.findTeamProjects(teamId);
      const teamTasks = await this.projectsService.findTeamTasks(teamId);

      const totalProjectCount = teamProjects.length;
      const activeProjectCount = teamProjects.filter(p => p.status === 'active').length;
      const totalTaskCount = teamTasks.length;
      const completedTaskCount = teamTasks.filter(t => t.status === 'completed').length;

      return {
        teamId,
        totalProjects: totalProjectCount,
        activeProjects: activeProjectCount,
        totalTasks: totalTaskCount,
        completedTasks: completedTaskCount,
        workloadPercentage: (completedTaskCount / totalTaskCount) * 100
      };
    } catch (error) {
      this.logger.error(`Error analyzing team workload: ${error.message}`, error.stack);
      throw error;
    }
  }

  async generateTimelineProjection(projectId: number): Promise<any> {
    try {
      const project = await this.projectsService.findOne(projectId);
      const tasks = await this.projectsService.findProjectTasks(projectId);

      // Basic timeline projection
      const sortedTasks = tasks.sort((a, b) => 
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );

      return {
        projectId,
        originalStartDate: project.startDate,
        originalEndDate: project.deadline,
        projectedStartDate: sortedTasks[0]?.startDate,
        projectedEndDate: sortedTasks[sortedTasks.length - 1]?.endDate,
        estimatedDurationDays: this.calculateProjectDuration(sortedTasks)
      };
    } catch (error) {
      this.logger.error(`Error generating timeline projection: ${error.message}`, error.stack);
      throw error;
    }
  }

  private calculateProjectDuration(tasks: any[]): number {
    if (tasks.length === 0) return 0;
    
    const startDate = new Date(tasks[0].startDate);
    const endDate = new Date(tasks[tasks.length - 1].endDate);
    
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  }

  async suggestTaskStatusUpdates(projectId: number): Promise<any[]> {
    try {
      const tasks = await this.projectsService.findProjectTasks(projectId);
      
      return tasks
        .filter(task => this.needsStatusUpdate(task))
        .map(task => ({
          taskId: task.id,
          taskName: task.name,
          currentStatus: task.status,
          suggestedStatus: this.determineSuggestedStatus(task)
        }));
    } catch (error) {
      this.logger.error(`Error suggesting task status updates: ${error.message}`, error.stack);
      throw error;
    }
  }

  private needsStatusUpdate(task: any): boolean {
    // Logic to determine if a task needs a status update
    const now = new Date();
    const taskEndDate = new Date(task.endDate);
    
    return (
      task.status === 'in_progress' && 
      taskEndDate < now
    );
  }

  private determineSuggestedStatus(task: any): string {
    const now = new Date();
    const taskEndDate = new Date(task.endDate);
    
    if (taskEndDate < now) {
      return 'delayed';
    }
    
    return task.status;
  }
}