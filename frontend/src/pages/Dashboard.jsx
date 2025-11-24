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
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Lista de Produtos</h2>
          <Link to="/product/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            + Novo Produto
          </Link>
        </div>

        <div className="mb-6">
            <input 
                type="text"
                placeholder="Buscar por nome..."
                className="w-full p-3 border rounded shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">Descrição</th>
                <th className="p-3 text-center">Estoque Atual</th>
                <th className="p-3 text-center">Mínimo</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3 text-sm text-gray-600">{product.description}</td>
                  <td className={`p-3 text-center font-bold ${product.is_low_stock ? 'text-red-600' : 'text-green-600'}`}>
                    {product.current_stock}
                  </td>
                  <td className="p-3 text-center">{product.min_stock}</td>
                  <td className="p-3 text-center space-x-2">
                    <Link to={`/product/edit/${product.id}`} className="text-blue-600 hover:underline">Editar</Link>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p className="p-4 text-center text-gray-500">Nenhum produto encontrado.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;