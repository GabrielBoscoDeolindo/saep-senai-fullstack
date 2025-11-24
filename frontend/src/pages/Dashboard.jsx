import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    try {
      const url = searchTerm ? `/products/?search=${searchTerm}` : '/products/';
      const response = await api.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        try {
            await api.delete(`/products/${id}/`);
            fetchProducts();
        } catch (error) {
            alert('Erro ao excluir produto.');
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Lista de Produtos</h2>
          <Link 
            to="/product/new" 
            className="bg-white text-black px-4 py-2 rounded hover:opacity-90 transition shadow-md"
          >
            + Novo Produto
          </Link>
        </div>

        <div className="mb-6">
            <input 
                type="text"
                placeholder="Buscar por nome..."
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-[#512ED9]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {/* Container da Tabela */}
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
          <table className="w-full text-left">
            <thead className="bg-gray-700 text-gray-200 uppercase text-sm">
              <tr>
                <th className="p-3">Nome</th>
                <th className="p-3">Descrição</th>
                <th className="p-3 text-center">Estoque Atual</th>
                <th className="p-3 text-center">Mínimo</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                  <td className="p-3 font-medium text-white">{product.name}</td>
                  <td className="p-3 text-sm text-gray-400">{product.description}</td>
                  <td className={`p-3 text-center font-bold ${
                      product.is_low_stock ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {product.current_stock}
                  </td>
                  <td className="p-3 text-center">{product.min_stock}</td>
                  <td className="p-3 text-center space-x-4">
                    <Link to={`/product/edit/${product.id}`} className="text-blue-400 hover:text-blue-300 transition">Editar</Link>
                    <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-300 transition">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="p-6 text-center text-gray-500">Nenhum produto encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;