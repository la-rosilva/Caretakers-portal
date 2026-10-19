import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const NewApplications = () => {
  const [applicants, setApplicants] = useState([]);

  // Fetch new applications on component mount
  useEffect(() => {
    fetch("/auth/new_applications") // Replace with "" if not using proxy
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => setApplicants(data))
      .catch(() => toast.error("Failed to fetch new applications."));
  }, []);

  // Handle accept/reject actions
  const handleAction = async (id, status) => {
    try {
      const res = await fetch(`/auth/update-status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });
      

      if (!res.ok) throw new Error("Failed to update status");

      setApplicants(prev => prev.filter(app => app.c_id !== id));
      toast.success(`Application ${status === "approved" ? "accepted" : "rejected"}!`);
    } catch {
      toast.error("Action failed.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">New Applications</h2>

      {applicants.length === 0 ? (
        <p className="text-gray-500">No new applications.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applicants.map(app => (
            <div
              key={app.c_id}
              className="bg-white shadow-lg rounded-md p-5 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Profile Image */}
              <div className="flex justify-center mb-4">
              <img
              src={`/${app.profile_image.replace(/\\/g, '/')}`}
              alt={`${app.first_name} ${app.last_name}`}
              className="w-32 h-32 object-cover rounded-full"/>

              </div>

              {/* Applicant Info */}
              <h3 className="text-lg font-semibold text-center text-cyan-700">{app.first_name} {app.last_name}</h3>
              <p className="text-center text-sm text-gray-600">{app.gender}, {app.age} years old</p>

              {/* Contact Info */}
              <div className="mt-4 space-y-2">
                <p className='text-sm'>Email: {app.email_address}</p>
                <p className='text-sm'>Phone: {app.phone_number}</p>
                <p className='text-sm'>Permanent Address: {app.permanent_address}</p>
              </div>

              {/* Professional Info */}
              <div className="mt-4 space-y-2">
                <p className='text-sm'>Primary Specialization: {app.pr_sp}</p>
                <p className='text-sm'>Previous Experience: {app.prev_exp}</p>
                <p className='text-sm'>Expected Salary: {app.expected_salary}</p>
                <p className='text-sm'>Employment Type: {app.emp_type}</p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-between">
                <button
                  className="bg-emerald-400 text-white px-15 py-2 rounded-sm hover:bg-emerald-500 duration-300 transition-all"
                  onClick={() => handleAction(app.c_id, "approved")}
                >
                  Accept
                </button>
                <button
                  className="bg-red-400 text-white px-15 py-2 rounded-sm hover:bg-red-500 duration-300 transition-all"
                  onClick={() => handleAction(app.c_id, "rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewApplications;
