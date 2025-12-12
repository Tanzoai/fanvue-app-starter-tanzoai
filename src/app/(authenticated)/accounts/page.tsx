'use client';

import { useState, useEffect } from 'react';
import { Plus, User, LogOut, CheckCircle, X } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import StatusBadge from '@/components/ui/StatusBadge';

interface FanvueAccount {
  accountId: string;
  accountName: string;
  accountHandle: string;
  avatarUrl?: string;
  isConnected: boolean;
  lastActive?: string;
  color: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<FanvueAccount[]>([]);
  const [loading, setLoading] = useState(true);

  // Load accounts from localStorage on component mount
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const response = await fetch('/api/accounts');
        if (response.ok) {
          const accountsData = await response.json();
          setAccounts(accountsData);
        }
      } catch (error) {
        console.error('Error loading accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, []);

  const handleAddAccount = () => {
    // Redirect to OAuth login for new account with multiaccount flag
    window.location.href = '/api/oauth/login?multiaccount=true';
  };

  const handleRemoveAccount = async (accountId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      try {
        const response = await fetch(`/api/accounts/${accountId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setAccounts(accounts.filter(account => account.accountId !== accountId));
        } else {
          alert('Erreur lors de la suppression du compte');
        }
      } catch (error) {
        console.error('Error removing account:', error);
        alert('Erreur lors de la suppression du compte');
      }
    }
  };

  const handleSwitchAccount = async (accountId: string) => {
    try {
      const response = await fetch('/api/accounts/switch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId }),
      });
      
      if (response.ok) {
        // Update UI to show active account
        const updatedAccounts = accounts.map(account => ({
          ...account,
          isConnected: account.accountId === accountId,
          lastActive: account.accountId === accountId ? new Date().toISOString() : account.lastActive,
        }));
        setAccounts(updatedAccounts);
        
        // Reload the page to reflect the change
        window.location.reload();
      } else {
        alert('Erreur lors du changement de compte');
      }
    } catch (error) {
      console.error('Error switching account:', error);
      alert('Erreur lors du changement de compte');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 flex items-center justify-center">
        <div className="text-white text-xl">Chargement des comptes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Gestion des Comptes</h1>
        <p className="text-gray-400">
          Connectez et gérez plusieurs comptes Fanvue depuis une seule interface
        </p>
      </div>

      {/* Add Account Button */}
      <div className="mb-8">
        <NeonButton
          onClick={handleAddAccount}
          variant="primary"
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter un nouveau compte
        </NeonButton>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <GlassCard 
            key={account.accountId} 
            className={`p-6 border-2 ${account.isConnected ? 'border-green-500/50' : 'border-gray-700/30'} hover:scale-105 transition-transform`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {account.avatarUrl ? (
                  <img
                    src={account.avatarUrl}
                    alt={account.accountName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${account.color} flex items-center justify-center`}>
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-white">{account.accountName}</h3>
                  <p className="text-gray-400 text-sm">@{account.accountHandle}</p>
                </div>
              </div>
              {account.isConnected && (
                <StatusBadge status="success" label="Actif" />
              )}
            </div>

            {account.lastActive && (
              <div className="text-xs text-gray-500 mb-4">
                Dernière activité: {new Date(account.lastActive).toLocaleDateString('fr-FR')}
              </div>
            )}

            <div className="flex gap-2">
              {!account.isConnected ? (
                <NeonButton
                  onClick={() => handleSwitchAccount(account.accountId)}
                  variant="primary"
                  size="sm"
                  className="flex-1 flex items-center justify-center gap-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  Activer
                </NeonButton>
              ) : (
                <div className="flex-1 text-center py-2 text-green-400 text-sm font-medium">
                  Compte actif
                </div>
              )}
              
              <NeonButton
                onClick={() => handleRemoveAccount(account.accountId)}
                variant="secondary"
                size="sm"
              >
                <X className="w-4 h-4" />
              </NeonButton>
            </div>
          </GlassCard>
        ))}

        {/* Empty state */}
        {accounts.length === 0 && (
          <div className="col-span-full">
            <GlassCard className="p-12 text-center">
              <User className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Aucun compte ajouté
              </h3>
              <p className="text-gray-400 mb-6">
                Commencez par ajouter votre premier compte Fanvue
              </p>
              <NeonButton
                onClick={handleAddAccount}
                variant="primary"
                className="flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Ajouter un compte
              </NeonButton>
            </GlassCard>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-12">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Comment ça marche ?</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Cliquez sur "Ajouter un nouveau compte" pour connecter un compte Fanvue supplémentaire</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Chaque compte aura une couleur différente pour facilement les distinguer</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Activez le compte avec lequel vous souhaitez travailler</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Votre bot gérera automatiquement le chat pour tous les comptes connectés</span>
            </li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}