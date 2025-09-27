import React from "react";
import { Clock, X, Instagram, Calendar, Lightbulb, Target } from "lucide-react";

const TodayEvents = ({
  getEventsForDate,
  getEventIcon,
  getEventColor,
  removeEvent,
  showLeaveOptimization,
  setShowLeaveOptimization,
  leaveSuggestions,
  getLeaveSuggestionsForDate,
  getSuggestionIcon,
  getSuggestionColor,
  acceptLeaveSuggestion,
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-3 sm:p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base sm:text-lg font-display font-bold text-white flex items-center">
          <Clock
            className="mr-2 text-accent-400"
            size={16}
            className="sm:w-4 sm:h-4"
          />
          <span className="hidden xs:inline">Today's Events</span>
          <span className="xs:hidden">Today</span>
        </h3>
        <button
          onClick={() => setShowLeaveOptimization(!showLeaveOptimization)}
          className="p-1 sm:p-1.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          title="Leave Optimization"
        >
          <Lightbulb size={14} className="sm:w-4 sm:h-4" />
        </button>
      </div>

      {getEventsForDate(new Date()).length > 0 ? (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {getEventsForDate(new Date()).map((event) => {
            const IconComponent = getEventIcon(event.type);
            return (
              <div
                key={event.id}
                className={`bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-lg p-3 border border-white/10 ${
                  event.isLeave ? "border-yellow-400/50 bg-yellow-500/10" : ""
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
                        className={`text-sm truncate ${
                          event.isLeave
                            ? "text-yellow-300 font-semibold"
                            : "text-white font-medium"
                        }`}
                      >
                        {event.title}
                      </h4>
                      <p className="text-dark-400 text-xs capitalize">
                        {event.displayType}
                      </p>
                      {event.time && (
                        <p className="text-dark-300 text-xs">{event.time}</p>
                      )}
                      {event.description && (
                        <p className="text-dark-400 text-xs mt-1 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                      {(event.type === "birthday" ||
                        event.type === "anniversary") && (
                        <div className="flex gap-2 mt-2">
                          {event.instagramUrl ? (
                            <a
                              href={event.instagramUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-400 hover:text-pink-300 cursor-pointer"
                            >
                              <Instagram size={18} />
                            </a>
                          ) : (
                            <Instagram
                              className="text-pink-400 hover:text-pink-300 cursor-pointer"
                              size={18}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {!event.isRecurringInstance && (
                    <button
                      onClick={() =>
                        removeEvent(new Date().toDateString(), event.id)
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
      ) : (
        <div className="text-center py-8">
          <Calendar className="mx-auto text-dark-500 mb-2" size={32} />
          <p className="text-dark-400 text-sm">No events today</p>
        </div>
      )}

      {/* Leave Optimization Panel */}
      {showLeaveOptimization && (
        <div className="mt-4 border-t border-white/20 pt-4">
          <h4 className="text-md font-display font-bold text-green-400 mb-3 flex items-center">
            <Lightbulb className="mr-2" size={16} />
            Leave Optimization
          </h4>

          {Object.keys(leaveSuggestions).length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {Object.keys(leaveSuggestions)
                .slice(0, 5)
                .map((dateKey) => {
                  const date = new Date(dateKey);
                  const suggestions = leaveSuggestions[dateKey];

                  return (
                    <div
                      key={dateKey}
                      className="bg-green-500/10 border border-green-400/30 rounded-lg p-3"
                    >
                      <div className="text-green-300 text-sm font-medium mb-2">
                        {date.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>

                      {suggestions.map((suggestion, idx) => {
                        const IconComponent = getSuggestionIcon(
                          suggestion.type
                        );
                        return (
                          <div key={idx} className="mb-2 last:mb-0">
                            <div className="flex items-center gap-2 text-xs">
                              <IconComponent
                                className={`${getSuggestionColor(
                                  suggestion.type
                                )} flex-shrink-0`}
                                size={12}
                              />
                              <div className="flex-1">
                                <div className="text-green-300 font-medium text-xs">
                                  {suggestion.description}
                                </div>
                                <div className="text-green-400 text-xs">
                                  {suggestion.pattern}
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <div className="text-green-500 text-xs font-bold">
                                    {suggestion.efficiency}x efficiency
                                  </div>
                                  <button
                                    onClick={() =>
                                      acceptLeaveSuggestion(date, suggestion)
                                    }
                                    className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded transition-colors"
                                  >
                                    Accept
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-4">
              <Target className="mx-auto text-green-500 mb-2" size={24} />
              <p className="text-green-400 text-sm">
                No optimization opportunities found
              </p>
              <p className="text-green-500 text-xs mt-1">
                Check back when holidays are loaded
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TodayEvents;
