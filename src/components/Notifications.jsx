import React from "react";
import { AlertCircle, X } from "lucide-react";
import { notification } from "antd";

const Notifications = ({
  showNotifications,
  setShowNotifications,
  notifications,
  getSuggestionIcon,
  getSuggestionColor,
  acceptLeaveSuggestion,
}) => {
  return (
    <>
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl p-6 w-full max-w-2xl shadow-2xl border border-white/20 animate-bounce-subtle">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-display font-bold text-white flex items-center">
                <AlertCircle className="mr-2 text-yellow-400" size={20} />
                Smart Notifications
              </h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-dark-400 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.map((notification) => {
                  const IconComponent = getSuggestionIcon(
                    notification.suggestion.type
                  );
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.hasConflict
                          ? "bg-red-500/10 border-red-400/30"
                          : "bg-green-500/10 border-green-400/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <IconComponent
                          className={`${getSuggestionColor(
                            notification.suggestion.type
                          )} flex-shrink-0 mt-1`}
                          size={16}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`text-sm font-medium ${
                                notification.hasConflict
                                  ? "text-red-300"
                                  : "text-green-300"
                              }`}
                            >
                              {notification.message}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                notification.priority === "high"
                                  ? "bg-red-500 text-white"
                                  : notification.priority === "medium"
                                  ? "bg-yellow-500 text-white"
                                  : "bg-blue-500 text-white"
                              }`}
                            >
                              {notification.priority}
                            </span>
                          </div>
                          <div className="text-xs text-dark-300 mb-2">
                            {notification.date.toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <div className="text-xs text-dark-400 mb-3">
                            {notification.suggestion.pattern}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                acceptLeaveSuggestion(
                                  notification.date,
                                  notification.suggestion
                                );
                                setNotifications((prev) =>
                                  prev.filter((n) => n.id !== notification.id)
                                );
                              }}
                              className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                setNotifications((prev) =>
                                  prev.filter((n) => n.id !== notification.id)
                                )
                              }
                              className="bg-dark-600 hover:bg-dark-700 text-white text-xs px-3 py-1 rounded transition-colors"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto text-dark-500 mb-2" size={32} />
                <p className="text-dark-400 text-sm">No notifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Notifications;
