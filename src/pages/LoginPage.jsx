// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Footer from '../components/Footer';

// export const LoginPage = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     reg: '',
//     dept: '',
//     day: '' 
//   });

//   const dayOptions = [
//     { label: "Day - 16.09.2025", value: "Day 1" } 
//   ];

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       navigate('/dashboard');
//     }
//   }, [navigate]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const { name, email, reg, dept, day} = formData;

//     if (!name || !email || !reg || !dept || !day) {
//       alert("Please fill out all fields.");
//       return;
//     }

//     // Clear any existing feedback for this user
//     localStorage.removeItem(`submittedFeedback_${reg}`);

//     localStorage.setItem("user", JSON.stringify(formData));
//     navigate('/dashboard');
//   };

//   return (
//     <>
//       <div
//         className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-cover bg-center"
//         style={{ backgroundImage: "url('/images/college_bg.jpeg')" }}
//       >

//         {/* Logo */}
//         <img
//           src="/images/college_logo.png"
//           alt="College Logo"
//           className="w-15 h-auto mb-4 rounded-lg shadow-lg"
//         />

//         {/* Headings */}
//         <h1 className="text-2xl font-bold text-center mt-2 mb-2">
//           Smart India Hackathon - Internal 2025
//         </h1>
         

//         {/* Form */}
//         <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur rounded-lg shadow-xl p-8">
//           <form onSubmit={handleSubmit}>

//             <input
//               id="name"
//               type="text"
//               placeholder="Full Name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
//             />

//             <input
//               id="email"
//               type="email"
//               placeholder="Email ID"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
//             />

//             <input
//               id="reg"
//               type="text"
//               placeholder="Register Number"
//               value={formData.reg}
//               onChange={handleChange}
//               required
//               className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
//             />

//             {/* Department */}
//             <select
//               id="dept"
//               value={formData.dept}
//               onChange={handleChange}
//               required
//               className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
//             >
//               <option value="">Select Department</option>
//               {Object.keys(slotOptions).map((dept) => (
//                 <option key={dept} value={dept}>
//                   {dept}
//                 </option>
//               ))}
//             </select>

//             {/* Department confirmation */}
//             {formData.dept && (
//               <div className="mb-4 text-center text-sm text-blue-700">
//                 You selected: <strong>{formData.dept}</strong>
//               </div>
//             )}

//             {/* Schedule link */}
//             {formData.dept && (
//               <div className="mb-4 text-center">
//                 <a
//                   href={`/schedules/${formData.dept}.jpg`}
//                   download
//                   className="inline-block bg-blue-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//                 >
//                   View Schedule
//                 </a>
//               </div>
//             )}

//             {/* Day */}
//             <select
//               id="day"
//               value={formData.day}
//               onChange={handleChange}
//               required
//               className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
//             >
//               <option value="">Select Day</option>
//               {dayOptions.map((option, i) => (
//                 <option key={i} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>

             

//             {/* Submit */}
//             <button
//               type="submit"
//               className="w-full bg-yellow-500 text-white font-bold p-3 rounded-lg hover:bg-yellow-600 transition-colors"
//             >
//               Login
//             </button>
//           </form>
//         </div>
 
//           {/* Footer */}
//         <div id="helpdesk" className="w-full">
//           <Footer />
//         </div>
         
//       </div>
//     </>
//   );
// };


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/feedBackApi";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [dept, setDept] = useState("");
  const [day, setDay] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !dept || !day) {
      alert("Please fill in all fields.");
      return;
    }

    // store user in localStorage for later use
    localStorage.setItem(
      "user",
      JSON.stringify({ name: name.trim(), dept, day })
    );

    navigate("/dashboard");
  };

  const deptOptions = Object.keys(api.getAvailableDays()); // fallback empty array if no data

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Student Feedback Login</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow w-full max-w-sm space-y-4"
      >
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border w-full p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Department</label>
          <select
            value={dept}
            onChange={(e) => {
              setDept(e.target.value);
              setDay(""); // reset day when dept changes
            }}
            className="border w-full p-2 rounded"
            required
          >
            <option value="">Select Department</option>
            {Object.keys(api.getAvailableDays()).length === 0 ? null : (
              Object.keys(api.getAvailableDays()).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Day</label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="border w-full p-2 rounded"
            required
            disabled={!dept}
          >
            <option value="">Select Day</option>
            {dept &&
              api.getAvailableDays(dept).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
}

