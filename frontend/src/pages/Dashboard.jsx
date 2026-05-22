import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [students, setStudents] = useState([]);

  const [modalType, setModalType] = useState(null);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // FETCH STUDENTS
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/admin/students");

        setStudents(res.data.students);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStudents();
  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // CLOSE MODAL
  const closeModal = () => {
    setModalType(null);

    setSelectedStudent(null);

    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  // =========================
  // OPEN PROFILE MODAL
  // =========================
  const openProfileModal = (student) => {
    setSelectedStudent(student);

    setModalType("profile");
  };

  // OPEN UPDATE MODAL
  const openUpdateModal = (student) => {
    setSelectedStudent(student);

    setFormData({
      name: student.name,
      email: student.email,
      password: "",
    });

    setModalType("update");
  };

  // OPEN CREATE MODAL
  const openCreateModal = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
    });

    setModalType("create");
  };

  // CREATE STUDENT
  const handleCreateStudent = async () => {
    try {
      const res = await api.post("/admin/students", formData);

      setStudents((prev) => [...prev, res.data.student]);

      alert("Student created successfully");

      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Creation failed");
    }
  };

  // UPDATE STUDENT
  const handleStudentUpdate = async () => {
    try {
      const res = await api.put(`/admin/students/${selectedStudent._id}`, {
        name: formData.name,
        email: formData.email,
      });

      setStudents((prev) =>
        prev.map((s) => (s._id === selectedStudent._id ? res.data.student : s)),
      );

      alert("Student updated successfully");

      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  // DELETE STUDENT
  const handleStudentDelete = async (id) => {
    try {
      await api.delete(`/admin/students/${id}`);

      setStudents((prev) => prev.filter((s) => s._id !== id));

      alert("Student deleted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      {/* Create Popup Modal */}

      {modalType === "create" && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Create Student</h2>

            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
            />

            <div className="modal-actions">
              <button onClick={handleCreateStudent}>Create</button>

              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Update Popup Modal */}

      {modalType === "update" && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Update Student</h2>

            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
            />

            <div className="modal-actions">
              <button onClick={handleStudentUpdate}>Save</button>

              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* View Profile Popup Modal */}

      {modalType === "profile" && selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Student Profile</h2>

            <p>
              <strong>Name:</strong> {selectedStudent.name}
            </p>

            <p>
              <strong>Email:</strong> {selectedStudent.email}
            </p>

            <p>
              <strong>Role:</strong> {selectedStudent.role}
            </p>

            <p>
              <strong>ID:</strong> {selectedStudent._id}
            </p>

            <div className="modal-actions">
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Admin content */}

      <div className="container">
        <h2 className="text-center">Admin Dashboard</h2>

        <div>
          {/* create new Student */}
          <h3>
            Create New Student :
            <button style={{ marginLeft: "10px" }} onClick={openCreateModal}>
              Add Student
            </button>{" "}
          </h3>
        </div>

        <h3>All Student Details</h3>

        {students.map((s) => (
          <div key={s._id} className="student-table-data-wrap">
            <p
              style={{
                textAlign: "left",
                width: "250px",
                margin: "0",
              }}
            >
              {s.name}
            </p>

            <p
              style={{
                textAlign: "left",
                width: "400px",
              }}
            >
              {s.email}
            </p>

            <div
              style={{
                display: "flex",
                gap: "5px",
              }}
            >
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
