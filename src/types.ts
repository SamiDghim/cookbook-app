import { z } from 'zod';

export const RecipeSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  ingredients: z.array(z.string().min(1, 'Ingredient cannot be empty')).min(1, 'At least one ingredient is required'),
  steps: z.array(z.string().min(1, 'Step cannot be empty')).min(1, 'At least one step is required'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type Recipe = z.infer<typeof RecipeSchema>;

export type CreateRecipeInput = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRecipeInput = Partial<CreateRecipeInput>;
