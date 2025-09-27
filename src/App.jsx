import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Plus,
  X,
  ChevronDown,
  Gift,
  Heart,
  Star,
  Mail,
  Instagram,
  Lightbulb,
  Zap,
  Target,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { notification } from "antd";
import "./App.css";

// Import components
import Header from "./components/Header";
import CalendarComponent from "./components/Calendar";
import EventModal from "./components/EventModal";
import TodayEvents from "./components/TodayEvents";
import Notifications from "./components/Notifications";
import ThemeSelector from "./components/ThemeSelector";
import HRMailPopup from "./components/HRMailPopup";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AgendaView from "./components/views/AgendaView";
import TimelineView from "./components/views/TimelineView";
import KanbanView from "./components/views/KanbanView";
import Weather from "./components/Weather";

// Import contexts and utilities
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import {
  detectSchedulingConflicts,
  generateAlternativeTimes,
  suggestOptimalScheduling,
  checkLeaveOptimizationConflicts,
} from "./utils/conflictDetection";
import { emailReminderService } from "./services/emailReminderService";
import { auth, db } from "./config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  addEvent as addEventToFirestore,
  deleteEvent,
  getUserEvents,
  createUser,
  subscribeToUserEvents,
} from "./services/firestoreService";

const AppContent = () => {
  const {
    theme,
    setTheme,
    themes,
    viewMode,
    setViewMode,
    viewModes,
    currentTheme,
  } = useTheme();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [holidays, setHolidays] = useState({});
  const [hoveredDate, setHoveredDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
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
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [leaveSuggestions, setLeaveSuggestions] = useState({});
  const [showLeaveOptimization, setShowLeaveOptimization] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMailPopup, setShowMailPopup] = useState(false);
  const [selectedLeaveEvent, setSelectedLeaveEvent] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const [showWeather, setShowWeather] = useState(false);

  const eventTypes = [
    {
      value: "birthday",
      label: "Birthday",
      icon: Gift,
      color: "text-pink-400",
    },
    {
      value: "anniversary",
      label: "Anniversary",
      icon: Heart,
      color: "text-red-400",
    },
    {
      value: "leave",
      label: "Leave",
      icon: CheckCircle,
      color: "text-green-400",
    },
    { value: "other", label: "Other", icon: Star, color: "text-blue-400" },
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Fetch holidays from Calendarific API
  const fetchHolidays = async (year) => {
    try {
      // Using a demo API key - you should replace this with your own API key from calendarific.com
      const API_KEY = "demo"; // Replace with your actual API key
      const response = await fetch(
        `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=IN&year=${year}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (
        data.meta &&
        data.meta.code === 200 &&
        data.response &&
        data.response.holidays
      ) {
        const holidayMap = {};
        data.response.holidays.forEach((holiday) => {
          const date = new Date(holiday.date.iso);
          const dateKey = date.toDateString();
          if (!holidayMap[dateKey]) {
            holidayMap[dateKey] = [];
          }
          holidayMap[dateKey].push({
            id: `holiday_${holiday.date.iso}`,
            title: holiday.name,
            type: "holiday",
            isHoliday: true,
            time: "",
            description: holiday.description || holiday.name,
          });
        });
        setHolidays(holidayMap);
      } else {
        console.log("Invalid response format from Calendarific API");
        // Use fallback holidays instead of empty object
        setHolidays(getFallbackHolidays(year));
      }
    } catch (error) {
      console.error("Error fetching holidays:", error);
      // Use fallback holidays instead of empty object
      setHolidays(getFallbackHolidays(year));
    }
  };

  // Fallback holidays function
  const getFallbackHolidays = (year) => {
    if (year !== 2025) {
      return {};
    }

    // Fallback to hardcoded Indian holidays for 2025 if API fails
    const fallbackHolidays = {
      "Wed Jan 01 2025": [
        {
          id: "holiday_2025-01-01",
          title: "New Year's Day",
          type: "holiday",
          isHoliday: true,
          time: "",
          description: "New Year's Day",
        },
      ],
      "Sun Jan 26 2025": [
        {
          id: "holiday_2025-01-26",
          title: "Republic Day",
          type: "holiday",
          isHoliday: true,
          time: "",
          description: "Republic Day",
        },
      ],
      "Fri Mar 14 2025": [
        {
          id: "holiday_2025-03-14",
          title: "Holi",
          type: "holiday",
          isHoliday: true,
          time: "",
          description: "Holi",
        },
      ],
      "Mon Mar 31 2025": [
        {
          id: "holiday_2025-03-31",
          title: "Id-ul-Fitr",
          type: "holiday",
          isHoliday: true,
          time: "",
          description: "Id-ul-Fitr",
        },
      ],
      "Thu Apr 10 2025": [
        {
          id: "holiday_2025-04-10",
          title: "Mahavir Jayanti",
          type: "holiday",
          isHoliday: true,
          time: "",
          description: "Mahavir Jayanti",
        },
      ],
      "Fri Apr 18 2025": [
        {
          id: "holiday_2025-04-18",
          title: "Good Friday",
          type: "holiday",
          isHoliday: true,
          time: "",
          description: "Good Friday",
        },
      ],
      "Mon May 12 2025": [
        {
          id: "holiday_2025-05-12",
          title: "Buddha Purnima",
          type: "holiday",
          isHoliday: true,
          time: "",
          description: "Buddha Purnima",
        },
      ],
      "Sat Jun 07 2025": [
        {
          id: "holiday_2025-06-07",
          title: "Id-ul-Zuha",
          type: "holiday",
          isHoliday: true,
          time: "",
          description: "Id-ul-Zuha",
        },
      ],
      "Sun Jul 06 2025": [
        {
          id: "holiday_2025-07-06",
          title: "Muharram",
          type: "holiday",
          isHoliday: true,
          time: "",
          description: "Muharram",
        },
      ],
      "Fri Aug 15 2025": [
        {
          id: "holiday_2025-08-15",
          title: "Independence Day",
          type: "holiday",
          isHoliday: true,
          time: "",
          description: "Independence Day",
        },
      ],
      "Fri Sep 05 2025": [
        {
          id: "holiday_2025-09-05",
          title: "Id-e-Milad",
          type: "holiday",
          isHoliday: true,
          time: "",
          description: "Id-e-Milad",
        },
      ],
      "Thu Oct 02 2025": [
        {
          id: "holiday_2025-10-02",
          title: "Mahatma Gandhi Jayanti",
          type: "holiday",
          isHoliday: true,
          time: "",
          description: "Mahatma Gandhi Jayanti",
        },
      ],
      "Mon Oct 20 2025": [
        {
          id: "holiday_2025-10-20",
          title: "Diwali",
          type: "holiday",
          isHoliday: true,
          time: "",
          description: "Diwali",
        },
      ],
      "Wed Nov 05 2025": [
        {
          id: "holiday_2025-11-05",
          title: "Guru Nanak's Birthday",
          type: "holiday",
          isHoliday: true,
          time: "",
          description: "Guru Nanak's Birthday",
        },
      ],
      "Thu Dec 25 2025": [
        {
          id: "holiday_2025-12-25",
          title: "Christmas Day",
          type: "holiday",
          isHoliday: true,
          time: "",
          description: "Christmas Day",
        },
      ],
    };

    return fallbackHolidays;
  };

  // Firebase Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user); // Debug log
      if (user) {
        // Try to get user name from Firestore
        let userName = user.displayName;
        try {
          const userDoc = await db.collection("users").doc(user.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            userName =
              userData.name || userData.displayName || user.displayName;
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }

        setUser({
          uid: user.uid,
          email: user.email,
          displayName: userName,
          name: userName,
        });
        setIsAuthenticated(true);
        console.log("Loading events for user:", user.uid); // Debug log
        loadUserEvents(user.uid);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setEvents({});
      }
    });

    return () => unsubscribe();
  }, []);

  // Load holidays when component mounts and when year changes
  useEffect(() => {
    fetchHolidays(currentDate.getFullYear());
  }, [currentDate.getFullYear()]);

  // Load holidays immediately when component mounts
  useEffect(() => {
    fetchHolidays(new Date().getFullYear());
  }, []);

  // Ensure events are loaded when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && user.uid) {
      console.log("User authenticated, loading events for:", user.uid);
      loadUserEvents(user.uid);
    }
  }, [isAuthenticated, user]);

  // Leave Optimization Algorithms
  const analyzeLeaveOptimization = (year) => {
    const suggestions = {};
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);

    // Get all holidays for the year
    const yearHolidays = [];
    Object.keys(holidays).forEach((dateKey) => {
      const date = new Date(dateKey);
      if (date.getFullYear() === year) {
        yearHolidays.push(date);
      }
    });

    // Weekend Extension Detection
    const findWeekendExtensions = () => {
      const extensions = [];

      for (let month = 0; month < 12; month++) {
        for (
          let day = 1;
          day <= new Date(year, month + 1, 0).getDate();
          day++
        ) {
          const date = new Date(year, month, day);
          const dayOfWeek = date.getDay();

          // Check for Friday holidays (creates 3-day weekend with Monday leave)
          if (
            dayOfWeek === 5 &&
            yearHolidays.some((h) => h.toDateString() === date.toDateString())
          ) {
            const mondayDate = new Date(date);
            mondayDate.setDate(date.getDate() + 3);
            if (mondayDate.getFullYear() === year) {
              const dayNumber = mondayDate.getDate();
              const suffix =
                dayNumber === 1 || dayNumber === 21 || dayNumber === 31
                  ? "st"
                  : dayNumber === 2 || dayNumber === 22
                  ? "nd"
                  : dayNumber === 3 || dayNumber === 23
                  ? "rd"
                  : "th";
              extensions.push({
                date: mondayDate,
                type: "weekend_extension",
                efficiency: 3,
                description: `Take ${dayNumber}${suffix} off for 3-day weekend`,
                pattern: "Friday Holiday + Monday Leave = 3 days off",
                daysOff: 3,
                leaveDays: 1,
              });
            }
          }

          // Check for Monday holidays (creates 3-day weekend with Friday leave)
          if (
            dayOfWeek === 1 &&
            yearHolidays.some((h) => h.toDateString() === date.toDateString())
          ) {
            const fridayDate = new Date(date);
            fridayDate.setDate(date.getDate() - 3);
            if (fridayDate.getFullYear() === year) {
              const dayNumber = fridayDate.getDate();
              const suffix =
                dayNumber === 1 || dayNumber === 21 || dayNumber === 31
                  ? "st"
                  : dayNumber === 2 || dayNumber === 22
                  ? "nd"
                  : dayNumber === 3 || dayNumber === 23
                  ? "rd"
                  : "th";
              extensions.push({
                date: fridayDate,
                type: "weekend_extension",
                efficiency: 3,
                description: `Take ${dayNumber}${suffix} off for 3-day weekend`,
                pattern: "Monday Holiday + Friday Leave = 3 days off",
                daysOff: 3,
                leaveDays: 1,
              });
            }
          }
        }
      }

      return extensions;
    };

    // Sandwich Bridge Analysis
    const findSandwichBridges = () => {
      const bridges = [];

      for (let month = 0; month < 12; month++) {
        for (
          let day = 1;
          day <= new Date(year, month + 1, 0).getDate();
          day++
        ) {
          const date = new Date(year, month, day);
          const dayOfWeek = date.getDay();

          // Check for Tuesday-Thursday holidays that can be bridged
          if (
            [2, 3, 4].includes(dayOfWeek) &&
            yearHolidays.some((h) => h.toDateString() === date.toDateString())
          ) {
            const prevMonday = new Date(date);
            prevMonday.setDate(date.getDate() - (dayOfWeek - 1));

            const nextFriday = new Date(date);
            nextFriday.setDate(date.getDate() + (5 - dayOfWeek));

            // Check if we can create a 5-day break
            const hasWeekendBefore = prevMonday.getDay() === 1;
            const hasWeekendAfter = nextFriday.getDay() === 5;

            if (hasWeekendBefore && hasWeekendAfter) {
              bridges.push({
                date: prevMonday,
                type: "sandwich_bridge",
                efficiency: 5,
                description: `Take Monday off for 5-day break`,
                pattern:
                  "Weekend + Monday Leave + Holiday + Weekend = 5 days off",
                daysOff: 5,
                leaveDays: 1,
                holidayDate: date,
              });
            }
          }
        }
      }

      return bridges;
    };

    // Festival Cluster Optimization
    const findFestivalClusters = () => {
      const clusters = [];
      const holidayGroups = [];

      // Group holidays within 7 days of each other
      yearHolidays.sort((a, b) => a - b);

      for (let i = 0; i < yearHolidays.length; i++) {
        const group = [yearHolidays[i]];
        let j = i + 1;

        while (
          j < yearHolidays.length &&
          yearHolidays[j] - yearHolidays[i] <= 7 * 24 * 60 * 60 * 1000
        ) {
          group.push(yearHolidays[j]);
          j++;
        }

        if (group.length >= 2) {
          holidayGroups.push(group);
          i = j - 1;
        }
      }

      // Analyze each cluster for optimization opportunities
      holidayGroups.forEach((group) => {
        const firstHoliday = group[0];
        const lastHoliday = group[group.length - 1];
        const span =
          Math.ceil((lastHoliday - firstHoliday) / (24 * 60 * 60 * 1000)) + 1;

        // Find optimal leave days to maximize consecutive time off
        const workingDays = [];
        for (
          let d = new Date(firstHoliday);
          d <= lastHoliday;
          d.setDate(d.getDate() + 1)
        ) {
          const dayOfWeek = d.getDay();
          if (
            dayOfWeek >= 1 &&
            dayOfWeek <= 5 &&
            !yearHolidays.some((h) => h.toDateString() === d.toDateString())
          ) {
            workingDays.push(new Date(d));
          }
        }

        if (workingDays.length > 0) {
          clusters.push({
            date: workingDays[0],
            type: "festival_cluster",
            efficiency: group.length + 1,
            description: `Take strategic leave for ${
              group.length + 1
            }-day festival break`,
            pattern: `Festival cluster optimization: ${
              group.length
            } holidays + 1 leave = ${group.length + 1} days off`,
            daysOff: group.length + 1,
            leaveDays: 1,
            holidays: group,
          });
        }
      });

      return clusters;
    };

    // Run all algorithms
    const weekendExtensions = findWeekendExtensions();
    const sandwichBridges = findSandwichBridges();
    const festivalClusters = findFestivalClusters();

    // Combine all suggestions
    const allSuggestions = [
      ...weekendExtensions,
      ...sandwichBridges,
      ...festivalClusters,
    ];

    // Group suggestions by date
    allSuggestions.forEach((suggestion) => {
      const dateKey = suggestion.date.toDateString();
      if (!suggestions[dateKey]) {
        suggestions[dateKey] = [];
      }
      suggestions[dateKey].push(suggestion);
    });

    return suggestions;
  };

  // Update leave suggestions when holidays change
  useEffect(() => {
    if (Object.keys(holidays).length > 0) {
      const suggestions = analyzeLeaveOptimization(currentDate.getFullYear());
      setLeaveSuggestions(suggestions);

      // Generate smart notifications for upcoming opportunities
      generateSmartNotifications(suggestions);
    }
  }, [holidays, currentDate.getFullYear()]);

  // Smart Notifications System
  const generateSmartNotifications = (suggestions) => {
    const newNotifications = [];
    const today = new Date();
    const thirtyDaysFromNow = new Date(
      today.getTime() + 30 * 24 * 60 * 60 * 1000
    );
    const sixtyDaysFromNow = new Date(
      today.getTime() + 60 * 24 * 60 * 60 * 1000
    );

    Object.keys(suggestions).forEach((dateKey) => {
      const suggestionDate = new Date(dateKey);
      const suggestionsForDate = suggestions[dateKey];

      // Check if suggestion is within 30-60 days
      if (
        suggestionDate >= thirtyDaysFromNow &&
        suggestionDate <= sixtyDaysFromNow
      ) {
        suggestionsForDate.forEach((suggestion) => {
          // Check for conflicts with existing events
          const hasConflict = checkForConflicts(suggestionDate, suggestion);

          newNotifications.push({
            id: `notification_${dateKey}_${suggestion.type}`,
            date: suggestionDate,
            suggestion: suggestion,
            hasConflict: hasConflict,
            priority:
              suggestion.efficiency >= 4
                ? "high"
                : suggestion.efficiency >= 3
                ? "medium"
                : "low",
            message: hasConflict
              ? `⚠️ Leave opportunity with potential conflict: ${suggestion.description}`
              : `💡 Leave opportunity: ${suggestion.description}`,
            createdAt: new Date(),
          });
        });
      }
    });

    // Sort by priority and date
    newNotifications.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return a.date - b.date;
    });

    setNotifications(newNotifications);
  };

  // Conflict Detection
  const checkForConflicts = (date, suggestion) => {
    const dateKey = date.toDateString();
    const existingEvents = events[dateKey] || [];

    // Check for existing leave events
    const hasExistingLeave = existingEvents.some((event) => event.isLeave);

    // Check for important events (birthdays, anniversaries)
    const hasImportantEvents = existingEvents.some(
      (event) => event.type === "birthday" || event.type === "anniversary"
    );

    // Check for recurring events that might conflict
    const hasRecurringEvents = existingEvents.some(
      (event) => event.isRecurring
    );

    return hasExistingLeave || hasImportantEvents || hasRecurringEvents;
  };

  // Auto-dismiss old notifications
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) =>
        prev.filter((notification) => {
          const daysSinceCreated =
            (new Date() - notification.createdAt) / (1000 * 60 * 60 * 24);
          return daysSinceCreated < 7; // Keep notifications for 7 days
        })
      );
    }, 24 * 60 * 60 * 1000); // Check daily

    return () => clearInterval(interval);
  }, []);

  // Function to get all events for a specific date including recurring events and holidays
  const getEventsForDate = (date) => {
    if (!date) return [];

    const dateKey = date.toDateString();
    const directEvents = events[dateKey] || [];
    const holidayEvents = holidays[dateKey] || [];

    // Get recurring events
    const recurringEvents = [];
    const currentMonth = date.getMonth();
    const currentDay = date.getDate();

    // Check all stored events for recurring ones
    Object.keys(events).forEach((eventDateKey) => {
      const eventDate = new Date(eventDateKey);
      const eventEvents = events[eventDateKey];

      eventEvents.forEach((event) => {
        if (
          event.isRecurring &&
          eventDate.getMonth() === currentMonth &&
          eventDate.getDate() === currentDay &&
          eventDate.getFullYear() !== date.getFullYear()
        ) {
          // Calculate how many years it's been
          const yearsElapsed = date.getFullYear() - eventDate.getFullYear();
          if (yearsElapsed > 0) {
            recurringEvents.push({
              ...event,
              id: `recurring_${event.id}_${date.getFullYear()}`,
              title:
                event.type === "birthday"
                  ? `${event.title} (${yearsElapsed} years old)`
                  : event.type === "anniversary"
                  ? `${event.title} (${yearsElapsed} years)`
                  : event.title,
              isRecurringInstance: true,
              originalYear: eventDate.getFullYear(),
            });
          }
        }
      });
    });

    return [...directEvents, ...holidayEvents, ...recurringEvents];
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const hasEvents = (date) => {
    if (!date) return false;
    const allEvents = getEventsForDate(date);
    return allEvents.length > 0;
  };

  const isSunday = (date) => {
    if (!date) return false;
    return date.getDay() === 0;
  };

  const isHoliday = (date) => {
    if (!date) return false;
    const dateKey = date.toDateString();
    return holidays[dateKey] && holidays[dateKey].length > 0;
  };

  const hasLeaveSuggestions = (date) => {
    if (!date) return false;
    const dateKey = date.toDateString();
    return leaveSuggestions[dateKey] && leaveSuggestions[dateKey].length > 0;
  };

  const getLeaveSuggestionsForDate = (date) => {
    if (!date) return [];
    const dateKey = date.toDateString();
    return leaveSuggestions[dateKey] || [];
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case "weekend_extension":
        return Zap;
      case "sandwich_bridge":
        return Target;
      case "festival_cluster":
        return Lightbulb;
      default:
        return Star;
    }
  };

  const getSuggestionColor = (type) => {
    switch (type) {
      case "weekend_extension":
        return "text-green-400";
      case "sandwich_bridge":
        return "text-blue-400";
      case "festival_cluster":
        return "text-purple-400";
      default:
        return "text-yellow-400";
    }
  };

  const acceptLeaveSuggestion = (date, suggestion) => {
    const dateKey = date.toDateString();
    const updatedEvents = { ...events };
    if (!updatedEvents[dateKey]) {
      updatedEvents[dateKey] = [];
    }

    const leaveEvent = {
      id: `leave_${Date.now()}`,
      title: `Leave - ${suggestion.description}`,
      type: "leave",
      time: "",
      description: `Optimized leave: ${suggestion.pattern}`,
      isLeave: true,
      efficiency: suggestion.efficiency,
      daysOff: suggestion.daysOff,
      leaveDays: suggestion.leaveDays,
    };

    updatedEvents[dateKey].push(leaveEvent);
    setEvents(updatedEvents);

    // Set the selected leave event and show mail popup
    setSelectedLeaveEvent(leaveEvent);
    setShowMailPopup(true);

    // Remove the suggestion after accepting
    const updatedSuggestions = { ...leaveSuggestions };
    if (updatedSuggestions[dateKey]) {
      updatedSuggestions[dateKey] = updatedSuggestions[dateKey].filter(
        (s) => s !== suggestion
      );
      if (updatedSuggestions[dateKey].length === 0) {
        delete updatedSuggestions[dateKey];
      }
    }
    setLeaveSuggestions(updatedSuggestions);
  };

  const handleDateClick = (date) => {
    if (date) {
      setSelectedDate(date);
      setShowEventModal(true);
    }
  };

  const handleTypeSelect = (type) => {
    setNewEvent((prev) => ({
      ...prev,
      type: type,
      isRecurring: type === "birthday" || type === "anniversary",
      customType: type === "other" ? prev.customType : "",
    }));
    setShowTypeDropdown(false);
  };

  const addEvent = async () => {
    if (newEvent.title.trim()) {
      const dateKey = selectedDate.toDateString();
      const updatedEvents = { ...events };
      if (!updatedEvents[dateKey]) {
        updatedEvents[dateKey] = [];
      }

      // Check for conflicts before adding
      const detectedConflicts = detectSchedulingConflicts(
        newEvent,
        updatedEvents[dateKey],
        selectedDate
      );
      if (detectedConflicts.length > 0) {
        setConflicts(detectedConflicts);

        // Generate alternative times
        let preferredTime = selectedDate;
        if (newEvent.startTime) {
          const [hours, minutes] = newEvent.startTime.split(":").map(Number);
          preferredTime = new Date(selectedDate);
          preferredTime.setHours(hours, minutes, 0, 0);
        } else if (newEvent.time) {
          const [hours, minutes] = newEvent.time.split(":").map(Number);
          preferredTime = new Date(selectedDate);
          preferredTime.setHours(hours, minutes, 0, 0);
        }

        const alternativeTimes = generateAlternativeTimes(
          preferredTime,
          updatedEvents[dateKey],
          selectedDate
        );

        // Show conflict notification with Ant Design
        notification.warning({
          message: "Scheduling Conflict Detected",
          description: (
            <div>
              <p>Your event conflicts with existing events:</p>
              <ul className="list-disc list-inside mt-2">
                {detectedConflicts.map((conflict, idx) => (
                  <li key={idx} className="text-sm">
                    {conflict.message}
                  </li>
                ))}
              </ul>
              {alternativeTimes.length > 0 && (
                <div className="mt-3">
                  <p className="font-semibold">Suggested alternative times:</p>
                  <ul className="list-disc list-inside mt-1">
                    {alternativeTimes.slice(0, 3).map((time, idx) => (
                      <li key={idx} className="text-sm text-blue-600">
                        {time.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ),
          duration: 8,
          placement: "topRight",
        });
        return;
      }

      const eventToAdd = {
        ...newEvent,
        id: Date.now(),
        displayType:
          newEvent.type === "other" && newEvent.customType
            ? newEvent.customType
            : newEvent.type,
      };

      updatedEvents[dateKey].push(eventToAdd);
      setEvents(updatedEvents);

      // Save to Firestore if user is authenticated
      if (user && !eventToAdd.isHoliday) {
        try {
          const eventData = {
            title: eventToAdd.title,
            description: eventToAdd.description,
            type: eventToAdd.type,
            startTime: eventToAdd.startTime,
            endTime: eventToAdd.endTime,
            time: eventToAdd.time,
            isRecurring: eventToAdd.isRecurring,
            date: selectedDate,
            createdAt: new Date(),
          };

          await addEventToFirestore(user.uid, eventData);

          // Add email reminder for user-created events
          const eventWithDate = {
            ...eventToAdd,
            date: selectedDate.toISOString(),
          };
          emailReminderService.addEventReminder(eventWithDate, user.email);

          notification.success({
            message: "Event Created",
            description: "Your event has been saved successfully!",
            duration: 3,
          });
        } catch (error) {
          console.error("Error saving event:", error);
          notification.error({
            message: "Save Failed",
            description: "Failed to save event to database.",
            duration: 4,
          });
        }
      }

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
      setShowEventModal(false);
    }
  };

  const removeEvent = async (dateKey, eventId) => {
    const updatedEvents = { ...events };
    const eventToRemove = updatedEvents[dateKey]?.find(
      (event) => event.id === eventId
    );

    updatedEvents[dateKey] = updatedEvents[dateKey].filter(
      (event) => event.id !== eventId
    );
    if (updatedEvents[dateKey].length === 0) {
      delete updatedEvents[dateKey];
    }
    setEvents(updatedEvents);

    // Delete from Firestore if user is authenticated
    if (user && eventToRemove && !eventToRemove.isHoliday) {
      try {
        await deleteEvent(eventId);

        // Remove email reminder for the deleted event
        emailReminderService.removeEventReminder(eventId);

        notification.success({
          message: "Event Deleted",
          description: "Event has been removed successfully!",
          duration: 3,
        });
      } catch (error) {
        console.error("Error deleting event:", error);
        notification.error({
          message: "Delete Failed",
          description: "Failed to delete event from database.",
          duration: 4,
        });
      }
    }
  };

  const getEventIcon = (type) => {
    const eventType = eventTypes.find((t) => t.value === type);
    return eventType ? eventType.icon : Star;
  };

  const getEventColor = (type) => {
    const eventType = eventTypes.find((t) => t.value === type);
    return eventType ? eventType.color : "text-blue-400";
  };

  const selectedEventType = eventTypes.find((t) => t.value === newEvent.type);

  // Firebase Authentication handlers
  const handleLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Try to get user name from Firestore
      let userName = user.displayName;
      try {
        const userDoc = await db.collection("users").doc(user.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          userName = userData.name || userData.displayName || user.displayName;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      setUser({
        uid: user.uid,
        email: user.email,
        displayName: userName,
        name: userName,
      });
      setIsAuthenticated(true);
      setShowLogin(false);

      // Load user events from Firestore
      loadUserEvents(user.uid);
    } catch (error) {
      console.error("Login error:", error);
      notification.error({
        message: "Login Failed",
        description: error.message,
        duration: 4,
      });
    }
  };

  const handleSignup = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create user document in Firestore
      await createUser(user.uid, {
        email: user.email,
        name: name,
        createdAt: new Date(),
      });

      setUser({
        uid: user.uid,
        email: user.email,
        displayName: name,
      });
      setIsAuthenticated(true);
      setShowLogin(false);

      notification.success({
        message: "Account Created",
        description: "Welcome to Smart Calendar!",
        duration: 3,
      });
    } catch (error) {
      console.error("Signup error:", error);
      notification.error({
        message: "Signup Failed",
        description: error.message,
        duration: 4,
      });
    }
  };

  const handleSwitchToSignup = () => {
    setShowLogin(false);
  };

  const handleSwitchToLogin = () => {
    setShowLogin(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setUser(null);
      setShowLogin(true);
      setEvents({});

      // Clear email reminders
      emailReminderService.clearAllReminders();

      notification.success({
        message: "Logged Out",
        description: "You have been successfully logged out.",
        duration: 3,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Load user events from Firestore
  const loadUserEvents = async (userId) => {
    try {
      const userEvents = await getUserEvents(userId);
      const eventsMap = {};

      userEvents.forEach((event) => {
        // Handle both Firestore Timestamp and regular Date objects
        let eventDate;
        if (event.date && typeof event.date.toDate === "function") {
          // Firestore Timestamp
          eventDate = event.date.toDate();
        } else if (event.date instanceof Date) {
          // Already a Date object
          eventDate = event.date;
        } else if (event.date) {
          // String or other format
          eventDate = new Date(event.date);
        } else {
          console.warn("Event missing date:", event);
          return; // Skip events without valid dates
        }

        const dateKey = eventDate.toDateString();

        if (!eventsMap[dateKey]) {
          eventsMap[dateKey] = [];
        }

        eventsMap[dateKey].push({
          ...event,
          id: event.id,
          date: eventDate,
        });
      });

      console.log("Loaded events:", eventsMap); // Debug log
      setEvents(eventsMap);
    } catch (error) {
      console.error("Error loading user events:", error);
    }
  };

  // Show login/signup if not authenticated
  if (!isAuthenticated) {
    return showLogin ? (
      <Login onLogin={handleLogin} onSwitchToSignup={handleSwitchToSignup} />
    ) : (
      <Signup onSignup={handleSignup} onSwitchToLogin={handleSwitchToLogin} />
    );
  }

  return (
    <>
      <div
        className={`min-h-screen bg-gradient-to-br ${currentTheme.primary} p-2 sm:p-4`}
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <Header
            notifications={notifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            user={user}
            onLogout={handleLogout}
          />

          {/* Theme and View Selector */}
          <ThemeSelector
            theme={theme}
            setTheme={setTheme}
            themes={themes}
            viewMode={viewMode}
            setViewMode={setViewMode}
            viewModes={viewModes}
            onWeatherClick={() => setShowWeather(!showWeather)}
          />

          {/* Main Content Area */}
          {viewMode === "month" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4">
              {/* Calendar Container */}
              <CalendarComponent
                currentDate={currentDate}
                navigateMonth={navigateMonth}
                getDaysInMonth={getDaysInMonth}
                getEventsForDate={getEventsForDate}
                isToday={isToday}
                isSelected={isSelected}
                isSunday={isSunday}
                isHoliday={isHoliday}
                hasLeaveSuggestions={hasLeaveSuggestions}
                getLeaveSuggestionsForDate={getLeaveSuggestionsForDate}
                getSuggestionIcon={getSuggestionIcon}
                getSuggestionColor={getSuggestionColor}
                acceptLeaveSuggestion={acceptLeaveSuggestion}
                handleDateClick={handleDateClick}
                setHoveredDate={setHoveredDate}
                hoveredDate={hoveredDate}
                months={months}
                daysOfWeek={daysOfWeek}
                getEventIcon={getEventIcon}
                getEventColor={getEventColor}
              />

              {/* Today's Events Sidebar */}
              <TodayEvents
                getEventsForDate={getEventsForDate}
                getEventIcon={getEventIcon}
                getEventColor={getEventColor}
                removeEvent={removeEvent}
                showLeaveOptimization={showLeaveOptimization}
                setShowLeaveOptimization={setShowLeaveOptimization}
                leaveSuggestions={leaveSuggestions}
                getLeaveSuggestionsForDate={getLeaveSuggestionsForDate}
                getSuggestionIcon={getSuggestionIcon}
                getSuggestionColor={getSuggestionColor}
                acceptLeaveSuggestion={acceptLeaveSuggestion}
              />
            </div>
          )}

          {/* Agenda View */}
          {viewMode === "agenda" && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-3 sm:p-4 md:p-6 animate-fade-in">
              <AgendaView
                events={events}
                getEventIcon={getEventIcon}
                getEventColor={getEventColor}
                removeEvent={removeEvent}
              />
            </div>
          )}

          {/* Timeline View */}
          {viewMode === "timeline" && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-3 sm:p-4 md:p-6 animate-fade-in">
              <TimelineView
                events={events}
                getEventIcon={getEventIcon}
                getEventColor={getEventColor}
                removeEvent={removeEvent}
              />
            </div>
          )}

          {/* Kanban View */}
          {viewMode === "kanban" && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-3 sm:p-4 md:p-6 animate-fade-in">
              <KanbanView
                events={events}
                getEventIcon={getEventIcon}
                getEventColor={getEventColor}
                removeEvent={removeEvent}
              />
            </div>
          )}

          {/* Weather Modal */}
          {showWeather && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
              <div className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl p-4 sm:p-6 w-full max-w-md shadow-2xl border border-white/20 animate-bounce-subtle relative">
                <button
                  onClick={() => setShowWeather(false)}
                  className="absolute top-3 right-3 text-dark-400 hover:text-white transition-colors p-1"
                >
                  <X size={20} />
                </button>
                <Weather />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <Notifications
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        notifications={notifications}
        getSuggestionIcon={getSuggestionIcon}
        getSuggestionColor={getSuggestionColor}
        acceptLeaveSuggestion={acceptLeaveSuggestion}
      />

      <EventModal
        showEventModal={showEventModal}
        setShowEventModal={setShowEventModal}
        selectedDate={selectedDate}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        showTypeDropdown={showTypeDropdown}
        setShowTypeDropdown={setShowTypeDropdown}
        eventTypes={eventTypes}
        handleTypeSelect={handleTypeSelect}
        addEvent={addEvent}
        getLeaveSuggestionsForDate={getLeaveSuggestionsForDate}
        getSuggestionIcon={getSuggestionIcon}
        getSuggestionColor={getSuggestionColor}
        acceptLeaveSuggestion={acceptLeaveSuggestion}
      />

      <HRMailPopup
        showMailPopup={showMailPopup}
        setShowMailPopup={setShowMailPopup}
        leaveEvent={selectedLeaveEvent}
        selectedDate={selectedDate}
      />
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
