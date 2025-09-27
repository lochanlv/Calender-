# EmailJS Setup Instructions

This guide will help you set up EmailJS for sending email reminders in your Smart Calendar application.

## Prerequisites

- An EmailJS account (free tier available)
- An email service provider (Gmail, Outlook, etc.)

## Step 1: Create an EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click "Sign Up" and create your account
3. Verify your email address

## Step 2: Add an Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, Yahoo, etc.)
4. Follow the instructions to connect your email account
5. Note down your Service ID

## Step 3: Create Email Templates

### Template 1: Birthday Reminder

1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template ID: `birthday_reminder`
4. Create the template with these variables:
   - `{{to_name}}` - Recipient name
   - `{{event_title}}` - Event title
   - `{{event_date}}` - Event date
   - `{{message}}` - Reminder message

**Template Content:**

```
Subject: 🎉 Birthday Reminder - {{event_title}}

Hi {{to_name}},

{{message}}

Event: {{event_title}}
Date: {{event_date}}

Don't forget to celebrate! 🎂

Best regards,
Smart Calendar
```

### Template 2: Anniversary Reminder

1. Create another template with ID: `anniversary_reminder`
2. Use the same variables as birthday reminder

**Template Content:**

```
Subject: 💕 Anniversary Reminder - {{event_title}}

Hi {{to_name}},

{{message}}

Event: {{event_title}}
Date: {{event_date}}

Wishing you a wonderful anniversary! 💕

Best regards,
Smart Calendar
```

### Template 3: Event Reminder

1. Create template with ID: `event_reminder`
2. Use these variables:
   - `{{to_name}}` - Recipient name
   - `{{event_title}}` - Event title
   - `{{event_date}}` - Event date
   - `{{event_time}}` - Event time
   - `{{event_type}}` - Event type
   - `{{message}}` - Reminder message

**Template Content:**

```
Subject: ⏰ Event Reminder - {{event_title}}

Hi {{to_name}},

{{message}}

Event: {{event_title}}
Date: {{event_date}}
Time: {{event_time}}
Type: {{event_type}}

See you there!

Best regards,
Smart Calendar
```

### Template 4: Leave Reminder

1. Create template with ID: `leave_reminder`
2. Use the same variables as event reminder

**Template Content:**

```
Subject: 🏖️ Leave Reminder - {{event_title}}

Hi {{to_name}},

{{message}}

Event: {{event_title}}
Date: {{event_date}}

Enjoy your time off! 🏖️

Best regards,
Smart Calendar
```

## Step 4: Get Your EmailJS Configuration

1. In your EmailJS dashboard, go to "Account"
2. Find your Public Key (User ID)
3. Note down your Service ID from Step 2

## Step 5: Update Your Configuration

1. Open `src/config/emailjs.js` in your project
2. Replace the placeholder values with your actual EmailJS configuration:

```javascript
const EMAILJS_CONFIG = {
  serviceId: "your-actual-service-id",
  templateId: "your-template-id",
  publicKey: "your-actual-public-key",
  userId: "your-actual-user-id",
};
```

## Step 6: Test Your Setup

1. Start your development server:

```bash
npm run dev
```

2. Create a test event in your calendar
3. Check your email to see if the reminder was sent

## Email Sending Schedule

The system will send emails at these times:

### Birthdays and Anniversaries

- **Time**: 11:55 PM the day before the event
- **Template**: Birthday/Anniversary reminder template

### Other Events

- **Time**: 1 minute before the event start time
- **Template**: Event reminder template

### Leave Events

- **Time**: 11:55 PM the day before the leave
- **Template**: Leave reminder template

## Configuration Options

### Customizing Email Templates

You can customize the email templates in your EmailJS dashboard:

1. Go to "Email Templates"
2. Click on the template you want to edit
3. Modify the subject and content
4. Save your changes

### Adding More Variables

To add more variables to your templates:

1. In your template, use `{{variable_name}}` syntax
2. In your JavaScript code, include the variable in the `templateParams` object:

```javascript
const templateParams = {
  to_email: userEmail,
  to_name: "User Name",
  custom_variable: "Custom Value",
  // ... other variables
};
```

## Troubleshooting

### Common Issues:

1. **Emails not sending**: Check your EmailJS configuration
2. **Template not found**: Verify template IDs match exactly
3. **Service not connected**: Reconnect your email service
4. **Rate limiting**: EmailJS has rate limits on free tier

### Debug Mode:

To enable debug logging, add this to your `emailjs.js`:

```javascript
// Enable debug mode
emailjs.init(EMAILJS_CONFIG.publicKey, {
  debug: true,
});
```

## Rate Limits

EmailJS free tier includes:

- 200 emails per month
- 1 email per second

For higher limits, consider upgrading to a paid plan.

## Security Considerations

1. **API Keys**: Never expose your EmailJS public key in client-side code
2. **Template Security**: Use server-side validation for email content
3. **Rate Limiting**: Implement client-side rate limiting to avoid abuse

## Advanced Features

### Custom Email Templates

You can create custom templates for different event types:

```javascript
// Add to your emailjs.js
export const sendCustomReminder = async (userEmail, eventData, templateId) => {
  const templateParams = {
    to_email: userEmail,
    to_name: "User",
    event_title: eventData.title,
    event_date: eventData.date,
    custom_message: eventData.customMessage,
  };

  return await sendEmail(templateId, templateParams);
};
```

### Batch Email Sending

For sending multiple emails:

```javascript
export const sendBatchReminders = async (reminders) => {
  const promises = reminders.map((reminder) =>
    sendEmail(reminder.templateId, reminder.params)
  );

  return await Promise.all(promises);
};
```

## Support

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS Dashboard](https://dashboard.emailjs.com/)
- [EmailJS Support](https://www.emailjs.com/support/)
