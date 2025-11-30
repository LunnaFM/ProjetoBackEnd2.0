import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { 
  formatCPF, 
  formatPhone, 
  removeFormatting, 
  isValidCPF, 
  isValidPhone, 
  isValidEmail,
  isAdult,
  calculateAge
} from '../utils/utils';
import './Pages.css';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    endereco: '',
    dataNascimento: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setClientes([]);
      setError('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplicar formatação automática
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'telefone') {
      formattedValue = formatPhone(value);
    }

    setFormData({ ...formData, [name]: formattedValue });
  };

  const validateForm = () => {
    // Validação do Nome
    if (!formData.nome.trim()) {
      setError('O campo Nome Completo é obrigatório');
      return false;
    }
    if (formData.nome.trim().length < 3) {
      setError('O nome deve ter pelo menos 3 caracteres');
      return false;
    }

    // Validação do CPF
    if (!formData.cpf.trim()) {
      setError('O campo CPF é obrigatório');
      return false;
    }
    const cpfNumbers = removeFormatting(formData.cpf);
    if (cpfNumbers.length !== 11) {
      setError('O CPF deve conter exatamente 11 dígitos');
      return false;
    }
    if (!isValidCPF(formData.cpf)) {
      setError('CPF inválido. Verifique os números digitados');
      return false;
    }

    // Validação do Email
    if (!formData.email.trim()) {
      setError('O campo Email é obrigatório');
      return false;
    }
    if (!isValidEmail(formData.email)) {
      setError('Email inválido. Use o formato: exemplo@email.com');
      return false;
    }

    // Validação do Telefone
    if (!formData.telefone.trim()) {
      setError('O campo Telefone é obrigatório');
      return false;
    }
    if (!isValidPhone(formData.telefone)) {
      setError('Telefone inválido. Deve conter 10 ou 11 dígitos');
      return false;
    }

    // Validação do Endereço
    if (!formData.endereco.trim()) {
      setError('O campo Endereço é obrigatório');
      return false;
    }
    if (formData.endereco.trim().length < 5) {
      setError('O endereço deve ter pelo menos 5 caracteres');
      return false;
    }

    // Validação da Data de Nascimento
    if (!formData.dataNascimento) {
      setError('O campo Data de Nascimento é obrigatório');
      return false;
    }
    
    const birthDate = new Date(formData.dataNascimento);
    const today = new Date();
    
    if (birthDate > today) {
      setError('A data de nascimento não pode ser futura');
      return false;
    }
    
    if (!isAdult(formData.dataNascimento)) {
      const age = calculateAge(formData.dataNascimento);
      setError(`O cliente deve ser maior de 18 anos. Idade atual: ${age} anos`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      // Remover formatação antes de enviar
      const dataToSend = {
        nome: formData.nome.trim(),
        cpf: removeFormatting(formData.cpf),
        email: formData.email.trim(),
        telefone: removeFormatting(formData.telefone),
        endereco: formData.endereco.trim(),
        dataNascimento: formData.dataNascimento,
      };

      if (editando) {
        await api.put(`/clientes/${editando}`, dataToSend);
        setSuccess('Cliente atualizado com sucesso!');
      } else {
        await api.post('/clientes', dataToSend);
        setSuccess('Cliente cadastrado com sucesso!');
      }

      resetForm();
      carregarClientes();
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Erro ao salvar cliente. Tente novamente.');
      }
    }
  };

  const handleEdit = (cliente) => {
    setEditando(cliente.id);
    setFormData({
      nome: cliente.nome,
      cpf: formatCPF(cliente.cpf),
      email: cliente.email,
      telefone: formatPhone(cliente.telefone),
      endereco: cliente.endereco,
      dataNascimento: cliente.dataNascimento,
    });
    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await api.delete(`/clientes/${id}`);
        setSuccess('Cliente excluído com sucesso!');
        carregarClientes();
      } catch (err) {
        setError('Erro ao excluir cliente');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cpf: '',
      email: '',
      telefone: '',
      endereco: '',
      dataNascimento: '',
    });
    setEditando(null);
    setShowForm(false);
    setError('');
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Carregando...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Gerenciamento de Clientes</h1>
          <button
            className="btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + Novo Cliente
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        {showForm && (
          <div className="form-card">
            <h2>{editando ? 'Editar Cliente' : 'Novo Cliente'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    Nome Completo <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Digite o nome completo"
                  />
                </div>

                <div className="form-group">
                  <label>
                    CPF <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    maxLength="14"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Telefone <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    maxLength="15"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Endereço <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="Rua, número, bairro, cidade"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Data de Nascimento <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editando ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="table-card">
          <h2>Lista de Clientes ({clientes.length})</h2>
          {clientes.length === 0 ? (
            <p className="empty-state">Nenhum cliente cadastrado</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Endereço</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>
                        <strong>{cliente.nome}</strong>
                      </td>
                      <td>{formatCPF(cliente.cpf)}</td>
                      <td>{cliente.email}</td>
                      <td>{formatPhone(cliente.telefone)}</td>
                      <td>{cliente.endereco}</td>
                      <td className="actions">
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => handleEdit(cliente)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleDelete(cliente.id)}
                          title="Excluir"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Clientes;