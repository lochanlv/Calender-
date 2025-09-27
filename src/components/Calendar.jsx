import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Target,
  Zap,
  Instagram,
} from "lucide-react";

const Calendar = ({
  currentDate,
  navigateMonth,
  getDaysInMonth,
  getEventsForDate,
  isToday,
  isSelected,
  isSunday,
  isHoliday,
  hasLeaveSuggestions,
  getLeaveSuggestionsForDate,
  getSuggestionIcon,
  getSuggestionColor,
  acceptLeaveSuggestion,
  handleDateClick,
  setHoveredDate,
  hoveredDate,
  months,
  daysOfWeek,
  getEventIcon,
  getEventColor,
}) => {
  return (
    <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-3 sm:p-4 md:p-6 animate-slide-in">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
        </button>

        <div className="text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-white mb-1">
            {months[currentDate.getMonth()]}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-dark-300 font-body">
            {currentDate.getFullYear()}
          </p>
        </div>

        <button
          onClick={() => navigateMonth(1)}
          className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <ChevronRight size={16} className="sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center py-1 sm:py-2 text-dark-300 font-display font-semibold text-xs sm:text-sm"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {getDaysInMonth(currentDate).map((date, index) => {
          const dayEvents = getEventsForDate(date);
          const isSundayDate = isSunday(date);
          const isHolidayDate = isHoliday(date);
          const hasSuggestions = hasLeaveSuggestions(date);
          const suggestions = getLeaveSuggestionsForDate(date);
          return (
            <div
              key={index}
              onClick={() => handleDateClick(date)}
              onMouseEnter={() => setHoveredDate(date)}
              onMouseLeave={() => setHoveredDate(null)}
              className={`
                relative aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 font-body text-xs sm:text-sm md:text-base
                ${date ? "hover:bg-white/20" : ""}
                ${
                  isToday(date)
                    ? "bg-gradient-to-br from-accent-500 to-accent-600 text-white shadow-lg animate-glow"
                    : ""
                }
                ${
                  isSelected(date) && !isToday(date)
                    ? "bg-gradient-to-br from-secondary-500 to-secondary-600 text-white shadow-lg"
                    : ""
                }
                ${
                  !isToday(date) &&
                  !isSelected(date) &&
                  date &&
                  !isSundayDate &&
                  !isHolidayDate &&
                  !hasSuggestions
                    ? "text-white hover:bg-gradient-to-br hover:from-primary-500/30 hover:to-primary-600/30"
                    : ""
                }
                ${
                  isSundayDate && !isToday(date) && !isSelected(date)
                    ? "text-red-400 hover:bg-gradient-to-br hover:from-primary-500/30 hover:to-primary-600/30"
                    : ""
                }
                ${
                  isHolidayDate &&
                  !isToday(date) &&
                  !isSelected(date) &&
                  !isSundayDate
                    ? "text-red-400 hover:bg-gradient-to-br hover:from-primary-500/30 hover:to-primary-600/30"
                    : ""
                }
                ${
                  hasSuggestions && !isToday(date) && !isSelected(date)
                    ? "text-green-300 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-400/30 hover:from-green-500/30 hover:to-green-600/30 leave-suggestion-glow"
                    : ""
                }
              `}
            >
              {date && (
                <>
                  <span className="font-semibold">{date.getDate()}</span>

                  {/* Leave Suggestions Indicator */}
                  {hasSuggestions && (
                    <div className="absolute top-1 right-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                    </div>
                  )}

                  {/* Events and Suggestions */}
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                      {dayEvents.slice(0, 3).map((event, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full animate-bounce-subtle ${
                            event.isLeave ? "bg-yellow-400" : "bg-accent-400"
                          }`}
                        ></div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      )}
                    </div>
                  )}

                  {/* Efficiency Badge for Suggestions */}
                  {hasSuggestions && suggestions.length > 0 && (
                    <div className="absolute bottom-1 right-1">
                      <div className="bg-green-500 text-white text-xs px-1 py-0.5 rounded-full font-bold efficiency-badge">
                        {suggestions[0].efficiency}x
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Hover Tooltip */}
      {hoveredDate && (
        <div
          className="absolute z-50 bg-dark-800 border border-white/20 rounded-lg p-3 shadow-2xl max-w-xs animate-fade-in"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        >
          <div className="text-white text-sm font-medium mb-2">
            {hoveredDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>

          {/* Leave Suggestions */}
          {getLeaveSuggestionsForDate(hoveredDate).length > 0 && (
            <div className="mb-3">
              <div className="text-green-400 text-xs font-semibold mb-2 flex items-center">
                <Lightbulb size={12} className="mr-1" />
                Leave Optimization
              </div>
              <div className="space-y-2">
                {getLeaveSuggestionsForDate(hoveredDate).map(
                  (suggestion, idx) => {
                    const IconComponent = getSuggestionIcon(suggestion.type);
                    return (
                      <div
                        key={idx}
                        className="bg-green-500/20 border border-green-400/30 rounded-lg p-2"
                      >
                        <div className="flex items-center gap-2 text-xs">
                          <IconComponent
                            className={`${getSuggestionColor(
                              suggestion.type
                            )} flex-shrink-0`}
                            size={12}
                          />
                          <div className="flex-1">
                            <div className="text-green-300 font-medium">
                              {suggestion.description}
                            </div>
                            <div className="text-green-400 text-xs">
                              {suggestion.pattern}
                            </div>
                            <div className="text-green-500 text-xs font-bold">
                              {suggestion.efficiency}x efficiency
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* Events */}
          {getEventsForDate(hoveredDate).length > 0 ? (
            <div className="space-y-1">
              {getEventsForDate(hoveredDate).map((event) => {
                const IconComponent = getEventIcon(event.type);
                return (
                  <div
                    key={event.id}
                    className="flex items-center gap-2 text-xs"
                  >
                    <IconComponent
                      className={`${
                        event.isLeave
                          ? "text-yellow-400"
                          : getEventColor(event.type)
                      } flex-shrink-0`}
                      size={12}
                    />
                    <span
                      className={`truncate ${
                        event.isLeave ? "text-yellow-400" : "text-white"
                      }`}
                    >
                      {event.title}
                    </span>
                    {event.type === "birthday" ||
                    event.type === "anniversary" ? (
                      <div className="flex gap-1 ml-auto">
                        {event.instagramUrl ? (
                          <a
                            href={event.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-400 hover:text-pink-300 cursor-pointer"
                          >
                            <Instagram size={16} />
                          </a>
                        ) : (
                          <Instagram
                            className="text-pink-400 hover:text-pink-300 cursor-pointer"
                            size={16}
                          />
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-dark-400 text-xs">No events</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;
