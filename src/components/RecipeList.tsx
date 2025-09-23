import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Edit, Clock, ChefHat } from 'lucide-react';
import { useState, useRef } from 'react';
import { fetchRecipes, deleteRecipe, createRecipe, restoreRecipe } from '../api/recipes';
import type { Recipe } from '../types';
import Modal from './Modal';
import { useToast } from './Toast';

interface Props {
  onSelect: (r: Recipe) => void;
}

export default function RecipeList({ onSelect }: Props) {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ 
    queryKey: ['recipes'], 
    queryFn: fetchRecipes 
  });

  const toast = useToast();
  const [toDelete, setToDelete] = useState<Recipe | null>(null);

  // hold the last deleted recipe to support undo
  const lastDeletedRef = useRef<Recipe | null>(null);

  const del = useMutation({
    mutationFn: (id: string | number) => deleteRecipe(id as any),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recipes'] });
      // show undo toast
      toast.push({ type: 'success', message: 'Recipe deleted', action: { label: 'Undo', onClick: async () => {
        if (!lastDeletedRef.current) return;
        const r = lastDeletedRef.current;
        try {
          // call restore endpoint to preserve id/timestamps
          await restoreRecipe(r.id as unknown as string);
          qc.invalidateQueries({ queryKey: ['recipes'] });
          toast.push({ type: 'success', message: 'Recipe restored' });
        } catch (e) {
          // console.error('Failed to restore via API, falling back to recreate', e);
          try {
            await createRecipe({ title: r.title, description: r.description, ingredients: r.ingredients, steps: r.steps });
            qc.invalidateQueries({ queryKey: ['recipes'] });
            toast.push({ type: 'success', message: 'Recipe restored' });
          } catch (err) {
            toast.push({ type: 'error', message: 'Failed to restore recipe' });
          }
        }
      } } });
      setToDelete(null);
    },
    onError: (err: any) => {
  // console.error('Failed to delete recipe:', err);
      toast.push({ type: 'error', message: err?.message || 'Failed to delete recipe' });
      setToDelete(null);
    }
  });

  

  if (isLoading) return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      <span className="ml-2">Loading recipes...</span>
    </div>
  );
  
  if (error) return (
    <div className="text-red-600 p-4 bg-red-50 rounded-lg">
      <p>Failed to load recipes. Please try again.</p>
    </div>
  );

  const contentHidden = !!toDelete;

  return (
    <div className="space-y-4" hidden={contentHidden}>
      {data?.map((recipe) => (
        <div key={recipe.id} className="card border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <ChefHat className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-lg text-gray-800">{recipe.title}</h3>
              </div>
              <p className="text-gray-600 mb-3">{recipe.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Ingredients ({recipe.ingredients.length})</h4>
                  <ul className="text-gray-600 space-y-1">
                    {recipe.ingredients.slice(0, 3).map((ingredient) => (
                      <li key={ingredient} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                        {ingredient}
                      </li>
                    ))}
                    {recipe.ingredients.length > 3 && (
                      <li className="text-blue-600 font-medium">
                        +{recipe.ingredients.length - 3} more...
                      </li>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Steps ({recipe.steps.length})</h4>
                  <ul className="text-gray-600 space-y-1">
                    {recipe.steps.slice(0, 2).map((step, idx) => (
                      <li key={step} className="flex items-start">
                        <span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="line-clamp-2">{step}</span>
                      </li>
                    ))}
                    {recipe.steps.length > 2 && (
                      <li className="text-green-600 font-medium ml-7">
                        +{recipe.steps.length - 2} more steps...
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {recipe.createdAt && (
                <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  Created: {new Date(recipe.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-2 ml-4">
              <button 
                type="button"
                className="btn btn-secondary flex items-center gap-2 text-sm px-3 py-2"
                onClick={() => onSelect(recipe)}
                title="Edit recipe"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button 
                type="button"
                className="btn bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-2 text-sm px-3 py-2"
                onClick={() => setToDelete(recipe)}
                disabled={del.isPending}
                title="Delete recipe"
              >
                <Trash2 className="w-4 h-4" />
                {del.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {data?.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No recipes yet</h3>
          <p className="text-gray-500">Start by creating your first recipe above!</p>
        </div>
      )}
      <Modal
        open={!!toDelete}
        title="Delete recipe"
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) {
            lastDeletedRef.current = toDelete;
            del.mutate(toDelete.id!);
          }
        }}
      >
        <p>Are you sure you want to delete <strong>{toDelete?.title}</strong>?</p>
        {/* add attributes to make modal delete button uniquely queryable in tests */}
        <div style={{ display: 'none' }} data-testid="modal-hidden" />
      </Modal>
    </div>
  );
}
