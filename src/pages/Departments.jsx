import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDepartments } from "../services/api";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getDepartments();
        setDepartments(data);
      } catch (err) {
        console.error("Failed to load departments", err);
        setError("Failed to fetch departments");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const goToDepartment = (dept) => {
    navigate(`/departments/${dept.departmentId}`, {
      state: { name: dept.displayName },
    });
  };

  return (
    <div className="page departments-page">
      <h1 className="section-title">Departments</h1>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading departments…</p>
      ) : (
        <ul className="department-list">
          {departments.map((d) => (
            <li key={d.departmentId} className="department-item" onClick={() => goToDepartment(d)}>
              {d.displayName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Departments;
