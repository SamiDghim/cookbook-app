import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Minus, Save, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { RecipeSchema, type Recipe, type CreateRecipeInput } from '../types';

interface Props {
  initial?: Recipe | null;
  onSubmit: (data: CreateRecipeInput) => void;
  onCancel?: () => void;
}

export default function RecipeForm({ initial, onSubmit, onCancel }: Props) {
  const [ingredients, setIngredients] = useState<string[]>(
    initial?.ingredients || ['']
  );
  const [steps, setSteps] = useState<string[]>(
    initial?.steps || ['']
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateRecipeInput>({
    resolver: zodResolver(RecipeSchema.omit({ id: true, createdAt: true, updatedAt: true })),
    defaultValues: initial ?? { 
      title: '', 
      description: '', 
      ingredients: [''], 
      steps: [''] 
    },
  });

  // Reset form and controlled lists when the `initial` prop changes
  useEffect(() => {
    if (initial) {
      reset({
        title: initial.title,
        description: initial.description,
        ingredients: initial.ingredients && initial.ingredients.length ? initial.ingredients : [''],
        steps: initial.steps && initial.steps.length ? initial.steps : ['']
      });
      setIngredients(initial.ingredients && initial.ingredients.length ? initial.ingredients : ['']);
      setSteps(initial.steps && initial.steps.length ? initial.steps : ['']);
    } else {
      reset({ title: '', description: '', ingredients: [''], steps: [''] });
      setIngredients(['']);
      setSteps(['']);
    }
  }, [initial, reset]);

  const addIngredient = () => {
    const newIngredients = [...ingredients, ''];
    setIngredients(newIngredients);
    setValue('ingredients', newIngredients);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
      setValue('ingredients', newIngredients);
    }
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
    setValue('ingredients', newIngredients);
  };

  const addStep = () => {
    const newSteps = [...steps, ''];
    setSteps(newSteps);
    setValue('steps', newSteps);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, i) => i !== index);
      setSteps(newSteps);
      setValue('steps', newSteps);
    }
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
    setValue('steps', newSteps);
  };

  const handleFormSubmit = (data: CreateRecipeInput) => {
    const filteredData = {
      ...data,
      ingredients: ingredients.filter(ing => ing.trim() !== ''),
      steps: steps.filter(step => step.trim() !== '')
    };
    onSubmit(filteredData);
    if (!initial) {
      reset();
      setIngredients(['']);
      setSteps(['']);
    }
  };

  let submitText = 'Save Recipe';
  if (isSubmitting) {
    submitText = 'Saving...';
  } else if (initial) {
    submitText = 'Update Recipe';
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Title */}
      <div>
        <label htmlFor="recipe-title" className="label text-sm font-medium text-gray-700">Recipe Title *</label>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <input 
          id="recipe-title"
          className="input w-full mt-1" 
          placeholder="Enter recipe title..."
          {...register('title')} 
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="recipe-description" className="label text-sm font-medium text-gray-700">Description *</label>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <textarea 
          id="recipe-description"
          className="input w-full mt-1" 
          rows={3} 
          placeholder="Describe your recipe..."
          {...register('description')} 
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Ingredients */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label htmlFor="ingredients-list" className="label text-sm font-medium text-gray-700">Ingredients *</label>
          <button
            type="button"
            onClick={addIngredient}
            className="btn btn-secondary text-sm flex items-center gap-1 px-3 py-1"
          >
            <Plus className="w-4 h-4" />
            Add Ingredient
          </button>
        </div>
        
        <div className="space-y-2">
          {ingredients.map((ingredient, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} className="flex gap-2">
              <input
                id={`ingredient-${index}`}
                aria-label={`Ingredient ${index + 1}`}
                className="input flex-1"
                placeholder={`Ingredient ${index + 1}...`}
                value={ingredient}
                onChange={(e) => updateIngredient(index, e.target.value)}
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="btn bg-red-50 text-red-600 hover:bg-red-100 p-2"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.ingredients && (
          <p className="text-red-600 text-sm mt-1">{errors.ingredients.message}</p>
        )}
      </div>

      {/* Steps */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label htmlFor="instructions-list" className="label text-sm font-medium text-gray-700">Instructions *</label>
          <button
            type="button"
            onClick={addStep}
            className="btn btn-secondary text-sm flex items-center gap-1 px-3 py-1"
          >
            <Plus className="w-4 h-4" />
            Add Step
          </button>
        </div>
        
        <div className="space-y-3">
          {steps.map((step, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} className="flex gap-2">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                {index + 1}
              </div>
              <textarea
                id={`step-${index}`}
                aria-label={`Step ${index + 1}`}
                className="input flex-1"
                rows={2}
                placeholder={`Step ${index + 1} instructions...`}
                value={step}
                onChange={(e) => updateStep(index, e.target.value)}
              />
              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="btn bg-red-50 text-red-600 hover:bg-red-100 p-2 mt-1"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.steps && (
          <p className="text-red-600 text-sm mt-1">{errors.steps.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="btn btn-primary flex items-center gap-2 px-6"
        >
          <Save className="w-4 h-4" />
          {submitText}
        </button>
        
        {(initial || onCancel) && (
          <button 
            type="button"
            onClick={() => {
              if (onCancel) {
                onCancel();
              } else {
                reset();
                setIngredients(['']);
                setSteps(['']);
              }
            }}
            className="btn btn-secondary flex items-center gap-2 px-6"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
