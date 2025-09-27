import React from "react";
import {
  Star,
  Heart,
  Gift,
  CheckCircle,
  Calendar,
  Plus,
  X,
} from "lucide-react";

const KanbanView = ({ events, getEventIcon, getEventColor, removeEvent }) => {
  // Categorize events into columns
  const categorizeEvents = () => {
    const allEvents = Object.keys(events).flatMap((dateKey) =>
      events[dateKey].map((event) => ({
        ...event,
        date: new Date(dateKey),
      }))
    );

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return {
      today: allEvents.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === today.toDateString();
      }),
      upcoming: allEvents.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate > today && eventDate <= nextWeek;
      }),
      later: allEvents.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate > nextWeek;
      }),
      past: allEvents.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate < today;
      }),
    };
  };

  const columns = categorizeEvents();

  const columnConfig = [
    {
      key: "today",
      title: "Today",
      color: "from-red-500/20 to-red-600/20 border-red-400/30",
    },
    {
      key: "upcoming",
      title: "This Week",
      color: "from-yellow-500/20 to-yellow-600/20 border-yellow-400/30",
    },
    {
      key: "later",
      title: "Later",
      color: "from-blue-500/20 to-blue-600/20 border-blue-400/30",
    },
    {
      key: "past",
      title: "Past",
      color: "from-gray-500/20 to-gray-600/20 border-gray-400/30",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-display font-bold text-white mb-2">
          Kanban Board
        </h2>
        <p className="text-dark-300">Organize your events by time periods</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columnConfig.map((column) => (
          <div
            key={column.key}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-display font-bold text-white">
                {column.title}
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded-full ${column.color}`}
              >
                {columns[column.key].length}
              </span>
            </div>

            <div className="space-y-3 min-h-64">
              {columns[column.key].length > 0 ? (
                columns[column.key].map((event) => {
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
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <IconComponent
                            className={`${getEventColor(
                              event.type
                            )} flex-shrink-0 mt-0.5`}
                            size={14}
                          />
                          <div className="flex-1 min-w-0">
                            <h4
                              className={`text-xs font-medium ${
                                event.isLeave ? "text-yellow-300" : "text-white"
                              }`}
                            >
                              {event.title}
                            </h4>
                            <p className="text-dark-400 text-xs capitalize">
                              {event.displayType || event.type}
                            </p>
                            <p className="text-dark-300 text-xs">
                              {event.date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            {event.time && (
                              <p className="text-dark-400 text-xs">
                                {event.time}
                              </p>
                            )}
                          </div>
                        </div>
                        {!event.isRecurringInstance && (
                          <button
                            onClick={() =>
                              removeEvent(event.date.toDateString(), event.id)
                            }
                            className="text-red-400 hover:text-red-300 transition-colors p-1 ml-1 flex-shrink-0"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto text-dark-500 mb-2" size={24} />
                  <p className="text-dark-400 text-xs">No events</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanView;
