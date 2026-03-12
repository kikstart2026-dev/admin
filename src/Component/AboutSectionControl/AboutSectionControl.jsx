import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./AboutSectionControl.module.scss";
import "../../Main.scss";

import {
  getAllAboutSection,
  createAboutSection,
  updateAboutSection,
  singleDeleteAboutSection,
  selectiveDeleteAboutSection,
  createHeading,
  updateHeading,
  createFile
} from "../../apis/api";

export default function AboutSectionControl() {

  const queryClient = useQueryClient();

  const [selected, setSelected] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showGet, setShowGet] = useState(false);

  const [mode, setMode] = useState("create");

  const [aboutId, setAboutId] = useState(null);
  const [headingId, setHeadingId] = useState(null);

  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [getData, setGetData] = useState(null);

  const [formValues, setFormValues] = useState({
    tagline: "",
    heading: "",
    description: ""
  });


  /* ==============================
        FETCH
  ============================== */

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


  /* ==============================
        SELECT LOGIC
  ============================== */

  const allSelected = selected.length === data.length && data.length > 0;

  const handleSelect = (id) => {

    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }

  };

  const handleSelectAll = () => {

    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(data.map((x) => x._id));
    }

  };


  const handleDeleteSelected = async () => {

    if (selected.length === 0) {
      alert("Select About first");
      return;
    }

    if (!window.confirm("Delete Selected About?")) return;

    try {

      await selectiveDeleteAboutSection({
        ids: selected
      });

      setSelected([]);

      refresh();

    } catch (err) {

      console.log(err);

    }

  };


  /* ==============================
        INPUT
  ============================== */

  const handleChange = (e) => {

    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value
    });

  };


  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);

    setPreview(URL.createObjectURL(file));

  };


  /* ==============================
        CREATE
  ============================== */

  const handleCreate = async () => {

    try {

      const headingRes = await createHeading(formValues);

      const newHeadingId = headingRes?.data?._id;

      let imageUrl = "";

      if (imageFile) {

        const fd = new FormData();

        fd.append("file", imageFile);

        const uploadRes = await createFile(fd);

        imageUrl = uploadRes.data[0].path;

      }

      await createAboutSection({
        headingId: newHeadingId,
        image: "http://localhost:8008" + imageUrl
      });

      alert("About Created Successfully");

      setShowForm(false);

      setImageFile(null);

      refresh();

    } catch (err) {

      console.log(err);

    }

  };


  /* ==============================
        UPDATE
  ============================== */

  const handleUpdate = async () => {

    try {

      await updateHeading(headingId, formValues);

      let imageUrl = preview;

      if (imageFile) {

        const fd = new FormData();

        fd.append("file", imageFile);

        const uploadRes = await createFile(fd);

        imageUrl = "http://localhost:8008" + uploadRes.data[0].path;

      }

      await updateAboutSection(aboutId, {
        headingId,
        image: imageUrl
      });

      alert("About Updated Successfully");

      setShowForm(false);

      setImageFile(null);

      refresh();

    } catch (err) {

      console.log(err);

    }

  };


  /* ==============================
        DELETE
  ============================== */

  const handleDelete = async (id) => {

    if (!window.confirm("Delete About?")) return;

    try {

      await singleDeleteAboutSection(id);

      refresh();

    } catch (err) {

      console.log(err);

    }

  };


  /* ==============================
        EDIT
  ============================== */

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

    setPreview(item.image);

    setImageFile(null);

  };


  /* ==============================
        GET
  ============================== */

  const handleGet = (item) => {

    setGetData(item);

    setShowGet(true);

  };


  if (isLoading) return <p>Loading...</p>;


  return (

    <div className={styles.banner}>

      <div className={styles.bannerWrap}>

        <h3 className={styles.title}>
          Control About Section
        </h3>

        <div className={styles.topActions}>

          <button
            className={styles.createBtn}
            onClick={() => {

              setMode("create");

              setShowForm(true);

              setFormValues({
                tagline: "",
                heading: "",
                description: ""
              });

              setPreview("");

              setImageFile(null);

            }}
          >
            Create About
          </button>

          <button
            className={styles.deleteSelected}
            onClick={handleDeleteSelected}
          >
            <i className="bi bi-trash"></i>{" "}
            {allSelected ? "ALL" : `(${selected.length}/${data.length})`}
          </button>

        </div>

      </div>


      {/* TABLE */}

      <div className={styles.tableWrap}>

        <table className={styles.table}>

          <thead>

            <tr>

              <th>

                <input
                  className={styles.checkbox}
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                /> Select All

              </th>

              <th>Image</th>
              <th>Tagline</th>
              <th>Heading</th>
              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {data.length === 0 ? (

              <tr>
                <td colSpan={5}>No About Found</td>
              </tr>

            ) : (

              data.map((item) => (

                <tr key={item._id}>

                  <td>

                    <input
                      className={styles.checkbox}
                      type="checkbox"
                      checked={selected.includes(item._id)}
                      onChange={() => handleSelect(item._id)}
                    />

                  </td>

                  <td>
                    <img src={item.image} alt="" />
                  </td>

                  <td>{item.headingData?.tagline}</td>

                  <td>{item.headingData?.heading}</td>

                  <td className={styles.actions}>
                    <button onClick={() => handleEdit(item)}>
                      <i className="bi bi-pencil-square"></i>
                    </button>

                    <button onClick={() => handleGet(item)}>
                      <i className="bi bi-eye"></i>
                    </button>

                    <button onClick={() => handleDelete(item._id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>


      {/* FORM */}

      {showForm && (

        <div className={styles.modal}>

          <div className={styles.modalContent}>

            <h4>
              {mode === "create"
                ? "Create About"
                : "Edit About"}
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

            <input
              type="file"
              onChange={handleImageChange}
            />

            {preview && (
              <img
                src={preview}
                alt="preview"
                className={styles.preview}
              />
            )}

            <div className={styles.modalActions}>

              <button
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                onClick={mode === "create"
                  ? handleCreate
                  : handleUpdate}
              >
                {mode === "create"
                  ? "Create"
                  : "Update"}
              </button>

            </div>

          </div>

        </div>

      )}


      {/* GET */}

      {showGet && getData && (

        <div className={styles.modal}>

          <div className={styles.modalContent}>

            <h4>About Details</h4>

            <table>

              <tbody>

                <tr>
                  <th>Tagline</th>
                  <td>{getData.headingData.tagline}</td>
                </tr>

                <tr>
                  <th>Heading</th>
                  <td>{getData.headingData.heading}</td>
                </tr>

                <tr>
                  <th>Description</th>
                  <td>{getData.headingData.description}</td>
                </tr>

                <tr>
                  <th>Image</th>
                  <td>
                    <img src={getData.image} alt="" />
                  </td>
                </tr>

              </tbody>

            </table>

            <button
              className={styles.closeBtn}
              onClick={() => setShowGet(false)}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>

  );

}