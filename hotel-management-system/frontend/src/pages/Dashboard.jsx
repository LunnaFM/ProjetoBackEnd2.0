import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { clienteService } from '../services/clienteService';
import { quartoService } from '../services/quartoService';
import { reservaService } from '../services/reservaService';
import { Users, Bed, CheckCircle, Calendar, Clock, Sparkles } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalQuartos: 0,
    quartosDisponiveis: 0,
    totalReservas: 0,
    reservasPendentes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [clientes, quartos, quartosDisp, reservas] = await Promise.all([
        clienteService.listar(),
        quartoService.listar(),
        quartoService.listarDisponiveis(),
        reservaService.listar()
      ]);

      const reservasPendentes = reservas.data.filter(
        r => r.status === 'pendente'
      );

      setStats({
        totalClientes: clientes.total,
        totalQuartos: quartos.total,
        quartosDisponiveis: quartosDisp.total,
        totalReservas: reservas.total,
        reservasPendentes: reservasPendentes.length
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
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
      <div className="dashboard">
        <h1 className="page-title">Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={48} color="#7c3aed" strokeWidth={2} />
            </div>
            <div className="stat-info">
              <h3>Clientes</h3>
              <p className="stat-number">{stats.totalClientes}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Bed size={48} color="#7c3aed" strokeWidth={2} />
            </div>
            <div className="stat-info">
              <h3>Total de Quartos</h3>
              <p className="stat-number">{stats.totalQuartos}</p>
            </div>
          </div>

          <div className="stat-card highlight">
            <div className="stat-icon">
              <CheckCircle size={48} color="#ffffff" strokeWidth={2} />
            </div>
            <div className="stat-info">
              <h3>Quartos Disponíveis</h3>
              <p className="stat-number">{stats.quartosDisponiveis}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Calendar size={48} color="#7c3aed" strokeWidth={2} />
            </div>
            <div className="stat-info">
              <h3>Total de Reservas</h3>
              <p className="stat-number">{stats.totalReservas}</p>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">
              <Clock size={48} color="#ffffff" strokeWidth={2} />
            </div>
            <div className="stat-info">
              <h3>Reservas Pendentes</h3>
              <p className="stat-number">{stats.reservasPendentes}</p>
            </div>
          </div>
        </div>

        <div className="welcome-section">
          <h2>
            <Sparkles 
              size={32} 
              color="#7c3aed" 
              strokeWidth={2}
              style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }}
            />
            Bem-vindo ao Sistema de Gerenciamento de Hotel!
          </h2>
          <p>
            Use o menu de navegação acima para gerenciar clientes, quartos e
            reservas.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;