// Smart Conflict Detection Utilities

export const detectSchedulingConflicts = (newEvent, existingEvents, date) => {
  const conflicts = [];
  const newEventStart = new Date(date);
  const newEventEnd = new Date(date);

  if (newEvent.time) {
    const [hours, minutes] = newEvent.time.split(":").map(Number);
    newEventStart.setHours(hours, minutes, 0, 0);
    newEventEnd.setHours(hours + 1, minutes, 0, 0); // Assume 1 hour duration
  }

  existingEvents.forEach((event) => {
    if (event.time) {
      const [hours, minutes] = event.time.split(":").map(Number);
      const eventStart = new Date(date);
      const eventEnd = new Date(date);
      eventStart.setHours(hours, minutes, 0, 0);
      eventEnd.setHours(hours + 1, minutes, 0, 0);

      // Check for time overlap
      if (newEventStart < eventEnd && newEventEnd > eventStart) {
        conflicts.push({
          type: "time_conflict",
          severity: "high",
          message: `Time conflict with "${event.title}"`,
          conflictingEvent: event,
          suggestedTimes: generateAlternativeTimes(
            newEventStart,
            existingEvents,
            date
          ),
        });
      }
    }

    // Check for important event conflicts
    if (event.type === "birthday" || event.type === "anniversary") {
      conflicts.push({
        type: "important_event",
        severity: "medium",
        message: `Important event on same day: "${event.title}"`,
        conflictingEvent: event,
        suggestion: "Consider rescheduling or adding as a note",
      });
    }

    // Check for leave conflicts
    if (event.isLeave && newEvent.type === "leave") {
      conflicts.push({
        type: "leave_conflict",
        severity: "high",
        message: `Leave already scheduled for this day`,
        conflictingEvent: event,
        suggestion: "Only one leave per day is allowed",
      });
    }
  });

  return conflicts;
};

export const generateAlternativeTimes = (
  preferredTime,
  existingEvents,
  date
) => {
  const alternatives = [];
  const baseHour = preferredTime.getHours();

  // Generate 3 alternative times
  for (let i = 1; i <= 3; i++) {
    const altTime = new Date(preferredTime);
    altTime.setHours(baseHour + i);

    // Check if this time is free
    const isFree = !existingEvents.some((event) => {
      if (!event.time) return false;
      const [hours] = event.time.split(":").map(Number);
      return Math.abs(hours - altTime.getHours()) < 2;
    });

    if (isFree) {
      alternatives.push({
        time: altTime.toTimeString().slice(0, 5),
        label: `${altTime.toTimeString().slice(0, 5)} (${i} hour${
          i > 1 ? "s" : ""
        } later)`,
      });
    }
  }

  return alternatives;
};

export const suggestOptimalScheduling = (event, date, existingEvents) => {
  const suggestions = [];

  // Check for optimal days in the same week
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay());

  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(weekStart);
    checkDate.setDate(weekStart.getDate() + i);
    const checkDateKey = checkDate.toDateString();
    const dayEvents = existingEvents.filter((e) => e.dateKey === checkDateKey);

    if (dayEvents.length === 0) {
      suggestions.push({
        date: checkDate,
        reason: "Free day",
        priority: "high",
      });
    } else if (dayEvents.length < 2) {
      suggestions.push({
        date: checkDate,
        reason: "Light schedule",
        priority: "medium",
      });
    }
  }

  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

export const checkLeaveOptimizationConflicts = (
  leaveDate,
  events,
  holidays
) => {
  const conflicts = [];
  const dateKey = leaveDate.toDateString();
  const dayEvents = events[dateKey] || [];

  // Check for existing important events
  const importantEvents = dayEvents.filter(
    (event) =>
      event.type === "birthday" ||
      event.type === "anniversary" ||
      event.isRecurring
  );

  if (importantEvents.length > 0) {
    conflicts.push({
      type: "important_event_conflict",
      severity: "high",
      message: `Important events on leave date: ${importantEvents
        .map((e) => e.title)
        .join(", ")}`,
      events: importantEvents,
      suggestion: "Consider alternative dates or mark as important leave",
    });
  }

  // Check for holiday conflicts
  const isHoliday = holidays[dateKey] && holidays[dateKey].length > 0;
  if (isHoliday) {
    conflicts.push({
      type: "holiday_conflict",
      severity: "medium",
      message: "Leave requested on a holiday",
      suggestion: "Holiday leave may require special approval",
    });
  }

  return conflicts;
};
