import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    min_stock: 0,
    current_stock: 0,
    material: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      api.get(`/products/${id}/`)
        .then(response => setFormData(response.data))
        .catch(err => setError('Erro ao carregar dados do produto.'));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || formData.min_stock < 0) {
      setError('Por favor, preencha o nome e certifique-se que o estoque não é negativo.');
      return;
    }

    try {
      if (isEditMode) {
        await api.put(`/products/${id}/`, formData);
      } else {
        await api.post('/products/', formData);
      }
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.name?.[0] || 'Erro ao salvar. Verifique se o nome já existe.';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditMode ? 'Editar Produto' : 'Novo Produto'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Campo Nome */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Nome do Produto *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:outline-blue-500"
              required
            />
          </div>

          {/* Campo Descrição */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Descrição</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:outline-blue-500"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campo Material */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">Material</label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:outline-blue-500"
              />
            </div>
            
            {/* Campo Estoque Mínimo */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">Estoque Mínimo *</label>
              <input
                type="number"
                name="min_stock"
                value={formData.min_stock}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:outline-blue-500"
                min="0"
                required
              />
            </div>
          </div>

          {!isEditMode && (
             <div>
               <label className="block text-gray-700 font-bold mb-2">Estoque Inicial</label>
               <input
                 type="number"
                 name="current_stock"
                 value={formData.current_stock}
                 onChange={handleChange}
                 className="w-full border p-2 rounded focus:outline-blue-500"
                 min="0"
               />
               <p className="text-sm text-gray-500 mt-1">
                 * Ajustes posteriores devem ser feitos via Movimentação.
               </p>
             </div>
          )}

          <div className="flex justify-between pt-4">
            <Link to="/dashboard" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
              Cancelar
            </Link>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-bold">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;