import React from "react";
import {
  Calendar,
  Clock,
  Star,
  Heart,
  Gift,
  CheckCircle,
  X,
} from "lucide-react";

const AgendaView = ({ events, getEventIcon, getEventColor, removeEvent }) => {
  // Group events by date
  const groupedEvents = Object.keys(events).reduce((acc, dateKey) => {
    const date = new Date(dateKey);
    const dateStr = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(...events[dateKey].map((event) => ({ ...event, date })));
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-display font-bold text-white mb-2">
          Agenda View
        </h2>
        <p className="text-dark-300">
          All your events organized chronologically
        </p>
      </div>

      {Object.keys(groupedEvents).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(groupedEvents)
            .sort(([a], [b]) => new Date(a) - new Date(b))
            .map(([dateStr, dayEvents]) => (
              <div
                key={dateStr}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="text-accent-400" size={18} />
                  <h3 className="text-lg font-display font-bold text-white">
                    {dateStr}
                  </h3>
                </div>

                <div className="space-y-3">
                  {dayEvents
                    .sort((a, b) => {
                      if (a.time && b.time) {
                        return a.time.localeCompare(b.time);
                      }
                      return a.time ? -1 : 1;
                    })
                    .map((event) => {
                      const IconComponent = getEventIcon(event.type);
                      return (
                        <div
                          key={event.id}
                          className={`bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-lg p-3 border border-white/10 ${
                            event.isLeave
                              ? "border-yellow-400/50 bg-yellow-500/10"
                              : ""
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <IconComponent
                                className={`${getEventColor(
                                  event.type
                                )} flex-shrink-0 mt-1`}
                                size={16}
                              />
                              <div className="flex-1 min-w-0">
                                <h4
                                  className={`text-sm font-medium ${
                                    event.isLeave
                                      ? "text-yellow-300"
                                      : "text-white"
                                  }`}
                                >
                                  {event.title}
                                </h4>
                                <p className="text-dark-400 text-xs capitalize">
                                  {event.displayType || event.type}
                                </p>
                                {event.time && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Clock
                                      size={12}
                                      className="text-dark-400"
                                    />
                                    <span className="text-dark-300 text-xs">
                                      {event.time}
                                    </span>
                                  </div>
                                )}
                                {event.description && (
                                  <p className="text-dark-400 text-xs mt-1 line-clamp-2">
                                    {event.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            {!event.isRecurringInstance && (
                              <button
                                onClick={() =>
                                  removeEvent(
                                    event.date.toDateString(),
                                    event.id
                                  )
                                }
                                className="text-red-400 hover:text-red-300 transition-colors p-1 ml-2 flex-shrink-0"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="mx-auto text-dark-500 mb-4" size={48} />
          <h3 className="text-lg font-display font-bold text-white mb-2">
            No Events Scheduled
          </h3>
          <p className="text-dark-400">
            Start adding events to see them in your agenda
          </p>
        </div>
      )}
    </div>
  );
};

export default AgendaView;
