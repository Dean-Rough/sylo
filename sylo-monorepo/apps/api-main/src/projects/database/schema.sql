-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create task dependencies table
CREATE TABLE IF NOT EXISTS public.task_dependencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  depends_on_task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Ensure a task cannot depend on itself
  CONSTRAINT task_cannot_depend_on_itself CHECK (task_id != depends_on_task_id),
  -- Ensure unique dependencies
  UNIQUE (task_id, depends_on_task_id)
);

-- Add Row Level Security (RLS) policies
-- Projects RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY projects_select_policy ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY projects_insert_policy ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY projects_update_policy ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY projects_delete_policy ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Tasks RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Allow users to select tasks if they own the project
CREATE POLICY tasks_select_policy ON public.tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Allow users to insert tasks if they own the project
CREATE POLICY tasks_insert_policy ON public.tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Allow users to update tasks if they own the project
CREATE POLICY tasks_update_policy ON public.tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Allow users to delete tasks if they own the project
CREATE POLICY tasks_delete_policy ON public.tasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Task Dependencies RLS
ALTER TABLE public.task_dependencies ENABLE ROW LEVEL SECURITY;

-- Allow users to select task dependencies if they own the project that contains the tasks
CREATE POLICY task_dependencies_select_policy ON public.task_dependencies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tasks
      JOIN public.projects ON tasks.project_id = projects.id
      WHERE tasks.id = task_dependencies.task_id
      AND projects.user_id = auth.uid()
    )
  );

-- Allow users to insert task dependencies if they own the project that contains the tasks
CREATE POLICY task_dependencies_insert_policy ON public.task_dependencies
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tasks t1
      JOIN public.projects p1 ON t1.project_id = p1.id
      JOIN public.tasks t2 ON t2.id = task_dependencies.depends_on_task_id
      WHERE t1.id = task_dependencies.task_id
      AND t1.project_id = t2.project_id
      AND p1.user_id = auth.uid()
    )
  );

-- Allow users to delete task dependencies if they own the project that contains the tasks
CREATE POLICY task_dependencies_delete_policy ON public.task_dependencies
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.tasks
      JOIN public.projects ON tasks.project_id = projects.id
      WHERE tasks.id = task_dependencies.task_id
      AND projects.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_task_dependencies_task_id ON public.task_dependencies(task_id);
CREATE INDEX IF NOT EXISTS idx_task_dependencies_depends_on_task_id ON public.task_dependencies(depends_on_task_id);