// src/api/feedbackApi.js
import sessionData from '../data/sessionData'; // Adjust path if needed

const API_URL = 'https://server.tceapps.in';

export const questions = {
  Q1: "Opinion about overall session",
  Q2: "Clarity in the speech",
  Q3: "Speaker's interaction with the students",
  Q4: "Did the session deliver the information you expected to receive",
  Q5: "Was the subject matter presented effectively",
  Q6: "Is the speaker knowledgeable",
  Q7: "Suggestions/Questions/Feedback"
};

/**
 * Helper to get sorted dates for a department from sessionData.
 * The dates in sessionData are keys in DD.MM.YYYY format.
 * @param {string} dept - The department name.
 * @returns {Array<string>} A sorted array of date strings.
 */
const getSortedDatesForDept = (dept) => {
  if (!sessionData[dept]) return [];

  const dates = Object.keys(sessionData[dept]);
  dates.sort((a, b) => {
    const [dayA, monthA, yearA] = a.split('.').map(Number);
    const [dayB, monthB, yearB] = b.split('.').map(Number);
    return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
  });
  return dates;
};

export const api = {
  /**
   * Fetches all feedback from the MongoDB server.
   * @returns {Promise<Array>} A promise that resolves to an array of feedback objects.
   */
  getFeedback: async () => {
    try {
      const response = await fetch(`${API_URL}/api/feedback`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
      return [];
    }
  },

  /**
   * Submits a new feedback entry to the MongoDB server.
   * @param {object} feedback - The feedback object to submit.
   * @returns {Promise<object>} A promise that resolves to the server's response.
   */
  submitFeedback: async (feedback) => {
    try {
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      return { status: 'error', message: error.toString() };
    }
  },

  // Admin and user login/logout logic
  login: (password) => {
    if (password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem('isAdmin');
  },

  studentLogout: () => {
    localStorage.removeItem('user');
  },

  isAdmin: () => {
    return localStorage.getItem('isAdmin') === 'true';
  },

  /**
   * Gets session data for a specific department and day.
   * It maps the "Day X" format to the actual date in sessionData.
   * @param {string} dept - The department name.
   * @param {string} day - The day in "Day X" format (e.g., "Day 1").
   * @returns {Array} An array of session objects for that day.
   */
  getSessionData: (dept, day) => {
    const dayIndex = parseInt(day?.split(' ')[1], 10) - 1;
    if (isNaN(dayIndex) || dayIndex < 0) return [];

    const sortedDates = getSortedDatesForDept(dept);
    if (dayIndex >= sortedDates.length) return [];

    const targetDate = sortedDates[dayIndex];
    return sessionData[dept]?.[targetDate] || [];
  },

  /**
   * Gets the available days for a department to populate a dropdown.
   * @param {string} dept - The department name.
   * @returns {Array<object>} An array of objects with value and label for dropdown options.
   */
  getAvailableDays: (dept) => {
    const sortedDates = getSortedDatesForDept(dept);
    return sortedDates.map((date, index) => ({
      value: `Day ${index + 1}`,
      label: `Day ${index + 1} (${date})`
    }));
  }
};
