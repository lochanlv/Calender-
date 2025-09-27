import React from "react";
import { AlertCircle, LogOut, User } from "lucide-react";

const Header = ({
  notifications,
  showNotifications,
  setShowNotifications,
  user,
  onLogout,
}) => {
  return (
    <div className="text-center mb-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-2 gap-4">
        <div className="flex-1 sm:hidden"></div>
        <div className="flex-1 text-center order-1 sm:order-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-primary-400 via-accent-400 to-secondary-400 bg-clip-text text-transparent">
            Modern Calendar
          </h1>
        </div>
        <div className="flex-1 flex justify-center sm:justify-end items-center gap-2 order-2 sm:order-3">
          {user && (
            <div className="flex items-center gap-2 text-white/80 text-xs sm:text-sm">
              <User size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">
                {user.displayName || user.name || user.email}
              </span>
              <span className="xs:hidden">
                {user.displayName || user.name || user.email}
              </span>
            </div>
          )}
          {notifications.length > 0 && (
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg notification-bell"
              title="Smart Notifications"
            >
              <AlertCircle size={16} className="sm:w-5 sm:h-5" />
              {notifications.length > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold">
                  {notifications.length}
                </div>
              )}
            </button>
          )}
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              title="Logout"
            >
              <LogOut size={16} className="sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>
      <p className="text-dark-300 text-xs sm:text-sm md:text-base font-body">
        Stay organized with style
      </p>
    </div>
  );
};

export default Header;
