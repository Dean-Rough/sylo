import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDependencyDto } from './dto/create-task-dependency.dto';
import { Project } from './entities/project.entity';
import { Task } from './entities/task.entity';
import { TaskDependency } from './entities/task-dependency.entity';

@Injectable()
export class ProjectsService {
  private readonly projectsTable = 'projects';
  private readonly tasksTable = 'tasks';
  private readonly taskDependenciesTable = 'task_dependencies';

  constructor(private readonly supabaseService: SupabaseService) {}

  // Project CRUD operations
  async createProject(
    createProjectDto: CreateProjectDto,
    userId: string,
  ): Promise<Project> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.projectsTable)
      .insert([{ ...createProjectDto, user_id: userId }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data as Project;
  }

  async findAllProjects(userId: string): Promise<Project[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.projectsTable)
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }
    return data as Project[];
  }

  async findProjectById(id: string, userId: string): Promise<Project> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.projectsTable)
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException(`Project with ID "${id}" not found`);
      }
      throw new Error(error.message);
    }
    if (!data) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
    return data as Project;
  }

  async updateProject(
    id: string,
    updateProjectDto: UpdateProjectDto,
    userId: string,
  ): Promise<Project> {
    // First, verify the project exists and belongs to the user
    await this.findProjectById(id, userId);

    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.projectsTable)
      .update({ ...updateProjectDto, updated_at: new Date() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    if (!data) {
      throw new NotFoundException(
        `Project with ID "${id}" could not be updated or was not found.`,
      );
    }
    return data as Project;
  }

  async deleteProject(
    id: string,
    userId: string,
  ): Promise<{ message: string; deletedProject: Project }> {
    // First, verify the project exists and belongs to the user
    const projectToDelete = await this.findProjectById(id, userId);

    // Delete all tasks and dependencies associated with this project
    await this.deleteAllProjectTasks(id);

    const { error } = await this.supabaseService
      .getClient()
      .from(this.projectsTable)
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    return {
      message: `Project with ID "${id}" successfully deleted.`,
      deletedProject: projectToDelete,
    };
  }

  // Task CRUD operations
  async createTask(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<Task> {
    // Verify the project exists and belongs to the user
    await this.findProjectById(createTaskDto.project_id, userId);

    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.tasksTable)
      .insert([{ ...createTaskDto }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data as Task;
  }

  async findAllTasks(projectId: string, userId: string): Promise<Task[]> {
    // Verify the project exists and belongs to the user
    await this.findProjectById(projectId, userId);

    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.tasksTable)
      .select('*')
      .eq('project_id', projectId);

    if (error) {
      throw new Error(error.message);
    }
    return data as Task[];
  }

  async findTaskById(id: string, projectId: string, userId: string): Promise<Task> {
    // Verify the project exists and belongs to the user
    await this.findProjectById(projectId, userId);

    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.tasksTable)
      .select('*')
      .eq('id', id)
      .eq('project_id', projectId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException(`Task with ID "${id}" not found`);
      }
      throw new Error(error.message);
    }
    if (!data) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return data as Task;
  }

  async updateTask(
    id: string,
    projectId: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    // Verify the task exists and belongs to the project
    await this.findTaskById(id, projectId, userId);

    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.tasksTable)
      .update({ ...updateTaskDto, updated_at: new Date() })
      .eq('id', id)
      .eq('project_id', projectId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    if (!data) {
      throw new NotFoundException(
        `Task with ID "${id}" could not be updated or was not found.`,
      );
    }
    return data as Task;
  }

  async deleteTask(
    id: string,
    projectId: string,
    userId: string,
  ): Promise<{ message: string; deletedTask: Task }> {
    // Verify the task exists and belongs to the project
    const taskToDelete = await this.findTaskById(id, projectId, userId);

    // Delete all dependencies associated with this task
    await this.deleteTaskDependencies(id);

    const { error } = await this.supabaseService
      .getClient()
      .from(this.tasksTable)
      .delete()
      .eq('id', id)
      .eq('project_id', projectId);

    if (error) {
      throw new Error(error.message);
    }

    return {
      message: `Task with ID "${id}" successfully deleted.`,
      deletedTask: taskToDelete,
    };
  }

  private async deleteAllProjectTasks(projectId: string): Promise<void> {
    // Get all tasks for the project
    const { data: tasks, error: tasksError } = await this.supabaseService
      .getClient()
      .from(this.tasksTable)
      .select('id')
      .eq('project_id', projectId);

    if (tasksError) {
      throw new Error(tasksError.message);
    }

    // Delete all dependencies for each task
    if (tasks && tasks.length > 0) {
      const taskIds = tasks.map((task) => task.id);
      
      // Delete dependencies where task_id is in taskIds
      await this.supabaseService
        .getClient()
        .from(this.taskDependenciesTable)
        .delete()
        .in('task_id', taskIds);
      
      // Delete dependencies where depends_on_task_id is in taskIds
      await this.supabaseService
        .getClient()
        .from(this.taskDependenciesTable)
        .delete()
        .in('depends_on_task_id', taskIds);
    }

    // Delete all tasks for the project
    await this.supabaseService
      .getClient()
      .from(this.tasksTable)
      .delete()
      .eq('project_id', projectId);
  }

  // Task Dependencies operations
  async createTaskDependency(
    createTaskDependencyDto: CreateTaskDependencyDto,
    projectId: string,
    userId: string,
  ): Promise<TaskDependency> {
    // Verify both tasks exist and belong to the project
    const { task_id, depends_on_task_id } = createTaskDependencyDto;
    
    await this.findTaskById(task_id, projectId, userId);
    await this.findTaskById(depends_on_task_id, projectId, userId);

    // Check if dependency already exists
    const { data: existingDep, error: checkError } = await this.supabaseService
      .getClient()
      .from(this.taskDependenciesTable)
      .select('*')
      .eq('task_id', task_id)
      .eq('depends_on_task_id', depends_on_task_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error(checkError.message);
    }

    if (existingDep) {
      return existingDep as TaskDependency;
    }

    // Create new dependency
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.taskDependenciesTable)
      .insert([createTaskDependencyDto])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data as TaskDependency;
  }

  async findTaskDependencies(taskId: string, projectId: string, userId: string): Promise<Task[]> {
    // Verify the task exists and belongs to the project
    await this.findTaskById(taskId, projectId, userId);

    // Get all dependencies for the task
    const { data: dependencies, error: depError } = await this.supabaseService
      .getClient()
      .from(this.taskDependenciesTable)
      .select('depends_on_task_id')
      .eq('task_id', taskId);

    if (depError) {
      throw new Error(depError.message);
    }

    if (!dependencies || dependencies.length === 0) {
      return [];
    }

    // Get all tasks that this task depends on
    const dependsOnTaskIds = dependencies.map((dep) => dep.depends_on_task_id);
    const { data: tasks, error: tasksError } = await this.supabaseService
      .getClient()
      .from(this.tasksTable)
      .select('*')
      .in('id', dependsOnTaskIds);

    if (tasksError) {
      throw new Error(tasksError.message);
    }

    return tasks as Task[];
  }

  async deleteTaskDependency(
    taskId: string,
    dependsOnTaskId: string,
    projectId: string,
    userId: string,
  ): Promise<{ message: string }> {
    // Verify both tasks exist and belong to the project
    await this.findTaskById(taskId, projectId, userId);
    await this.findTaskById(dependsOnTaskId, projectId, userId);

    const { error } = await this.supabaseService
      .getClient()
      .from(this.taskDependenciesTable)
      .delete()
      .eq('task_id', taskId)
      .eq('depends_on_task_id', dependsOnTaskId);

    if (error) {
      throw new Error(error.message);
    }

    return {
      message: `Dependency between task "${taskId}" and "${dependsOnTaskId}" successfully deleted.`,
    };
  }

  private async deleteTaskDependencies(taskId: string): Promise<void> {
    // Delete dependencies where this task is the dependent
    await this.supabaseService
      .getClient()
      .from(this.taskDependenciesTable)
      .delete()
      .eq('task_id', taskId);

    // Delete dependencies where this task is the dependency
    await this.supabaseService
      .getClient()
      .from(this.taskDependenciesTable)
      .delete()
      .eq('depends_on_task_id', taskId);
  }
}