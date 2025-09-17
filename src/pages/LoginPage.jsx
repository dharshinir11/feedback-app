import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const slotOptions = {
  "CIVIL": [
    { slot: "CIVIL A", faculty: "Mrs. J. Eunice / Dr. G. AngelinLincy" },
    { slot: "CIVIL B", faculty: "Ms. R. AbinayaRajakumari / Dr. C. S. Senthilkumar" }
  ],
  "CSBS": [
    { slot: "CSBS A", faculty: "Mr.V. Janakiraman / Dr. S. Subash" },
    { slot: "CSBS B", faculty: "Mr. T. Siva / Dr. S. Suriyakala" }
  ],
  "CSE": [
    { slot: "CSE A", faculty: "Dr. C. Senthilkumar / Dr. M. Nirmala Devi" },
    { slot: "CSE B", faculty: "Dr. N. Shivakumar / Dr. B. Subbulakshmi" },
    { slot: "CSE C", faculty: "Dr. M. Sivakumar / Dr. N. Anita" }
  ],
  "AI-ML": [
    { slot: "CSE - AIML", faculty: "Mr. D. Nagendrakumar / Ms. C. Karthika" }
  ],
  "ECE": [
    { slot: "ECE A", faculty: "Dr. P. G. S. Velmurugan / Dr. V. Aravindan" },
    { slot: "ECE B", faculty: "Dr. K. Priya / Dr. M. Tamil Elakkiya" },
    { slot: "ECE C", faculty: "Mr. N. Senthilnathan / Dr. S. Sivailango" }
  ],
  "EEE": [
    { slot: "EEE A", faculty: "Dr. R. Rajan Prakash / Dr. P.M. Devie" },
    { slot: "EEE B", faculty: "Dr. D. Kavitha / Dr. B. Ashok Kumar" }
  ],
  "IT": [
    { slot: "IT A", faculty: "Dr. D. Tamilselvi / Dr. S. Sumathi" },
    { slot: "IT B", faculty: "Dr. K. R. Premlatha / Ms. T. Suba Nachiar" },
    { slot: "IT C", faculty: "Mrs. A. Indirani / Dr. M. Velayudham" },
    { slot: "IT D", faculty: "Dr. K. V. Uma / Dr. RS. Swarnalakshmi" }
  ],
  "MECH": [
    { slot: "MECH A", faculty: "Mr. T. Prakash / Dr. S. Umar Sherif" },
    { slot: "MECH B", faculty: "Dr. S. Arunkumar / Dr. R. Kamalakannan" }
  ],
  "AMCS": [
    { slot: "AMCS A", faculty: "" },
    { slot: "AMCS B", faculty: "" }
  ],
  "MECHATRONICS": [
    { slot: "MECT", faculty: "Mr. M. A. Ganesh / Mr. S. Rajkumar" }
  ]
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reg: '',
    dept: '',
    day: '',
    slot: ''
  });

  const dayOptions = [
    { label: "Day 1 - 11.08.2025", value: "Day 1" },
    { label: "Day 2 - 12.08.2025", value: "Day 2" },
    { label: "Day 3 - 13.08.2025", value: "Day 3" },
    { label: "Day 4 - 14.08.2025", value: "Day 4" },
    { label: "Day 5 - 18.08.2025", value: "Day 5" },
    { label: "Day 6 - 19.08.2025", value: "Day 6" },
    { label: "Day 7 - 20.08.2025", value: "Day 7" },
    { label: "Day 8 - 21.08.2025", value: "Day 8" },
    { label: "Day 9 - 22.08.2025", value: "Day 9" },
    { label: "Day 10- 25.08.2025", value: "Day 10" },
    { label: "Day 11 - 26.08.2025", value: "Day 11" },
    { label: "Day 12- 28.08.2025", value: "Day 12" },
    // { label: "Day 10 - 25.08.2025", value: "Day 10" },
    // { label: "Day 11 - 26.08.2025", value: "Day 11" },
    // { label: "Day 12 - 28.08.2025", value: "Day 12" },
    // { label: "Day 13 - 29.08.2025", value: "Day 13" }
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, reg, dept, day, slot } = formData;

    if (!name || !email || !reg || !dept || !day || !slot) {
      alert("Please fill out all fields.");
      return;
    }

    // Clear any existing feedback for this user
    localStorage.removeItem(`submittedFeedback_${reg}`);

    localStorage.setItem("user", JSON.stringify(formData));
    navigate('/dashboard');
  };

  return (
    <>
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/images/college_bg.jpeg')" }}
      >

        {/* Helpdesk Link */}
        <a
          href="#helpdesk"
          className="absolute top-4 right-4 text-yellow-600 hover:text-yellow-800 font-medium underline z-50"
        >
          Helpdesk & Support
        </a>

        {/* Logo */}
        <img
          src="/images/college_logo.png"
          alt="College Logo"
          className="w-15 h-auto mb-4 rounded-lg shadow-lg"
        />

        {/* Headings */}
        <h1 className="text-2xl font-bold text-center mt-2 mb-2">
          First Year Student Induction Programme 2025
        </h1>
        <h2 className="text-2xl font-bold text-center mt-0 mb-4">
          Feedback Portal
        </h2>

        {/* Form */}
        <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit}>

            <input
              id="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <input
              id="email"
              type="email"
              placeholder="Email ID"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <input
              id="reg"
              type="text"
              placeholder="Roll Number"
              value={formData.reg}
              onChange={handleChange}
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            {/* Department */}
            <select
              id="dept"
              value={formData.dept}
              onChange={handleChange}
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select Department</option>
              {Object.keys(slotOptions).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* Department confirmation */}
            {formData.dept && (
              <div className="mb-4 text-center text-sm text-blue-700">
                You selected: <strong>{formData.dept}</strong>
              </div>
            )}

            {/* Schedule link */}
            {formData.dept && (
              <div className="mb-4 text-center">
                <a
                  href={`/schedules/${formData.dept}.jpg`}
                  download
                  className="inline-block bg-blue-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  View Schedule
                </a>
              </div>
            )}

            {/* Day */}
            <select
              id="day"
              value={formData.day}
              onChange={handleChange}
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select Day</option>
              {dayOptions.map((option, i) => (
                <option key={i} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Slot */}
            {formData.dept && slotOptions[formData.dept] && (
              <select
                id="slot"
                value={formData.slot}
                onChange={handleChange}
                required
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Select Slot</option>
                {slotOptions[formData.dept].map((option, index) => (
                  <option key={index} value={option.slot}>
                    {option.slot}
                  </option>
                ))}
              </select>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white font-bold p-3 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Login
            </button>
          </form>
        </div>

        {/* Marquee */}
        <div className="w-full overflow-hidden mt-6 mb-10 p-3 bg-yellow-100 rounded-lg shadow-lg">
          <div className="animate-marquee whitespace-nowrap text-center text-lg font-semibold text-yellow-800">
            Thiagarajar College of Engineering • Welcome to the First Year Student Induction Programme 2025 • Wishing You a Great Learning Journey!
          </div>
        </div>

        {/* Footer */}
        <div id="helpdesk" className="w-full">
          <Footer />
        </div>
      </div>
    </>
  );
};
