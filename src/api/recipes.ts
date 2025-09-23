import { api } from './client';
import type { Recipe, CreateRecipeInput, UpdateRecipeInput } from '../types';

// READ operations
export const fetchRecipes = async (): Promise<Recipe[]> => {
  // console.log('[api] fetchRecipes ->', api.defaults.baseURL, '/recipes');
  const response = await api.get<Recipe[]>('/api/recipes');
  return response.data;
};

export const fetchRecipe = async (id: string): Promise<Recipe> => {
  // console.log('[api] fetchRecipe ->', api.defaults.baseURL, `/recipes/${id}`);
  const response = await api.get<Recipe>(`/api/recipes/${id}`);
  return response.data;
};

// CREATE operation
export const createRecipe = async (data: CreateRecipeInput): Promise<Recipe> => {
  // console.log('[api] createRecipe ->', api.defaults.baseURL, '/recipes', data);
  const response = await api.post<Recipe>('/api/recipes', {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return response.data;
};

// UPDATE operation
export const updateRecipe = async (id: string, data: UpdateRecipeInput): Promise<Recipe> => {
  // console.log('[api] updateRecipe ->', api.defaults.baseURL, `/recipes/${id}`, data);
  const response = await api.put<Recipe>(`/api/recipes/${id}`, {
    ...data,
    updatedAt: new Date().toISOString()
  });
  return response.data;
};

// DELETE operation
export const deleteRecipe = async (id: string): Promise<void> => {
  // console.log('[api] deleteRecipe ->', api.defaults.baseURL, `/recipes/${id}`);
  const resp = await api.delete(`/api/recipes/${id}`);
  return resp.data;
};

// RESTORE operation (soft-restore)
export const restoreRecipe = async (id: string): Promise<Recipe> => {
  // console.log('[api] restoreRecipe ->', api.defaults.baseURL, `/recipes/${id}/restore`);
  const resp = await api.post<Recipe>(`/api/recipes/${id}/restore`);
  return resp.data;
};
