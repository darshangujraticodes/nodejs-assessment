import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { logout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/student/profile");
        console.log("PROFILE:", res.data);

        setUser(res.data.student);
      } catch (err) {
        console.log(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  //logout function
  const handleLogout = () => {
    logout();
    setUser(null);

    navigate("/login");
  };

  if (loading) return <p>Loading profile...</p>;

  if (!user) return <p>No user found</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Profile</h2>

      <div>
        <p>
          <b>Name:</b> {user.name}
        </p>
        <p>
          <b>Email:</b> {user.email}
        </p>
        <p>
          <b>Role:</b> {user.role}
        </p>
        <p>
          <b>ID:</b> {user._id}
        </p>
      </div>

      <div>
        <button
          onClick={handleLogout}
          style={{
            marginTop: "20px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
