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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDependencyDto } from './dto/create-task-dependency.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Project } from './entities/project.entity';
import { Task } from './entities/task.entity';
import { TaskDependency } from './entities/task-dependency.entity';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // Project endpoints
  @Post()
  async createProject(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createProjectDto: CreateProjectDto,
    @Req() req: any,
  ): Promise<Project> {
    const userId = req.user.userId;
    return this.projectsService.createProject(createProjectDto, userId);
  }

  @Get()
  async findAllProjects(@Req() req: any): Promise<Project[]> {
    const userId = req.user.userId;
    return this.projectsService.findAllProjects(userId);
  }

  @Get(':id')
  async findProjectById(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ): Promise<Project> {
    const userId = req.user.userId;
    return this.projectsService.findProjectById(id, userId);
  }

  @Patch(':id')
  async updateProject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateProjectDto: UpdateProjectDto,
    @Req() req: any,
  ): Promise<Project> {
    const userId = req.user.userId;
    return this.projectsService.updateProject(id, updateProjectDto, userId);
  }

  @Delete(':id')
  async deleteProject(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ): Promise<{ message: string; deletedProject: Project }> {
    const userId = req.user.userId;
    return this.projectsService.deleteProject(id, userId);
  }

  // Task endpoints
  @Post(':projectId/tasks')
  async createTask(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createTaskDto: CreateTaskDto,
    @Req() req: any,
  ): Promise<Task> {
    const userId = req.user.userId;
    // Ensure the task is created for the specified project
    createTaskDto.project_id = projectId;
    return this.projectsService.createTask(createTaskDto, userId);
  }

  @Get(':projectId/tasks')
  async findAllTasks(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Req() req: any,
  ): Promise<Task[]> {
    const userId = req.user.userId;
    return this.projectsService.findAllTasks(projectId, userId);
  }

  @Get(':projectId/tasks/:taskId')
  async findTaskById(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Req() req: any,
  ): Promise<Task> {
    const userId = req.user.userId;
    return this.projectsService.findTaskById(taskId, projectId, userId);
  }

  @Patch(':projectId/tasks/:taskId')
  async updateTask(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateTaskDto: UpdateTaskDto,
    @Req() req: any,
  ): Promise<Task> {
    const userId = req.user.userId;
    return this.projectsService.updateTask(taskId, projectId, updateTaskDto, userId);
  }

  @Delete(':projectId/tasks/:taskId')
  async deleteTask(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Req() req: any,
  ): Promise<{ message: string; deletedTask: Task }> {
    const userId = req.user.userId;
    return this.projectsService.deleteTask(taskId, projectId, userId);
  }

  // Task Dependencies endpoints
  @Post(':projectId/tasks/:taskId/dependencies')
  async createTaskDependency(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createTaskDependencyDto: CreateTaskDependencyDto,
    @Req() req: any,
  ): Promise<TaskDependency> {
    const userId = req.user.userId;
    // Ensure the task_id is set to the specified task
    createTaskDependencyDto.task_id = taskId;
    return this.projectsService.createTaskDependency(
      createTaskDependencyDto,
      projectId,
      userId,
    );
  }

  @Get(':projectId/tasks/:taskId/dependencies')
  async findTaskDependencies(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Req() req: any,
  ): Promise<Task[]> {
    const userId = req.user.userId;
    return this.projectsService.findTaskDependencies(taskId, projectId, userId);
  }

  @Delete(':projectId/tasks/:taskId/dependencies/:dependsOnTaskId')
  async deleteTaskDependency(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('dependsOnTaskId', ParseUUIDPipe) dependsOnTaskId: string,
    @Req() req: any,
  ): Promise<{ message: string }> {
    const userId = req.user.userId;
    return this.projectsService.deleteTaskDependency(
      taskId,
      dependsOnTaskId,
      projectId,
      userId,
    );
  }
}