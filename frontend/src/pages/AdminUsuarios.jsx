import React, { useState, useEffect } from 'react';
import { listarUsuarios, criarUsuario, atualizarUsuario, deletarUsuario } from '../api/usuarios';
import Alert from '../components/shared/Alert';
import Spinner from '../components/shared/Spinner';
import Modal from '../components/shared/Modal';
import styles from './AdminUsuarios.module.css';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'padrao',
  });
  const [resetPasswordId, setResetPasswordId] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null); // { type: 'delete', id: number } ou { type: 'reset', id: number }

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await listarUsuarios();
      setUsuarios(response.data);
    } catch (err) {
      setError('Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingId) {
        await atualizarUsuario(editingId, formData);
        setSuccess('Usuário atualizado com sucesso.');
        setEditingId(null);
      } else {
        await criarUsuario(formData);
        setSuccess('Usuário criado com sucesso.');
      }
      setFormData({ username: '', password: '', email: '', role: 'padrao' });
      fetchUsuarios();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar usuário.');
    }
  };

  const handleEdit = (usuario) => {
    setEditingId(usuario.id);
    setFormData({
      username: usuario.username,
      password: '',
      email: usuario.email || '',
      role: usuario.role,
    });
    setError('');
    setSuccess('');
  };

  const handleDeleteClick = (id) => {
    setModalAction({ type: 'delete', id });
    setModalOpen(true);
  };

  const handleResetClick = (id) => {
    setModalAction({ type: 'reset', id });
    setModalOpen(true);
  };

  const confirmModal = async () => {
    if (!modalAction) return;
    const { type, id } = modalAction;
    try {
      if (type === 'delete') {
        await deletarUsuario(id);
        setSuccess('Usuário excluído com sucesso.');
      } else if (type === 'reset') {
        if (!newPassword || newPassword.length < 6) {
          setError('A nova senha deve ter pelo menos 6 caracteres.');
          setModalOpen(false);
          setModalAction(null);
          return;
        }
        await atualizarUsuario(id, { password: newPassword });
        setSuccess('Senha redefinida com sucesso.');
        setNewPassword('');
      }
      fetchUsuarios();
    } catch (err) {
      setError('Erro ao executar ação.');
    } finally {
      setModalOpen(false);
      setModalAction(null);
    }
  };

  const cancelModal = () => {
    setModalOpen(false);
    setModalAction(null);
    setNewPassword('');
  };

  const renderModal = () => {
    if (!modalAction) return null;
    if (modalAction.type === 'delete') {
      return (
        <Modal
          isOpen={modalOpen}
          title="Confirmar exclusão"
          message="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
          onConfirm={confirmModal}
          onCancel={cancelModal}
          confirmText="Excluir"
          cancelText="Cancelar"
        />
      );
    } else if (modalAction.type === 'reset') {
      return (
        <Modal
          isOpen={modalOpen}
          title="Redefinir Senha"
          message={
            <div>
              <p>Digite a nova senha para o usuário (mínimo 6 caracteres):</p>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nova senha"
                className={styles.modalInput}
              />
            </div>
          }
          onConfirm={confirmModal}
          onCancel={cancelModal}
          confirmText="Confirmar"
          cancelText="Cancelar"
        />
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <Spinner />
        <p className={styles.loadingText}>Carregando usuários...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Gerenciar Usuários</h2>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} onClose={() => setSuccess('')} />

      <div className={styles.formSection}>
        <h3>{editingId ? 'Editar Usuário' : 'Criar Novo Usuário'}</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Usuário *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Senha {editingId ? '(deixe em branco para manter)' : '*'}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!editingId}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Função</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="padrao">Usuário Padrão</option>
                <option value="relatorios">Usuário de Relatórios</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.btnPrimary}>
              {editingId ? 'Atualizar' : 'Criar'}
            </button>
            {editingId && (
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => {
                  setEditingId(null);
                  setFormData({ username: '', password: '', email: '', role: 'padrao' });
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className={styles.tableWrapper}>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuário</th>
              <th>Email</th>
              <th>Função</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email || '-'}</td>
                <td>{user.role}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className={styles.btnEdit} onClick={() => handleEdit(user)}>Editar</button>
                    <button className={styles.btnReset} onClick={() => handleResetClick(user.id)}>Resetar Senha</button>
                    <button className={styles.btnDelete} onClick={() => handleDeleteClick(user.id)}>Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhum usuário cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {renderModal()}
    </div>
  );
};

export default AdminUsuarios;