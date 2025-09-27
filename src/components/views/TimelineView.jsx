import React from "react";
import {
  Clock,
  Star,
  Heart,
  Gift,
  CheckCircle,
  Calendar,
  X,
} from "lucide-react";

const TimelineView = ({ events, getEventIcon, getEventColor, removeEvent }) => {
  // Flatten all events with dates
  const allEvents = Object.keys(events)
    .flatMap((dateKey) =>
      events[dateKey].map((event) => ({
        ...event,
        date: new Date(dateKey),
      }))
    )
    .sort((a, b) => a.date - b.date);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-display font-bold text-white mb-2">
          Timeline View
        </h2>
        <p className="text-dark-300">
          Your events displayed on a chronological timeline
        </p>
      </div>

      {allEvents.length > 0 ? (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-secondary-500"></div>

          <div className="space-y-6">
            {allEvents.map((event, index) => {
              const IconComponent = getEventIcon(event.type);
              const isLast = index === allEvents.length - 1;

              return (
                <div key={event.id} className="relative flex items-start gap-4">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        event.isLeave
                          ? "bg-yellow-400 border-yellow-400"
                          : "bg-primary-500 border-primary-500"
                      }`}
                    ></div>
                    {!isLast && (
                      <div className="absolute top-4 left-1/2 w-0.5 h-6 bg-gradient-to-b from-primary-500 to-secondary-500 transform -translate-x-1/2"></div>
                    )}
                  </div>

                  {/* Event content */}
                  <div
                    className={`flex-1 bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 ${
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
                              event.isLeave ? "text-yellow-300" : "text-white"
                            }`}
                          >
                            {event.title}
                          </h4>
                          <p className="text-dark-400 text-xs capitalize">
                            {event.displayType || event.type}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-dark-300 text-xs">
                              {event.date.toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            {event.time && (
                              <>
                                <span className="text-dark-400">•</span>
                                <div className="flex items-center gap-1">
                                  <Clock size={12} className="text-dark-400" />
                                  <span className="text-dark-300 text-xs">
                                    {event.time}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                          {event.description && (
                            <p className="text-dark-400 text-xs mt-2 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {!event.isRecurringInstance && (
                        <button
                          onClick={() =>
                            removeEvent(event.date.toDateString(), event.id)
                          }
                          className="text-red-400 hover:text-red-300 transition-colors p-1 ml-2 flex-shrink-0"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="mx-auto text-dark-500 mb-4" size={48} />
          <h3 className="text-lg font-display font-bold text-white mb-2">
            No Events Scheduled
          </h3>
          <p className="text-dark-400">
            Start adding events to see them in your timeline
          </p>
        </div>
      )}
    </div>
  );
};

export default TimelineView;
