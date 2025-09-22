import { useEffect, useState } from 'react';
import { fetchRecipes } from '../api/recipes';

export default function PublicPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchRecipes()
      .then((list) => setRecipes(list))
      .catch((e) => setError(e?.response?.data?.message || 'Failed to load recipes'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-8">
      <div className="card">
        <h1 className="text-2xl font-bold mb-4">Public Recipes</h1>
        <p className="text-sm text-gray-600 mb-4">Browse publicly available recipes. No login required.</p>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="space-y-4">
            {recipes.map((r) => (
              <div key={r.id} className="card">
                <h3 className="font-semibold text-lg">{r.title}</h3>
                <p className="text-gray-600">{r.description}</p>
                <div className="mt-2 text-sm text-gray-500">Ingredients: {r.ingredients?.length || 0} • Steps: {r.steps?.length || 0}</div>
              </div>
            ))}
            {recipes.length === 0 && <div className="text-gray-500">No recipes found.</div>}
          </div>
        )}
      </div>
    </div>
  );
}
