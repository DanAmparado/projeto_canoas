import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/shared/ScrollToTop';
import PrivateRoute from './components/shared/PrivateRoute';
import Layout from './components/shared/Layout';
import PublicLayout from './components/shared/PublicLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import FormularioPublico from './pages/FormularioPublico';
import Obrigado from './pages/Obrigado';
import Dashboard from './pages/Dashboard';
import ListagemRespostas from './pages/ListagemRespostas';
import AdminUsuarios from './pages/AdminUsuarios';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          {/* Rotas públicas com navbar própria */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/formulario" element={<FormularioPublico />} />
            <Route path="/obrigado" element={<Obrigado />} />
          </Route>

          {/* Login da área restrita (sem navbar) */}
          <Route path="/gestao/login" element={<Login />} />

          {/* Rotas privadas (área administrativa) */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/gestao/dashboard" element={<Dashboard />} />
              <Route path="/gestao/listagem" element={<ListagemRespostas />} />
              <Route path="/gestao/usuarios" element={<AdminUsuarios />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;