import React, { useState } from 'react';
import { X, UserPlus, Mail, Lock, Calendar, Shield, Globe } from 'lucide-react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  subscription_days: number;
  allowed_ips: string;
}

export function CreateUserModal({ isOpen, onClose, onUserCreated }: CreateUserModalProps) {
  const [form, setForm] = useState<CreateUserForm>({
    name: '',
    email: '',
    password: '',
    role: 'user',
    subscription_days: 30,
    allowed_ips: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      // Prepare the data
      const userData = {
        ...form,
        allowed_ips: form.allowed_ips.split(',').map(ip => ip.trim()).filter(ip => ip)
      };

      const response = await fetch(`${apiUrl}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const result = await response.json();

      if (result.success) {
        // Reset form
        setForm({
          name: '',
          email: '',
          password: '',
          role: 'user',
          subscription_days: 30,
          allowed_ips: ''
        });
        onUserCreated();
        onClose();
      } else {
        setError(result.error || 'Erro ao criar usuário');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateUserForm, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-purple-500/20 shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Criar Novo Usuário</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-purple-400" />
              Nome Completo
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              placeholder="Digite o nome completo"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-400" />
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              placeholder="usuario@exemplo.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              Senha
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              placeholder="Digite uma senha segura"
              required
              minLength={6}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              Função
            </label>
            <select
              value={form.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
            >
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {/* Subscription Days */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              Dias de Assinatura
            </label>
            <input
              type="number"
              value={form.subscription_days}
              onChange={(e) => handleInputChange('subscription_days', parseInt(e.target.value) || 0)}
              className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              placeholder="30"
              min="0"
              required
            />
          </div>

          {/* Allowed IPs */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-400" />
              IPs Permitidos
            </label>
            <input
              type="text"
              value={form.allowed_ips}
              onChange={(e) => handleInputChange('allowed_ips', e.target.value)}
              className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              placeholder="192.168.1.1, 10.0.0.1 (separados por vírgula)"
            />
            <p className="text-gray-400 text-xs mt-1">
              Deixe em branco para permitir qualquer IP
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Criando...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Criar Usuário
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={showCreateUser}
        onClose={() => setShowCreateUser(false)}
        onUserCreated={() => {
          fetchUsers();
          setShowCreateUser(false);
        }}
      />
    </div>
  );