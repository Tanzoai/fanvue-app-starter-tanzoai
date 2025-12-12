import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { getCurrentUser } from '@/lib/fanvue';
import Link from 'next/link';
import { LayoutDashboard, MessageSquare, FileText, Settings, LogOut, User as UserIcon } from 'lucide-react';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Redirect to home if not authenticated
  if (!session) {
    redirect('/');
  }

  // Get real Fanvue user data
  const user = await getCurrentUser();
  
  // If we can't get user data, redirect to home (invalid/expired token)
  if (!user) {
    redirect('/');
  }

  const displayName = user.displayName || user.handle || 'User';
  const avatarUrl = user.avatarUrl;
  const isCreator = user.isCreator || false;

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-3">Fanvue App</h2>
          
          {/* User Info */}
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/30"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {displayName}
              </p>
              {isCreator && (
                <p className="text-xs text-blue-400">Creator Account</p>
              )}
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all group"
          >
            <LayoutDashboard className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/chat"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all group"
          >
            <MessageSquare className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
            <span>Live Chat</span>
          </Link>
          <Link
            href="/scripts"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all group"
          >
            <FileText className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
            <span>Scripts Manager</span>
          </Link>
          <Link
            href="/accounts"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all group"
          >
            <UserIcon className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
            <span>Gestion des Comptes</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all group"
          >
            <Settings className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <form action="/api/oauth/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-4 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg transition-all border border-red-600/20 hover:border-red-600/40"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}