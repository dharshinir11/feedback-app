 // import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { api, questions } from '../api/feedbackApi';
// import { StarRating } from '../components/StarRating';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
 

// export const DashboardPage = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [sessions, setSessions] = useState([]);
//   const [feedback, setFeedback] = useState({});
//   const [dayOptions, setDayOptions] = useState([]);
//   const [submittedSessions, setSubmittedSessions] = useState({});
//   const [missingCount, setMissingCount] = useState(() => {
//     const saved = localStorage.getItem("missingFeedbackCount") || "{}";
//     return JSON.parse(saved);
//   });

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (!storedUser) {
//       toast.error("No user data found. Redirecting...");
//       navigate('/');
//       return;
//     }
//     const parsedUser = JSON.parse(storedUser);
//     setUser(parsedUser);

//     // Load submitted sessions for the current user
//     const saved = localStorage.getItem(`submittedFeedback_${parsedUser.reg}`) || "{}";
//     setSubmittedSessions(JSON.parse(saved));
//   }, [navigate]);

//   useEffect(() => {
//     if (user?.dept) {
//       const options = api.getAvailableDays(user.dept);
//       setDayOptions(options);
//     }
//   }, [user?.dept]);

//   useEffect(() => {
//     if (user?.dept && user?.day) {
//       const userSessions = api.getSessionData(user.dept, user.day);
//       setSessions(userSessions);
//     }
//   }, [user?.dept, user?.day]);

//   // Update and store missing feedback count whenever sessions or submissions change
//   useEffect(() => {
//     if (user?.dept && user?.day && sessions.length > 0) {
//       const count = sessions.filter(
//         session => !submittedSessions[`${user.dept}-${user.day}-${session.topic}`]
//       ).length;

//       setMissingCount(prev => {
//         const updated = { ...prev, [`${user.day}`]: count };
//         localStorage.setItem("missingFeedbackCount", JSON.stringify(updated));
//         return updated;
//       });
//     }
//   }, [sessions, submittedSessions, user]);

//   const handleDayChange = (e) => {
//     const newDay = e.target.value;
//     setUser(currentUser => {
//       const updatedUser = { ...currentUser, day: newDay };
//       localStorage.setItem("user", JSON.stringify(updatedUser));
//       return updatedUser;
//     });
//   };

//   const handleLogout = () => {
//     api.studentLogout();
//     navigate('/');
//   };

//   const handleFeedbackChange = (sessionIndex, questionIndex, value) => {
//     setFeedback(prev => ({ ...prev, [`${sessionIndex}-${questionIndex}`]: value }));
//   };

//   const submitFeedback = async (sessionIndex, session) => {
//     const sessionKey = `${user.dept}-${user.day}-${session.topic}`;

//     if (submittedSessions[sessionKey]) {
//       toast.info("You have already submitted feedback for this session.");
//       return;
//     }

//     const topic = session.topic.toLowerCase();
//     let customQuestions = [];

//     if (topic.includes("universal human values")) {
//       customQuestions = Object.values(questions).slice(0, 7);
//     } else if (topic.includes("feedback session")) {
//       customQuestions = [
//         "To what extent did the induction program help you feel confident, informed, and prepared to begin your academic journey at our institution?",
//         "How would you rate the overall coordination and organization of the SIP program?",
//         "Were the basic amenities (seating, refreshments, transport, etc.) adequate throughout the program?",
//         "Was the sound system, session timing, and venue management handled effectively?",
//         "Please share your overall perspective on the SIP experience in a few sentences and which three sessions or activities did you find most impactful or engaging"
//       ];
//     } else if (topic.includes("diagnostic test") || topic.includes("test")) {
//       customQuestions = [
//         "Was the test content aligned with your academic level?",
//         "Were the instructions for the test clear and easy to follow?",
//         "Was the allotted time sufficient to complete the test?",
//         "Did the test help you understand your strengths and areas to improve?",
//         "Suggestions/Questions/Feedback"
//       ];
//     } else {
//       customQuestions = Object.values(questions).slice(0, 7);
//     }

//     const ratingTexts = ["Average", "Good", "Very Good", "Excellent"];
//     const answers = [];

//     for (let qIndex = 0; qIndex < customQuestions.length; qIndex++) {
//       const isUHV = session.topic.toLowerCase().includes("universal human values");
//       const isFacultyDropdown = isUHV && qIndex === 0;
//       const isSuggestion = qIndex === customQuestions.length - 1;
//       const ratingVal = feedback[`${sessionIndex}-${qIndex}`];

//       if (isFacultyDropdown) {
//         answers.push(ratingVal || 'Not Selected');
//       } else if (isSuggestion) {
//         answers.push(ratingVal || '');
//       }
//       else {
//         const label = ratingTexts[(ratingVal || 0) - 1] || 'Not Rated';
//         answers.push(label);
//       }
//     }

//     const feedbackData = {
//       name: user.name,
//       dept: user.dept,
//       day: user.day,
//       session,
//       answers,
//       missingCount: missingCount[user.day] ?? 0 // send exact missing count
//     };


//     const result = await api.submitFeedback(feedbackData);

//     if (result.status === "success") {
//       toast.success("Feedback submitted successfully!");
//       const updated = { ...submittedSessions, [sessionKey]: true };
//       setSubmittedSessions(updated);
//       localStorage.setItem(`submittedFeedback_${user.reg}`, JSON.stringify(updated));

//       // 🔹 Recalculate missing count immediately
//       const remaining = sessions.filter(
//         s => !updated[`${user.dept}-${user.day}-${s.topic}`]
//       ).length;
//       const updatedMissing = { ...missingCount, [user.day]: remaining };
//       setMissingCount(updatedMissing);
//       localStorage.setItem("missingFeedbackCount", JSON.stringify(updatedMissing));
//     } else {
//       toast.error("Failed to submit feedback. Please try again.");
//     }
//   };

//   if (!user) return null;

//   return (
//     <div className="min-h-screen items-center p-4 sm:p-8">
//       <ToastContainer />
//       <div className="flex justify-center mb-6">
//         <img
//           src="images/college_logo.png"
//           alt="College Logo"
//           className="w-24 h-auto rounded-lg shadow-lg"
//         />
//       </div>
//       <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">
//          Smart India Hackathon - 2025
//       </h1>

//       {/* 🔹 Missing Feedback Display */}
//       {missingCount[user.day] > 0 && (
//         <div className="max-w-4xl mx-auto bg-yellow-100 text-yellow-800 px-4 py-3 mb-6 rounded-lg text-center font-semibold">
//           {missingCount[user.day]} feedback
//           {missingCount[user.day] > 1 ? 's' : ''} pending for {user.day}
//         </div>
//       )}

//       <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-6 sm:p-8">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//           <h2 className="text-2xl font-semibold text-gray-700">
//             Welcome {user.name} ({user.dept})
//           </h2>
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <label htmlFor="day-select" className="font-semibold">Viewing Day:</label>
//               <select
//                 value={user.day}
//                 onChange={handleDayChange}
//                 className="p-2 border rounded"
//               >
//                 {dayOptions.map((opt, i) => (
//                   <option key={i} value={opt.value}>
//                     {opt.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg cursor-pointer hover:bg-red-600 transition-colors"
//             >
//               Logout
//             </button>
//           </div>
//         </div>

//         {/* Sessions */}
//         <div>
//           {sessions.length > 0 ? sessions.map((session, index) => {
//             const topic = session.topic.toLowerCase();
//             const sessionKey = `${user.dept}-${user.day}-${session.topic}`;
//             const isSubmitted = submittedSessions[sessionKey];

//             let customQuestions = [];
//             if (topic.includes("keeladi")) {
//               customQuestions = [
//                 "How would you rate your overall learning experience during the Keeladi visit?",
//                 "Did the trip enhance your understanding of ancient Tamil civilization and heritage?",
//                 "Was the explanation at the site informative and engaging?",
//                 "Were the travel and logistical arrangements adequate and comfortable?",
//                 "Suggestions/Questions/Feedback"
//               ];
//             } else if (topic.includes("feedback session")) {
//               customQuestions = [
//                 "To what extent did the induction program help you feel confident, informed, and prepared to begin your academic journey at our institution?",
//                 "How would you rate the overall coordination and organization of the SIP program?",
//                 "Were the basic amenities (seating, refreshments, transport, etc.) adequate throughout the program?",
//                 "Was the sound system, session timing, and venue management handled effectively?",
//                 "Please share your overall perspective on the SIP experience in a few sentences and which three sessions or activities did you find most impactful or engaging"
//               ];
//             } else if (topic.includes("diagnostic test") || topic.includes("test")) {
//               customQuestions = [
//                 "Was the test content aligned with your academic level?",
//                 "Were the instructions for the test clear and easy to follow?",
//                 "Was the allotted time sufficient to complete the test?",
//                 "Did the test help you understand your strengths and areas to improve?",
//                 "Suggestions/Questions/Feedback"
//               ];
//             } else {
//               customQuestions = Object.values(questions).slice(0, 7);
//             }

//             return (
//               <div key={`${user.day}-${index}`} className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
//                 <h3 className="text-xl font-bold text-gray-800 mb-4">
//                   {session.topic} ({session.time})
//                   {session.topic.toLowerCase().includes("universal human values") && user.slot && (
//                     <span className="block text-sm text-gray-600 mt-1">
//                       Faculty Incharge: {uhvFacultyBySlot[user.slot?.toUpperCase().trim()] || "Not Assigned"}
//                     </span>
//                   )}
//                 </h3>


// {customQuestions.map((question, qIndex) => {
//   const isSuggestion = qIndex === customQuestions.length - 1;
//   const isUHV = session.topic.toLowerCase().includes("universal human values");
//   const isFacultyDropdown = isUHV && qIndex === 0;
//   const key = `${index}-${qIndex}`;

//   return (
//     <div key={key} className="mb-4">
//       <label className="block font-semibold text-gray-700 mb-2">
//         {qIndex + 1}. {question}
//       </label>

//       {isFacultyDropdown ? (
//         <select
//           className="w-full p-2 border rounded-md"
//           value={feedback[key] || ''}
//           onChange={e => handleFeedbackChange(index, qIndex, e.target.value)}
//           disabled={isSubmitted}
//         >
//           <option value="">Select Faculty</option>
//           {/* Check if the faculty array for the selected slot exists */}
//           {uhvFacultyBySlot[user.slot?.toUpperCase().trim()] && 
//             uhvFacultyBySlot[user.slot?.toUpperCase().trim()].map((facultyName, idx) => (
//               <option key={idx} value={facultyName}>
//                 {facultyName}
//               </option>
//             ))
//           }
//         </select>
//       ) : isSuggestion ? (
//         <textarea
//           className="w-full p-3 border rounded-md"
//           onChange={e => handleFeedbackChange(index, qIndex, e.target.value)}
//           disabled={isSubmitted}
//         />
//       ) : (
//         <StarRating
//           rating={feedback[key] || 0}
//           setRating={rating => handleFeedbackChange(index, qIndex, rating)}
//           disabled={isSubmitted}
//         />
//       )}
//     </div>
//   );
// })}


               
//                 <button
//                   id={`submit-btn-${index}`}
//                   onClick={() => submitFeedback(index, session)}
//                   className="w-full cursor-pointer sm:w-auto bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//                   disabled={isSubmitted}
//                 >
//                   {isSubmitted ? "Submitted" : "Submit Feedback"}
//                 </button>
//               </div>
//             );
//           }) : (
//             <p className="text-center text-gray-600 font-medium">
//               No sessions scheduled for your department on {user.day}.
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, questions } from "../api/feedBackApi";

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [responses, setResponses] = useState({});
  const [statusMsg, setStatusMsg] = useState("");

  const sessions = api.getSessionData(user.dept, user.day);

  const handleChange = (qid, value) => {
    setResponses((prev) => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const feedback = {
      name: user.name,
      dept: user.dept,
      day: user.day,
      responses,
    };
    const res = await api.submitFeedback(feedback);
    setStatusMsg(res.status === "error" ? "Submission failed!" : "Thank you!");
  };

  const handleLogout = () => {
    api.studentLogout();
    navigate("/");
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Feedback Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {sessions.length === 0 && (
        <p className="text-gray-600 mb-6">
          No sessions found for {user.dept} on {user.day}.
        </p>
      )}

      {sessions.map((session, i) => (
        <div
          key={i}
          className="mb-8 p-4 border rounded-xl shadow-sm bg-white"
        >
          <h2 className="text-xl font-semibold mb-2">{session.topic}</h2>
          <p className="text-sm text-gray-600 mb-4">
            Time: {session.time} | Venue: {session.venue}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.entries(questions).map(([qid, text]) => (
              <div key={qid} className="flex flex-col">
                <label className="mb-1 font-medium">{text}</label>
                <select
                  value={responses[qid] || ""}
                  onChange={(e) => handleChange(qid, e.target.value)}
                  className="border p-2 rounded"
                  required
                >
                  <option value="">Select rating</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      ))}

      {statusMsg && <p className="mt-4 text-green-700 font-medium">{statusMsg}</p>}
    </div>
  );
}
