import emailjs from "@emailjs/browser";

// EmailJS configuration
// Replace these values with your actual EmailJS configuration
const EMAILJS_CONFIG = {
  serviceId: "service_yi5meie",
  templateId: "birthday_reminder",
  publicKey: "mFuMLzvedyivD-5HC",
  userId: "mFuMLzvedyivD-5HC",
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey);

// Email templates
export const EMAIL_TEMPLATES = {
  BIRTHDAY_REMINDER: "birthday_reminder",
  ANNIVERSARY_REMINDER: "anniversary_reminder",
  EVENT_REMINDER: "event_reminder",
  LEAVE_REMINDER: "leave_reminder",
};

// Send email function
export const sendEmail = async (templateId, templateParams) => {
  try {
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      templateId,
      templateParams,
      EMAILJS_CONFIG.publicKey
    );
    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Send birthday reminder
export const sendBirthdayReminder = async (userEmail, eventData) => {
  const templateParams = {
    to_email: userEmail,
    to_name: eventData.title,
    event_title: eventData.title,
    event_date: eventData.date,
    event_type: "Birthday",
    message: `Don't forget! ${eventData.title}'s birthday is tomorrow!`,
  };

  return await sendEmail(EMAIL_TEMPLATES.BIRTHDAY_REMINDER, templateParams);
};

// Send anniversary reminder
export const sendAnniversaryReminder = async (userEmail, eventData) => {
  const templateParams = {
    to_email: userEmail,
    to_name: eventData.title,
    event_title: eventData.title,
    event_date: eventData.date,
    event_type: "Anniversary",
    message: `Don't forget! ${eventData.title} anniversary is tomorrow!`,
  };

  return await sendEmail(EMAIL_TEMPLATES.ANNIVERSARY_REMINDER, templateParams);
};

// Send event reminder
export const sendEventReminder = async (userEmail, eventData) => {
  const templateParams = {
    to_email: userEmail,
    to_name: "User",
    event_title: eventData.title,
    event_date: eventData.date,
    event_time: eventData.startTime || eventData.time,
    event_type: eventData.type,
    message: `Reminder: ${eventData.title} is starting in 1 minute!`,
  };

  return await sendEmail(EMAIL_TEMPLATES.EVENT_REMINDER, templateParams);
};

// Send leave reminder
export const sendLeaveReminder = async (userEmail, eventData) => {
  const templateParams = {
    to_email: userEmail,
    to_name: "User",
    event_title: eventData.title,
    event_date: eventData.date,
    event_type: "Leave",
    message: `Reminder: Your leave for ${eventData.title} starts tomorrow!`,
  };

  return await sendEmail(EMAIL_TEMPLATES.LEAVE_REMINDER, templateParams);
};

export default emailjs;
