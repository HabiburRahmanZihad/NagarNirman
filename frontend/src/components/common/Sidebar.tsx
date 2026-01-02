'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { LayoutDashboard, User, MapPin, Search, FileText, Edit, Lightbulb, BarChart3, Trophy, Settings, Users, FileCheck, LogOut, X, CreditCard } from 'lucide-react';


// Sidebar link structure
interface SidebarLink {
  href: string;
  icon: string;
  label: string;
  badge?: number;
}


// Sidebar component props
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
      { href: `/dashboard/${role}`, icon: 'dashboard', label: 'Dashboard' },
      { href: `/dashboard/${role}/profile`, icon: 'profile', label: 'My Profile' },
      { href: `/dashboard/${role}/map-search`, icon: 'map', label: 'Map Search' },
      { href: `/dashboard/${role}/all-reports`, icon: 'search', label: 'Browse Reports' },
    ];

    if (role === 'user') {
      return [
        ...commonLinks,
        { href: '/dashboard/user/reports/new', icon: 'file', label: 'Report Issue' },
        { href: '/dashboard/user/my-reports', icon: 'filetext', label: 'My Reports' },
        { href: '/dashboard/user/join-as-a-Problem-Solver', icon: 'lightbulb', label: 'Become Solver' },
      ];
    }

    if (role === 'authority') {
      return [
        ...commonLinks,
        { href: '/dashboard/authority/assign-task', icon: 'settings', label: 'Assign Task' },
        { href: '/dashboard/authority/review-tasks', icon: 'filecheck', label: 'Review Tasks' },
        { href: '/dashboard/authority/solvers', icon: 'lightbulb', label: 'Problem Solvers' },
        { href: '/dashboard/authority/applications', icon: 'filetext', label: 'Applications' },
        { href: '/dashboard/authority/manage-users', icon: 'users', label: 'Manage Users' },
      ];
    }

    if (role === 'problemSolver') {
      return [
        ...commonLinks,
        { href: '/dashboard/problemSolver/tasks', icon: 'filetext', label: 'My Tasks' },
        { href: '/dashboard/problemSolver/leaderboard', icon: 'trophy', label: 'Leaderboard & Rewards' },
        { href: '/dashboard/problemSolver/statistics', icon: 'barchart', label: 'Statistics' },
      ];
    }

    if (role === 'superAdmin') {
      return [
        { href: '/dashboard/superAdmin', icon: 'settings', label: 'SuperAdmin Panel' },
        { href: '/dashboard/superAdmin/users', icon: 'users', label: 'All Users' },
        { href: '/dashboard/superAdmin/applications', icon: 'filetext', label: 'Applications' },
        { href: '/dashboard/superAdmin/assign-task', icon: 'edit', label: 'Assign Task' },
        { href: '/dashboard/superAdmin/review-tasks', icon: 'filecheck', label: 'Review Tasks' },
        { href: '/dashboard/superAdmin/solver-statistics', icon: 'barchart', label: 'Solver Statistics' },
        { href: '/dashboard/superAdmin/all-reports', icon: 'filetext', label: 'All Reports' },
        { href: '/dashboard/superAdmin/donations', icon: 'creditcard', label: 'Donations' },
        { href: '/dashboard/superAdmin/map-search', icon: 'map', label: 'Map Search' },
      ];
    }

    return commonLinks;
  };

  const links = getUserLinks();


  // Function to check if a link is active
  const isActive = (href: string) => {
    if (href === `/dashboard/${user?.role}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };


  // Function to get icon component based on icon name
  const getIconComponent = (iconName: string) => {
    const iconProps = { className: 'w-5 h-5' };
    const icons: { [key: string]: React.ReactNode } = {
      dashboard: <LayoutDashboard {...iconProps} />,
      profile: <User {...iconProps} />,
      map: <MapPin {...iconProps} />,
      search: <Search {...iconProps} />,
      file: <FileText {...iconProps} />,
      filetext: <FileText {...iconProps} />,
      lightbulb: <Lightbulb {...iconProps} />,
      settings: <Settings {...iconProps} />,
      filecheck: <FileCheck {...iconProps} />,
      users: <Users {...iconProps} />,
      trophy: <Trophy {...iconProps} />,
      barchart: <BarChart3 {...iconProps} />,
      edit: <Edit {...iconProps} />,
      creditcard: <CreditCard {...iconProps} />,
    };
    return icons[iconName] || <LayoutDashboard {...iconProps} />;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 min-w-64 bg-base-100 border-r-2 border-base-200 z-50 overflow-y-auto transition-all duration-300 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:sticky lg:top-0 lg:shrink-0 shadow-2xl`}
      >
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 border-b-2 border-base-200 bg-base-100">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="px-8 py-4 bg-base-100 rounded-2xl border-2
              border-primary/50 transition-all duration-300 shadow-lg">
                <Link
                  href="/">
                  <Image
                    src="/logo/logo.png"
                    alt="NagarNirman Logo"
                    width={150}
                    height={150}
                    priority
                  />
                </Link>
              </div>

              <button
                onClick={onClose}
                className="lg:hidden text-white hover:text-white/70 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* User Info - Moved to Footer */}
            {/* Removed from header to place near logout button */}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-5 space-y-1 overflow-y-auto">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => onClose()}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl
                    font-semibold transition-all duration-300 group whitespace-nowrap ${active
                      ? 'bg-primary text-white shadow-lg scale-105 origin-left'
                      : 'text-info hover:bg-base-200/60 hover:text-primary'
                    }`}
                >
                  <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {getIconComponent(link.icon)}
                  </div>
                  <span className="flex-1">{link.label}</span>
                  {link.badge && (
                    <span className="ml-auto bg-error text-white text-xs px-2 py-1 rounded-lg font-bold animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t-2 border-base-200 bg-linear-to-br from-primary via-primary to-primary/90  space-y-3">
            {/* User Info Section */}
            {user && (
              <div className="p-4 bg-white/10 rounded-2xl border-2 border-accent/30 hover:border-accent/60 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  {user.profilePicture ? (
                    <Image
                      width={48}
                      height={48}
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover border-3 border-accent shadow-lg shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-linear-to-br from-primary to-secondary text-accent rounded-full flex items-center justify-center font-bold text-lg shadow-lg shrink-0">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-accent truncate">{user.name}</p>
                    <p className="text-xs text-accent/70 capitalize font-semibold">{user.role.replace(/([A-Z])/g, ' $1').trim()}</p>
                  </div>
                </div>
                {user.email && (
                  <p className="text-xs text-accent/80 truncate px-1 font-medium">{user.email}</p>
                )}
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-white font-bold bg-linear-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent hover:shadow-lg transition-all duration-300 border-2 border-accent/50 hover:border-accent group"
            >
              <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
