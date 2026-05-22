import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await api.get("/admin/students");
      setStudents(res.data.students);
    };

    fetchStudents();
  }, []);

  // DELETE STUDENTS
  const handleStudentDelete = async (id) => {
    try {
      await api.delete(`/admin/students/${id}`);

      // remove from UI instantly
      setStudents((prev) => prev.filter((s) => s._id !== id));

      alert("Student deleted");
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // UDPATE MODAL

  // update modal form handlechenage function
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openUpdateModal = (student) => {
    setSelectedStudent(student);

    setFormData({
      name: student.name,
      email: student.email,
    });

    setIsModalOpen(true);
  };

  // UPDATE STUDENTS
  const handleStudentUpdate = async () => {
    try {
      const res = await api.put(
        `/admin/students/${selectedStudent._id}`,
        formData,
      );

      setStudents((prev) =>
        prev.map((s) => (s._id === selectedStudent._id ? res.data.student : s)),
      );

      setIsModalOpen(false);

      alert("Student updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  // VIEW STUDENTS PROFILE
  const openProfileModal = (student) => {
    setViewStudent(student);

    setIsProfileModalOpen(true);
  };

  return (
    <div>
      {/* Update poup modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Update Student</h3>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />

            <div className="modal-actions">
              <button onClick={handleStudentUpdate}>Save</button>

              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* View profile modal */}
      {isProfileModalOpen && viewStudent && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Student Profile</h2>

            <p>
              <strong>Name:</strong> {viewStudent.name}
            </p>

            <p>
              <strong>Email:</strong> {viewStudent.email}
            </p>

            <p>
              <strong>Role:</strong> {viewStudent.role}
            </p>

            <p>
              <strong>ID:</strong> {viewStudent._id}
            </p>

            <div className="modal-actions">
              <button onClick={() => setIsProfileModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* admin content */}
      <div className="container">
        <h2 className="text-center">Admin Dashboard</h2>

        <h3>All Student Details</h3>
        {students.map((s) => (
          <div key={s._id} className="student-table-data-wrap">
            <p style={{ textAlign: "left", width: "250px", margin: "0" }}>
              {s.name}
            </p>
            <p style={{ textAlign: "left", width: "400px" }}>{s.email}</p>
            <div style={{ display: "flex", gap: "5px" }}>
              <button onClick={() => openProfileModal(s)}>View Profile</button>
              <button onClick={() => openUpdateModal(s)}>Update</button>
              <button onClick={() => handleStudentDelete(s._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
