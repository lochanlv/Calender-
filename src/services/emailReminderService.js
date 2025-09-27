import {
  sendBirthdayReminder,
  sendAnniversaryReminder,
  sendEventReminder,
  sendLeaveReminder,
} from "../config/emailjs";

// Email reminder service
export class EmailReminderService {
  constructor() {
    this.reminderQueue = new Map();
    this.isRunning = false;
  }

  // Add event to reminder queue
  addEventReminder(event, userEmail) {
    const eventId = event.id;
    const reminderTime = this.calculateReminderTime(event);

    if (reminderTime) {
      this.reminderQueue.set(eventId, {
        event,
        userEmail,
        reminderTime,
        sent: false,
      });

      console.log(
        `Added reminder for event: ${event.title} at ${reminderTime}`
      );
    }
  }

  // Calculate when to send the reminder
  calculateReminderTime(event) {
    const now = new Date();
    const eventDate = new Date(event.date);

    // For birthdays and anniversaries: send at 11:55 PM the day before
    if (event.type === "birthday" || event.type === "anniversary") {
      const reminderDate = new Date(eventDate);
      reminderDate.setDate(reminderDate.getDate() - 1);
      reminderDate.setHours(23, 55, 0, 0);

      // Only schedule if the reminder time is in the future
      if (reminderDate > now) {
        return reminderDate;
      }
    }

    // For other events: send 1 minute before the event
    else if (event.startTime || event.time) {
      const eventDateTime = new Date(eventDate);
      const [hours, minutes] = (event.startTime || event.time).split(":");
      eventDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const reminderTime = new Date(eventDateTime);
      reminderTime.setMinutes(reminderTime.getMinutes() - 1);

      // Only schedule if the reminder time is in the future
      if (reminderTime > now) {
        return reminderTime;
      }
    }

    return null;
  }

  // Start the reminder service
  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.checkReminders();

    // Check for reminders every minute
    this.intervalId = setInterval(() => {
      this.checkReminders();
    }, 60000); // 1 minute

    console.log("Email reminder service started");
  }

  // Stop the reminder service
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log("Email reminder service stopped");
  }

  // Check and send pending reminders
  async checkReminders() {
    const now = new Date();

    for (const [eventId, reminder] of this.reminderQueue) {
      if (!reminder.sent && now >= reminder.reminderTime) {
        try {
          await this.sendReminder(reminder);
          reminder.sent = true;
          console.log(`Reminder sent for event: ${reminder.event.title}`);
        } catch (error) {
          console.error(
            `Failed to send reminder for event: ${reminder.event.title}`,
            error
          );
        }
      }
    }

    // Clean up sent reminders
    this.cleanupSentReminders();
  }

  // Send the appropriate reminder based on event type
  async sendReminder(reminder) {
    const { event, userEmail } = reminder;

    switch (event.type) {
      case "birthday":
        await sendBirthdayReminder(userEmail, event);
        break;
      case "anniversary":
        await sendAnniversaryReminder(userEmail, event);
        break;
      case "leave":
        await sendLeaveReminder(userEmail, event);
        break;
      default:
        await sendEventReminder(userEmail, event);
        break;
    }
  }

  // Clean up sent reminders
  cleanupSentReminders() {
    for (const [eventId, reminder] of this.reminderQueue) {
      if (reminder.sent) {
        this.reminderQueue.delete(eventId);
      }
    }
  }

  // Remove event from reminder queue
  removeEventReminder(eventId) {
    this.reminderQueue.delete(eventId);
    console.log(`Removed reminder for event: ${eventId}`);
  }

  // Update event in reminder queue
  updateEventReminder(event, userEmail) {
    this.removeEventReminder(event.id);
    this.addEventReminder(event, userEmail);
  }

  // Get all pending reminders
  getPendingReminders() {
    return Array.from(this.reminderQueue.values()).filter(
      (reminder) => !reminder.sent
    );
  }

  // Clear all reminders
  clearAllReminders() {
    this.reminderQueue.clear();
    console.log("All reminders cleared");
  }
}

// Create a singleton instance
export const emailReminderService = new EmailReminderService();

// Auto-start the service when imported
emailReminderService.start();
