import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ChefHat, Plus } from 'lucide-react';
import RecipeForm from '../components/RecipeForm';
import RecipeList from '../components/RecipeList';
import { createRecipe, updateRecipe } from '../api/recipes';
import type { Recipe, CreateRecipeInput, UpdateRecipeInput } from '../types';
import { useToast } from '../components/Toast';

export default function Recipes() {
  const qc = useQueryClient();
  const toast = useToast();
  const [editing, setEditing] = useState<Recipe | null>(null);
  const [showForm, setShowForm] = useState(false);

  const create = useMutation({
    mutationFn: createRecipe,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recipes'] });
      setShowForm(false);
      toast.push({ type: 'success', message: 'Recipe created' });
    },
    onError: (error) => {
      console.error('Failed to create recipe:', error);
      toast.push({ type: 'error', message: 'Failed to create recipe' });
    }
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecipeInput }) => updateRecipe(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recipes'] });
      setEditing(null);
      toast.push({ type: 'success', message: 'Recipe updated' });
    },
    onError: (error) => {
      console.error('Failed to update recipe:', error);
      toast.push({ type: 'error', message: 'Failed to update recipe' });
    }
  });

  const handleSubmit = (data: CreateRecipeInput) => {
    if (editing?.id) {
      update.mutate({ id: editing.id, data });
    } else {
      create.mutate(data);
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (recipe: Recipe) => {
    setEditing(recipe);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <ChefHat className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Recipe Manager</h1>
        </div>
        <p className="text-gray-600">Create, edit, and organize your favorite recipes</p>
      </div>

      {/* Add Recipe Button */}
      {!showForm && (
        <div className="text-center">
          <button
            onClick={handleAddNew}
            className="btn btn-primary flex items-center gap-2 mx-auto px-6 py-3"
          >
            <Plus className="w-5 h-5" />
            Add New Recipe
          </button>
        </div>
      )}

      {/* Recipe Form */}
      {showForm && (
        <div className="card">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-blue-600" />
            {editing ? 'Edit Recipe' : 'Add New Recipe'}
          </h2>
          <RecipeForm
            initial={editing}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Recipe List */}
      <div className="card">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <ChefHat className="w-6 h-6 text-blue-600" />
          Your Recipes
        </h2>
        <RecipeList onSelect={handleEdit} />
      </div>

      {/* Loading States */}
      {(create.isPending || update.isPending) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            <span>{editing ? 'Updating recipe...' : 'Creating recipe...'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
