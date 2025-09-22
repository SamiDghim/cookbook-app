import { useState } from 'react';
import { fetchRecipes } from '../api/recipes';

export default function PublicSearch() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');

  const doSearch = async (e: any) => {
    e.preventDefault();
    try {
      const list = await fetchRecipes();
      const filtered = list.filter(r => r.title.toLowerCase().includes(q.toLowerCase()) || r.description.toLowerCase().includes(q.toLowerCase()));
      setResults(filtered);
    } catch (err: any) {
      setError('Search failed');
    }
  };

  return (
    <div className="container py-8">
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Search recipes</h2>
        <form onSubmit={doSearch} className="mb-4">
          <input className="input" placeholder="Search by title or description" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="mt-3 text-right">
            <button className="btn btn-primary" type="submit">Search</button>
          </div>
        </form>

        {error && <div className="text-red-600">{error}</div>}

        <div className="space-y-3">
          {results.map(r => (
            <div key={r.id} className="card">
              <h3 className="font-semibold">{r.title}</h3>
              <p className="text-sm text-gray-600">{r.description}</p>
            </div>
          ))}
          {results.length === 0 && <div className="text-gray-500">No results</div>}
        </div>
      </div>
    </div>
  );
}
