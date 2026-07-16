import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ProjectDetail from './pages/ProjectDetail';
import Maintenance from './pages/Maintenance';
import AdminDashboard from './pages/AdminDashboard';

// Guardiao de rotas para o modo de manutencao
const Gatekeeper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const hasAccess = localStorage.getItem('ingrid_access_token') === 'true';
  return hasAccess ? <>{children}</> : <Navigate to="/manutencao" replace />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota publica da tela de manutencao */}
        <Route path="/manutencao" element={<Maintenance />} />

        {/* Rotas protegidas do portfolio */}
        <Route path="/" element={
          <Gatekeeper>
            <Layout>
              <Home />
            </Layout>
          </Gatekeeper>
        } />
        <Route path="/sobre" element={
          <Gatekeeper>
            <Layout>
              <About />
            </Layout>
          </Gatekeeper>
        } />
        <Route path="/expertise" element={
          <Gatekeeper>
            <Layout>
              <Services />
            </Layout>
          </Gatekeeper>
        } />
        <Route path="/projeto/:id" element={
          <Gatekeeper>
            <Layout>
              <ProjectDetail />
            </Layout>
          </Gatekeeper>
        } />

        {/* Painel Administrativo */}
        <Route path="/admin" element={
          <Gatekeeper>
            <AdminDashboard />
          </Gatekeeper>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
