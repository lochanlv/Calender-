import React, { useState } from "react";
import { Calendar, X, Plus, ChevronDown, Lightbulb, Info } from "lucide-react";

const EventModal = ({
  showEventModal,
  setShowEventModal,
  selectedDate,
  newEvent,
  setNewEvent,
  showTypeDropdown,
  setShowTypeDropdown,
  eventTypes,
  handleTypeSelect,
  addEvent,
  getLeaveSuggestionsForDate,
  getSuggestionIcon,
  getSuggestionColor,
  acceptLeaveSuggestion,
}) => {
  const [showInstagramInfo, setShowInstagramInfo] = useState(false);
  const selectedEventType = eventTypes.find((t) => t.value === newEvent.type);

  return (
    <>
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl p-4 sm:p-5 w-full max-w-sm shadow-2xl border border-white/20 animate-bounce-subtle">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-display font-bold text-white flex items-center">
                <Calendar
                  className="mr-2 text-primary-400"
                  size={18}
                  className="sm:w-5 sm:h-5"
                />
                Add Event
              </h3>
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setNewEvent({
                    title: "",
                    time: "",
                    startTime: "",
                    endTime: "",
                    description: "",
                    type: "other",
                    customType: "",
                    isRecurring: false,
                    instagramUrl: "",
                  });
                }}
                className="text-dark-400 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4 text-center">
              <p className="text-dark-300 text-sm font-body">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Leave Suggestions in Modal */}
            {getLeaveSuggestionsForDate(selectedDate).length > 0 && (
              <div className="mb-4 bg-green-500/10 border border-green-400/30 rounded-lg p-3">
                <div className="text-green-400 text-sm font-semibold mb-2 flex items-center">
                  <Lightbulb size={14} className="mr-1" />
                  Leave Optimization Available
                </div>
                <div className="space-y-2">
                  {getLeaveSuggestionsForDate(selectedDate).map(
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
                                  onClick={() => {
                                    acceptLeaveSuggestion(
                                      selectedDate,
                                      suggestion
                                    );
                                    setShowEventModal(false);
                                  }}
                                  className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded transition-colors"
                                >
                                  Accept & Close
                                </button>
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

            <div className="space-y-3">
              {/* Event Type Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 text-white focus:border-primary-500 focus:outline-none transition-colors text-sm font-body flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {selectedEventType && (
                      <selectedEventType.icon
                        className={selectedEventType.color}
                        size={16}
                      />
                    )}
                    <span>
                      {newEvent.type === "other" && newEvent.customType
                        ? newEvent.customType
                        : selectedEventType?.label || "Select Type"}
                    </span>
                  </div>
                  <ChevronDown
                    className={`transition-transform ${
                      showTypeDropdown ? "rotate-180" : ""
                    }`}
                    size={16}
                  />
                </button>

                {showTypeDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-dark-800 border border-white/20 rounded-lg shadow-xl z-10">
                    {eventTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => handleTypeSelect(type.value)}
                        className="w-full p-2.5 text-left hover:bg-white/10 transition-colors text-sm font-body flex items-center gap-2 text-white first:rounded-t-lg last:rounded-b-lg"
                      >
                        <type.icon className={type.color} size={16} />
                        {type.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Type Input */}
              {newEvent.type === "other" && (
                <input
                  type="text"
                  placeholder="Enter custom event type"
                  value={newEvent.customType}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, customType: e.target.value })
                  }
                  className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-dark-400 focus:border-primary-500 focus:outline-none transition-colors text-sm font-body"
                />
              )}

              {/* Event Title */}
              <input
                type="text"
                placeholder="Event title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-dark-400 focus:border-primary-500 focus:outline-none transition-colors text-sm font-body"
              />

              {/* Event Time - Only for non-birthday/anniversary events */}
              {newEvent.type !== "birthday" &&
                newEvent.type !== "anniversary" && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-xs text-white/70 mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={newEvent.startTime || ""}
                          onChange={(e) =>
                            setNewEvent({
                              ...newEvent,
                              startTime: e.target.value,
                            })
                          }
                          className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 text-white focus:border-primary-500 focus:outline-none transition-colors text-sm font-body"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-white/70 mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={newEvent.endTime || ""}
                          onChange={(e) =>
                            setNewEvent({
                              ...newEvent,
                              endTime: e.target.value,
                            })
                          }
                          className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 text-white focus:border-primary-500 focus:outline-none transition-colors text-sm font-body"
                        />
                      </div>
                    </div>
                  </div>
                )}

              {/* Event Description */}
              <textarea
                placeholder="Description (optional)"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-dark-400 focus:border-primary-500 focus:outline-none transition-colors resize-none h-16 text-sm font-body"
              />

              {/* Instagram URL for Birthday/Anniversary */}
              {(newEvent.type === "birthday" ||
                newEvent.type === "anniversary") && (
                <div className="relative">
                  <input
                    type="url"
                    placeholder="Instagram URL (optional)"
                    value={newEvent.instagramUrl}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, instagramUrl: e.target.value })
                    }
                    className="w-full p-2.5 pr-8 rounded-lg bg-white/10 border border-white/20 text-white placeholder-dark-400 focus:border-primary-500 focus:outline-none transition-colors text-sm font-body"
                  />
                  <button
                    type="button"
                    onClick={() => setShowInstagramInfo(!showInstagramInfo)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                    title="Instagram URL Info"
                  >
                    <Info size={16} />
                  </button>

                  {/* Info Popup */}
                  {showInstagramInfo && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-dark-800 border border-white/20 rounded-lg shadow-xl z-10 p-3">
                      <p className="text-white text-xs">
                        If you provide the URL, you would be able to message the
                        user from here only on his/her birthday
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Recurring Indicator */}
              {(newEvent.type === "birthday" ||
                newEvent.type === "anniversary") && (
                <div className="flex items-center gap-2 p-2 bg-accent-500/20 rounded-lg border border-accent-500/30">
                  <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></div>
                  <span className="text-accent-300 text-xs font-body">
                    This will repeat every year
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setNewEvent({
                    title: "",
                    time: "",
                    startTime: "",
                    endTime: "",
                    description: "",
                    type: "other",
                    customType: "",
                    isRecurring: false,
                    instagramUrl: "",
                  });
                }}
                className="flex-1 py-2 px-3 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors text-sm font-body"
              >
                Cancel
              </button>
              <button
                onClick={addEvent}
                className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center text-sm font-body"
              >
                <Plus className="mr-1" size={16} />
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventModal;
