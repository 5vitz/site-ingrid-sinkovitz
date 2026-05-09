import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { UserRoleDoc, UserRole } from '../../types';
import { Mail, ShieldCheck, Trash2, UserPlus, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserRoleDoc[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('admin');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'users_roles'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => doc.data() as UserRoleDoc);
      setUsers(items);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao carregar usuários:", error);
      setLoading(false);
      // Se der erro de permissão (Missing or insufficient permissions), 
      // pelo menos mostramos a interface vazia ou uma mensagem.
    });
    return () => unsubscribe();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || actionLoading) return;
    
    setActionLoading(true);
    try {
      const emailLower = newEmail.toLowerCase().trim();
      await setDoc(doc(db, 'users_roles', emailLower), {
        email: emailLower,
        role: newRole,
        assignedBy: currentUser?.email || 'system'
      });
      setNewEmail('');
      alert('Usuário autorizado com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao adicionar usuário. Verifique se você tem permissões de Superusuário.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveUser = async (email: string) => {
    if (!confirm(`Deseja remover o acesso de ${email}?`)) return;
    
    setActionLoading(true);
    try {
      await deleteDoc(doc(db, 'users_roles', email));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="animate-pulse text-zinc-500">Carregando usuários...</div>;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">ACL / Gestão de Acessos</h2>
        <p className="text-zinc-500">Controle quem pode acessar o painel administrativo.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Formulário de Adição */}
        <div className="md:col-span-1 glass-morphism p-8 rounded-[8px] border border-white/5 bg-white/[0.02]">
          <h3 className="font-bold flex items-center gap-2 mb-6 text-white/50 text-xs uppercase tracking-widest">
            <UserPlus size={14} /> Novo Acesso
          </h3>
          <form onSubmit={handleAddUser} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">E-mail do Google</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  type="email"
                  required
                  className="w-full bg-zinc-950 border border-white/5 rounded-[8px] pl-12 pr-5 py-3 focus:outline-none focus:border-accent text-sm"
                  placeholder="exemplo@gmail.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Papel / Nível</label>
              <select 
                className="w-full bg-zinc-950 border border-white/5 rounded-[8px] px-5 py-3 focus:outline-none focus:border-accent text-sm appearance-none"
                value={newRole}
                onChange={e => setNewRole(e.target.value as UserRole)}
              >
                <option value="admin">Administrador</option>
                <option value="support">Suporte</option>
                <option value="super">Superusuário</option>
              </select>
            </div>

            <button 
              type="submit"
              disabled={actionLoading}
              className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-[8px] hover:bg-accent transition disabled:opacity-50 text-xs shadow-xl shadow-white/5"
            >
              {actionLoading ? 'Processando...' : 'Autorizar Acesso'}
            </button>
          </form>
        </div>

        {/* Lista de Usuários */}
        <div className="md:col-span-2 glass-morphism p-8 rounded-[8px] border border-white/5 bg-white/[0.02]">
          <h3 className="font-bold flex items-center gap-2 mb-6 text-white/50 text-xs uppercase tracking-widest">
            <ShieldCheck size={14} /> Usuários Autorizados
          </h3>
          
          <div className="space-y-4">
            {users.map((u) => (
              <div key={u.email} className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-[8px] border border-white/5 group">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-[8px] ${u.role === 'super' ? 'bg-purple-500/10 text-purple-500' : 'bg-accent/10 text-accent'}`}>
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-sm tracking-tight">{u.email}</div>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{u.role}</div>
                  </div>
                </div>
                
                {u.email !== currentUser?.email && (
                  <button 
                    onClick={() => handleRemoveUser(u.email)}
                    className="p-3 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-[8px] transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
