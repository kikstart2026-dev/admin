import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./AboutSectionControl.module.scss";

import {
  createHeading,
  updateHeading,
  createFile,
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
  const [headingId, setHeadingId] = useState(null);

  const [imageFile, setImageFile] = useState(null);

  const [formValues, setFormValues] = useState({
    tagline: "",
    heading: "",
    description: ""
  });


  const { data = [], isLoading } = useQuery({
    queryKey: ["aboutSection"],
    queryFn: async () => {
      const res = await getAllAboutSection();
      return res?.data || [];
    }
  });

  const refresh = () => {
    queryClient.invalidateQueries(["aboutSection"]);
  };



  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };



  const handleCreate = async () => {

    try {

      const headingRes = await createHeading(formValues);

      const newHeadingId = headingRes?.data?._id;

      let imageUrl = "";

      if (imageFile) {

        const fd = new FormData();
        fd.append("file", imageFile);

        const uploadRes = await createFile(fd);

        imageUrl = uploadRes?.data?.[0]?.path;

      }

      // 3️⃣ create about
      await createAboutSection({
        headingId: newHeadingId,
        image: "http://localhost:8008" + imageUrl
      });

      alert("About Created Successfully");

      setShowForm(false);

      setFormValues({
        tagline: "",
        heading: "",
        description: ""
      });

      setImageFile(null);

      refresh();

    } catch (err) {

      console.log(err);

    }

  };

  /* =========================
        UPDATE
  ========================= */

  const handleUpdate = async () => {

    try {

      await updateHeading(headingId, formValues);

      await updateAboutSection(aboutId, {
        headingId: headingId
      });

      alert("About Updated");

      setShowForm(false);

      refresh();

    } catch (err) {

      console.log(err);

    }

  };

  /* =========================
        DELETE
  ========================= */

  const handleDelete = async (id) => {

    if (!window.confirm("Delete About Section?")) return;

    try {

      await singleDeleteAboutSection(id);

      refresh();

    } catch (err) {

      console.log(err);

    }

  };

  /* =========================
        EDIT
  ========================= */

  const handleEdit = (item) => {

    setMode("update");

    setShowForm(true);

    setAboutId(item._id);

    setHeadingId(item.headingData?._id);

    setFormValues({
      tagline: item.headingData?.tagline || "",
      heading: item.headingData?.heading || "",
      description: item.headingData?.description || ""
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

            setFormValues({
              tagline: "",
              heading: "",
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
              <td colSpan="4">No Data Found</td>
            </tr>

          ) : (

            data.map((item) => (

              <tr key={item._id}>

                <td>{item.headingData?.tagline}</td>

                <td>{item.headingData?.heading}</td>

                <td>{item.headingData?.description}</td>

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

            <h4>
              {mode === "create" ? "Create About" : "Edit About"}
            </h4>

            <input
              type="text"
              name="tagline"
              placeholder="Tagline"
              value={formValues.tagline}
              onChange={handleChange}
            />

            <input
              type="text"
              name="heading"
              placeholder="Heading"
              value={formValues.heading}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formValues.description}
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