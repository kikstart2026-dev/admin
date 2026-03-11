import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./AboutSectionControl.module.scss";

import {
  createAboutSection,
  getAllAboutSection,
  updateAboutSection,
  singleDeleteAboutSection
} from "../../apis/api";

export default function AboutSectionControl() {

  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("create");
  const [aboutId, setAboutId] = useState(null);

  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    subtitle: "",
    title: "",
    description: ""
  });

  // =========================
  // FETCH DATA
  // =========================

  const { data = [], isLoading } = useQuery({
    queryKey: ["aboutSection"],
    queryFn: async () => {
      const res = await getAllAboutSection();
      return res?.data?.data || res?.data || [];
    }
  });

  const fetchAbout = () => {
    queryClient.invalidateQueries(["aboutSection"]);
  };

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // =========================
  // CREATE
  // =========================

  const handleCreate = async () => {
    try {

      const fd = new FormData();

      fd.append("subtitle", form.subtitle);
      fd.append("title", form.title);
      fd.append("description", form.description);

      if (image) {
        fd.append("image", image);
      }

      await createAboutSection(fd);

      alert("About Section Created");

      setShowForm(false);

      setForm({
        subtitle: "",
        title: "",
        description: ""
      });

      setImage(null);

      fetchAbout();

    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // UPDATE
  // =========================

  const handleUpdate = async () => {
    try {

      const fd = new FormData();

      fd.append("subtitle", form.subtitle);
      fd.append("title", form.title);
      fd.append("description", form.description);

      if (image) {
        fd.append("image", image);
      }

      await updateAboutSection(aboutId, fd);

      alert("About Section Updated");

      setShowForm(false);

      fetchAbout();

    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {

    if (!window.confirm("Delete About Section?")) return;

    try {

      await singleDeleteAboutSection(id);

      fetchAbout();

    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (item) => {

    setMode("update");

    setShowForm(true);

    setAboutId(item._id);

    setForm({
      subtitle: item.subtitle || "",
      title: item.title || "",
      description: item.description || ""
    });

  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className={styles.aboutAdmin}>

      <div className={styles.top}>
        <h3>About Section Control</h3>

        <button
          onClick={() => {
            setMode("create");
            setShowForm(true);
            setForm({
              subtitle: "",
              title: "",
              description: ""
            });
          }}
        >
          Create About
        </button>
      </div>

      {/* TABLE */}

      <table className={styles.table}>

        <thead>
          <tr>
            <th>Tagline</th>
            <th>Heading</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {data.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ padding: "20px" }}>
                No Data Found
              </td>
            </tr>
          ) : (

            data.map((item) => (

              <tr key={item._id}>

                <td>{item.subtitle}</td>

                <td>{item.title}</td>

                <td>{item.description}</td>

                <td>

                  <button onClick={() => handleEdit(item)}>
                    Edit
                  </button>

                  <button onClick={() => handleDelete(item._id)}>
                    Delete
                  </button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>


      {/* MODAL */}

      {showForm && (

        <div className={styles.modal}>

          <div className={styles.modalContent}>

            <h4>{mode === "create" ? "Create About" : "Edit About"}</h4>

            <input
              type="text"
              placeholder="Subtitle"
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
            />

            <input
              type="text"
              placeholder="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
            />

            <textarea
              placeholder="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />

            <label>Image</label>

            <input
              type="file"
              onChange={handleImageChange}
            />

            <div className={styles.actions}>

              <button onClick={() => setShowForm(false)}>
                Cancel
              </button>

              <button
                onClick={mode === "create" ? handleCreate : handleUpdate}
              >
                {mode === "create" ? "Create" : "Update"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}