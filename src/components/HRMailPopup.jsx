import React, { useState } from "react";
import { Mail, X, Send, User, Calendar, Clock } from "lucide-react";

const HRMailPopup = ({
  showMailPopup,
  setShowMailPopup,
  leaveEvent,
  selectedDate,
}) => {
  const [emailContent, setEmailContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async () => {
    setIsSending(true);

    // Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real application, you would integrate with an email service
    console.log("Email sent to HR:", {
      to: "hr@company.com",
      subject: `Leave Request - ${leaveEvent?.title || "Leave Request"}`,
      body: emailContent,
      leaveDetails: {
        date: selectedDate.toLocaleDateString(),
        title: leaveEvent?.title || "Leave Request",
        description: leaveEvent?.description || "Optimized leave request",
        efficiency: leaveEvent?.efficiency || 1,
      },
    });

    setIsSending(false);
    setShowMailPopup(false);
  };

  const defaultEmailContent = `Dear HR Team,

I would like to request leave for ${selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })}.

Leave Details:
- Type: ${leaveEvent?.title || "Leave Request"}
- Description: ${leaveEvent?.description || "Optimized leave request"}
- Efficiency: ${leaveEvent?.efficiency || 1}x (${
    leaveEvent?.daysOff || 1
  } days off with ${leaveEvent?.leaveDays || 1} leave day)

This leave has been optimized using our smart calendar system to maximize time off while minimizing leave days used.

Please let me know if you need any additional information.

Best regards,
[Your Name]`;

  if (!showMailPopup || !leaveEvent) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl p-6 w-full max-w-2xl shadow-2xl border border-white/20 animate-bounce-subtle">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-display font-bold text-white flex items-center">
            <Mail className="mr-2 text-blue-400" size={20} />
            Notify HR
          </h3>
          <button
            onClick={() => setShowMailPopup(false)}
            className="text-dark-400 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <User className="text-blue-400" size={16} />
            <span className="text-blue-300 text-sm font-medium">
              Leave Request Summary
            </span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="text-blue-400" size={14} />
              <span className="text-white">
                Date:{" "}
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-blue-400" size={14} />
              <span className="text-white">
                Type: {leaveEvent?.title || "Leave Request"}
              </span>
            </div>
            <div className="text-blue-300 text-xs">
              Efficiency: {leaveEvent?.efficiency || 1}x (
              {leaveEvent?.daysOff || 1} days off with{" "}
              {leaveEvent?.leaveDays || 1} leave day)
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email Content
            </label>
            <textarea
              value={emailContent || defaultEmailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-dark-400 focus:border-primary-500 focus:outline-none transition-colors resize-none h-48 text-sm"
              placeholder="Enter your email content..."
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowMailPopup(false)}
              className="flex-1 py-2 px-4 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSendEmail}
              disabled={isSending}
              className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2" size={16} />
                  Send Email
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRMailPopup;
