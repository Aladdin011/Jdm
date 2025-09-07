import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { errorLogger, logDashboardAction } from '@/utils/errorLogger';
import { authAPI, projectsAPI, usersAPI, contactAPI } from '@/services/api';

interface ActionState {
  loading: boolean;
  error: string | null;
}

export const useDashboardActions = (componentName: string) => {
  const [actionStates, setActionStates] = useState<Record<string, ActionState>>({});

  const setActionState = useCallback((action: string, state: Partial<ActionState>) => {
    setActionStates(prev => ({
      ...prev,
      [action]: { ...prev[action], ...state }
    }));
  }, []);

  const executeAction = useCallback(async (
    actionName: string,
    actionFn: () => Promise<any>,
    successMessage?: string,
    errorMessage?: string
  ) => {
    setActionState(actionName, { loading: true, error: null });
    
    try {
      const result = await actionFn();
      setActionState(actionName, { loading: false, error: null });
      
      if (successMessage) {
        toast.success(successMessage);
      }
      
      logDashboardAction(componentName, actionName, true, undefined, { result });
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : errorMessage || 'Action failed';
      setActionState(actionName, { loading: false, error: errorMsg });
      
      toast.error(errorMsg);
      logDashboardAction(componentName, actionName, false, error as Error);
      throw error;
    }
  }, [componentName, setActionState]);

  // User Management Actions
  const createUser = useCallback(async (userData: any) => {
    return executeAction(
      'createUser',
      () => authAPI.register(userData),
      'User created successfully',
      'Failed to create user'
    );
  }, [executeAction]);

  const updateUser = useCallback(async (userId: string, userData: any) => {
    return executeAction(
      'updateUser',
      () => usersAPI.updateProfile(userData),
      'User updated successfully',
      'Failed to update user'
    );
  }, [executeAction]);

  const deleteUser = useCallback(async (userId: string) => {
    return executeAction(
      'deleteUser',
      async () => {
        // Implement delete user API call
        throw new Error('Delete user API not implemented');
      },
      'User deleted successfully',
      'Failed to delete user'
    );
  }, [executeAction]);

  // Project Management Actions
  const createProject = useCallback(async (projectData: any) => {
    return executeAction(
      'createProject',
      () => projectsAPI.create(projectData),
      'Project created successfully',
      'Failed to create project'
    );
  }, [executeAction]);

  const updateProject = useCallback(async (projectId: string, projectData: any) => {
    return executeAction(
      'updateProject',
      () => projectsAPI.update(projectId, projectData),
      'Project updated successfully',
      'Failed to update project'
    );
  }, [executeAction]);

  const deleteProject = useCallback(async (projectId: string) => {
    return executeAction(
      'deleteProject',
      () => projectsAPI.delete(projectId),
      'Project deleted successfully',
      'Failed to delete project'
    );
  }, [executeAction]);

  // Task Management Actions
  const createTask = useCallback(async (taskData: any) => {
    return executeAction(
      'createTask',
      async () => {
        // Mock implementation - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { id: Date.now().toString(), ...taskData };
      },
      'Task created successfully',
      'Failed to create task'
    );
  }, [executeAction]);

  const updateTask = useCallback(async (taskId: string, taskData: any) => {
    return executeAction(
      'updateTask',
      async () => {
        // Mock implementation - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 800));
        return { id: taskId, ...taskData };
      },
      'Task updated successfully',
      'Failed to update task'
    );
  }, [executeAction]);

  const deleteTask = useCallback(async (taskId: string) => {
    return executeAction(
      'deleteTask',
      async () => {
        // Mock implementation - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 500));
        return { deleted: true };
      },
      'Task deleted successfully',
      'Failed to delete task'
    );
  }, [executeAction]);

  // Leave Management Actions
  const approveLeave = useCallback(async (leaveId: string, employeeName: string) => {
    return executeAction(
      'approveLeave',
      async () => {
        // Mock implementation - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { id: leaveId, status: 'approved' };
      },
      `Leave request approved for ${employeeName}`,
      'Failed to approve leave request'
    );
  }, [executeAction]);

  const rejectLeave = useCallback(async (leaveId: string, employeeName: string) => {
    return executeAction(
      'rejectLeave',
      async () => {
        // Mock implementation - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { id: leaveId, status: 'rejected' };
      },
      `Leave request rejected for ${employeeName}`,
      'Failed to reject leave request'
    );
  }, [executeAction]);

  // Document Management Actions
  const uploadDocument = useCallback(async (file: File, type: string) => {
    return executeAction(
      'uploadDocument',
      async () => {
        // Mock implementation - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { id: Date.now().toString(), name: file.name, type, size: file.size };
      },
      'Document uploaded successfully',
      'Failed to upload document'
    );
  }, [executeAction]);

  const downloadDocument = useCallback(async (documentId: string, fileName: string) => {
    return executeAction(
      'downloadDocument',
      async () => {
        // Mock implementation - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { url: `#download-${documentId}` };
      },
      `${fileName} downloaded successfully`,
      'Failed to download document'
    );
  }, [executeAction]);

  // System Actions
  const refreshData = useCallback(async (dataType: string) => {
    return executeAction(
      'refreshData',
      async () => {
        // Mock implementation - replace with actual API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { refreshed: true, timestamp: new Date().toISOString() };
      },
      `${dataType} data refreshed successfully`,
      `Failed to refresh ${dataType} data`
    );
  }, [executeAction]);

  const exportData = useCallback(async (dataType: string, format: string) => {
    return executeAction(
      'exportData',
      async () => {
        // Mock implementation - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { url: `#export-${dataType}-${format}` };
      },
      `${dataType} exported as ${format} successfully`,
      `Failed to export ${dataType} data`
    );
  }, [executeAction]);

  // Generic action executor for custom actions
  const customAction = useCallback(async (
    actionName: string,
    actionFn: () => Promise<any>,
    successMessage?: string,
    errorMessage?: string
  ) => {
    return executeAction(actionName, actionFn, successMessage, errorMessage);
  }, [executeAction]);

  return {
    actionStates,
    // User actions
    createUser,
    updateUser,
    deleteUser,
    // Project actions
    createProject,
    updateProject,
    deleteProject,
    // Task actions
    createTask,
    updateTask,
    deleteTask,
    // Leave actions
    approveLeave,
    rejectLeave,
    // Document actions
    uploadDocument,
    downloadDocument,
    // System actions
    refreshData,
    exportData,
    // Generic action
    customAction,
    // Utility
    isLoading: (action: string) => actionStates[action]?.loading || false,
    getError: (action: string) => actionStates[action]?.error || null,
  };
};

export default useDashboardActions;
