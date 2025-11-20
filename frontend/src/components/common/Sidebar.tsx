'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

interface SidebarLink {
  href: string;
  icon: string;
  label: string;
  badge?: number;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Role-based navigation links
  const getUserLinks = (): SidebarLink[] => {
    const role = user?.role;

    const commonLinks: SidebarLink[] = [
      { href: `/dashboard/${role}`, icon: '📊', label: 'Dashboard' },
      { href: `/dashboard/${role}/profile`, icon: '👤', label: 'My Profile' },
      { href: `/dashboard/${role}/map-search`, icon: '🗺️', label: 'Map Search' },
      { href: `/dashboard/${role}/all-reports`, icon: '🔍', label: 'Browse Reports' },
    ];

    if (role === 'user') {
      return [
        ...commonLinks,
        { href: '/dashboard/user/reports/new', icon: '📝', label: 'Report Issue' },
        { href: '/dashboard/user/my-reports', icon: '📋', label: 'My Reports' },
        { href: '/dashboard/user/join-as-a-Problem-Solver', icon: '💡', label: 'Become Solver' },
      ];
    }

    if (role === 'authority') {
      return [
        ...commonLinks,
        // { href: '/reports', icon: '📋', label: 'All Reports' },
        { href: '/dashboard/authority/assign-task', icon: '🛠️', label: 'Assign Task' },
        { href: '/dashboard/authority/solvers', icon: '💡', label: 'Solvers & NGOs' },
        { href: '/dashboard/authority/applications', icon: '📄', label: 'Applications' },
        { href: '/dashboard/authority/manage-users', icon: '👥', label: 'Manage Users' },
      ];
    }

    if (role === 'problemSolver' || role === 'ngo') {
      return [
        ...commonLinks,
        { href: '/dashboard/problemSolver/tasks', icon: '📋', label: 'My Tasks' },
        { href: '/dashboard/problemSolver/statistics', icon: '📈', label: 'Statistics' },
      ];
    }

    if (role === 'superAdmin') {
      return [
        { href: '/dashboard/superAdmin', icon: '🛡️', label: 'SuperAdmin Panel' },
        { href: '/dashboard/superAdmin/users', icon: '👥', label: 'All Users' },
        { href: '/dashboard/superAdmin/applications', icon: '📄', label: 'Applications' },
        { href: '/dashboard/superAdmin/all-reports', icon: '📋', label: 'All Reports' },
        { href: '/dashboard/problemSolver/statistics', icon: '📊', label: 'Statistics' },
        { href: '/dashboard/superAdmin/map-search', icon: '🗺️', label: 'Map Search' },
      ];
    }

    return commonLinks;
  };

  const links = getUserLinks();

  const isActive = (href: string) => {
    if (href === `/dashboard/${user?.role}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-50 overflow-y-auto transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:sticky lg:top-0`}
      >
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/logo/logo.png"
              alt="NagarNirman Logo"
              width={150}
              height={150}
              priority
            />
          </Link>
              <button
                onClick={onClose}
                className="lg:hidden text-gray-500 hover:text-gray-700"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* User Info */}
            {user && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-1">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => onClose()}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    active
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                  {link.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            {/* Logout */}
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <span className="text-xl">🚪</span>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
