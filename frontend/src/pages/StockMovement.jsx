import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const StockMovement = () => {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  
  const [formData, setFormData] = useState({
    product: '',
    movement_type: 'IN',
    quantity: 1,
    movement_date: new Date().toISOString().slice(0, 16)
  });
  
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodResponse, movResponse] = await Promise.all([
        api.get('/products/'),
        api.get('/movements/')
      ]);
      setProducts(prodResponse.data);
      setMovements(movResponse.data);
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      const response = await api.post('/movements/', formData);
      
      fetchData(); 
      
      setFormData(prev => ({ ...prev, quantity: 1 }));

      [cite_start]
      if (response.data.warning) {
        setMessage({ text: response.data.warning, type: 'warning' });
        alert(response.data.warning);
      } else {
        setMessage({ text: 'Movimentação registrada com sucesso!', type: 'success' });
      }

    } catch (error) {
      const errorMsg = error.response?.data?.non_field_errors?.[0] || 'Erro ao registrar movimentação.';
      setMessage({ text: errorMsg, type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestão de Estoque</h2>

        {/* Mensagens */}
        {message.text && (
          <div className={`p-4 rounded mb-6 text-center font-bold ${
            message.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-400' :
            message.type === 'error' ? 'bg-red-100 text-red-800 border border-red-400' :
            'bg-green-100 text-green-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulário de Movimentação */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow h-fit">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Nova Movimentação</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              [cite_start]
              <div>
                <label className="block text-sm font-bold mb-1">Produto</label>
                <select 
                  name="product" 
                  value={formData.product} 
                  onChange={handleChange}
                  className="w-full border p-2 rounded bg-white"
                  required
                >
                  <option value="">Selecione um produto...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Atual: {p.current_stock})</option>
                  ))}
                </select>
              </div>

              [cite_start]
              <div>
                <label className="block text-sm font-bold mb-1">Tipo</label>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="movement_type" 
                      value="IN"
                      checked={formData.movement_type === 'IN'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-green-600 font-bold">Entrada</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="movement_type" 
                      value="OUT"
                      checked={formData.movement_type === 'OUT'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-red-600 font-bold">Saída</span>
                  </label>
                </div>
              </div>

              {/* Quantidade */}
              <div>
                <label className="block text-sm font-bold mb-1">Quantidade</label>
                <input 
                  type="number" 
                  name="quantity" 
                  value={formData.quantity} 
                  onChange={handleChange}
                  min="1"
                  className="w-full border p-2 rounded"
                  required 
                />
              </div>

              [cite_start]
              <div>
                <label className="block text-sm font-bold mb-1">Data e Hora</label>
                <input 
                  type="datetime-local" 
                  name="movement_date" 
                  value={formData.movement_date} 
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required 
                />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition">
                CONFIRMAR
              </button>
            </form>
          </div>

          [cite_start]
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Histórico Recente</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase">
                  <tr>
                    <th className="p-3">Data</th>
                    <th className="p-3">Tipo</th>
                    <th className="p-3">Produto</th>
                    <th className="p-3">Qtd</th>
                    <th className="p-3">Responsável</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((mov) => (
                    <tr key={mov.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{new Date(mov.movement_date).toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          mov.movement_type === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {mov.movement_type === 'IN' ? 'ENTRADA' : 'SAÍDA'}
                        </span>
                      </td>
                      <td className="p-3 font-medium">{mov.product_name}</td>
                      <td className="p-3">{mov.quantity}</td>
                      <td className="p-3 text-gray-500">{mov.user_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StockMovement;