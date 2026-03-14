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
  toggleActiveAboutSection,
  createHeading,
  updateHeading,
  createFile,
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
    description: "",
  });

  /* ================= FETCH ================= */

  const { data = [], isLoading } = useQuery({
    queryKey: ["aboutSection"],
    queryFn: async () => {
      const res = await getAllAboutSection();
      return res?.data?.data || res?.data || [];
    },
  });
  const refresh = () => {
    queryClient.invalidateQueries(["aboutSection"]);
  };

  /* ================= SELECT ================= */

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

      await selectiveDeleteAboutSection({ ids: selected });

      setSelected([]);

      refresh();

    } catch (err) {
      console.log(err);
    }

  };

  /* ================= INPUT ================= */

  const handleChange = (e) => {

    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });

  };

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));

  };

  /* ================= CREATE ================= */

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

      const aboutRes = await createAboutSection({
        headingId: newHeadingId,
        image: "http://localhost:8008" + imageUrl,
      });

      const newAboutId = aboutRes?.data?._id;

      if (newAboutId) {
        await toggleActiveAboutSection(newAboutId);
      }

      alert("About Created Successfully");

      setShowForm(false);

      setImageFile(null);

      refresh();

    } catch (err) {
      console.log(err);
    }
  };

  /* ================= UPDATE ================= */

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
        image: imageUrl,
      });

      alert("About Updated Successfully");

      setShowForm(false);

      setAboutId(null);
      setHeadingId(null);

      refresh();

    } catch (err) {
      console.log(err);
    }

  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {

    if (!window.confirm("Delete About?")) return;

    try {

      await singleDeleteAboutSection(id);

      refresh();

    } catch (err) {
      console.log(err);
    }

  };

  /* ================= EDIT ================= */

  const handleEdit = (item) => {

    setMode("update");
    setShowForm(true);

    setAboutId(item._id);
    setHeadingId(item.headingData?._id);

    setFormValues({
      tagline: item.headingData?.tagline || "",
      heading: item.headingData?.heading || "",
      description: item.headingData?.description || "",
    });

    setPreview(item.image);

  };

  /* ================= GET ================= */

  const handleGet = (item) => {

    setGetData(item);
    setShowGet(true);

  };

  /* ================= ACTIVE FIX ================= */

  const toggleActive = async (id) => {
    try {
      await toggleActiveAboutSection(id);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };


  if (isLoading) return <p>Loading...</p>;

  return (

    <div className={styles.banner}>

      <div className={styles.bannerWrap}>

        <h3 className={styles.title}>Control As You Want</h3>

        <div className={styles.topActions}>

          <button
            className={styles.createBtn}
            onClick={() => {

              setMode("create");
              setShowForm(true);

              setPreview("");

              setFormValues({
                tagline: "",
                heading: "",
                description: "",
              });

            }}
          >
            Create About
          </button>

          <button
            className={styles.deleteSelected}
            onClick={handleDeleteSelected}
          >
            <i className="bi bi-trash"></i>
            {selected.length === 0
              ? ""
              : allSelected
                ? " ALL"
                : ` (${selected.length}/${data.length})`}
          </button>

          

        </div>

      </div>

      <div className={styles.tableWrap}>

        <table className={styles.table}>

          <thead>

            <tr>

              <th className={styles.selectAll}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
                <span>Select All</span>
              </th>

              <th>Image</th>
              <th>Tagline</th>
              <th>Heading</th>
              <th>Active</th>
              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {data.map((item) => (

              <tr key={item._id}>

                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(item._id)}
                    onChange={() => handleSelect(item._id)}
                  />
                </td>

                <td>
                  <img src={item.image} width="80" alt="" />
                </td>

                <td>{item.headingData?.tagline}</td>

                <td>{item.headingData?.heading}</td>

                <td>

                  <i
                    className={
                      item.isActive
                        ? "bi bi-toggle-on"
                        : "bi bi-toggle-off"
                    }
                    style={{
                      fontSize: "28px",
                      cursor: "pointer",
                      color: item.isActive ? "#ED1C24" : "#aaa",
                    }}
                    onClick={() => toggleActive(item._id)}
                  ></i>

                </td>

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

            ))}

          </tbody>

        </table>

      </div>

      {/* FORM MODAL */}

      {showForm && (

        <div className={styles.modal}>

          <div className={styles.modalContent}>

            <h4>
              {mode === "create" ? "Create About" : "Update About"}
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

            <input type="file" onChange={handleImageChange} />

            {preview && <img src={preview} width="120" alt="" />}

            <div className={styles.modalActions}>

              <button onClick={() => setShowForm(false)}>
                Cancel
              </button>

              <button
                onClick={
                  mode === "create"
                    ? handleCreate
                    : handleUpdate
                }
              >
                {mode === "create" ? "Create" : "Update"}
              </button>

            </div>

          </div>

        </div>

      )}

      {/* GET MODAL */}

      {showGet && getData && (

        <div className={styles.modal}>

          <div className={styles.modalContent}>

            <h4>About Details</h4>

            <div className={styles.detailRow}>
  <span className={styles.label}>Tagline</span>
  <span className={styles.value}>{getData.headingData?.tagline}</span>
</div>

<div className={styles.detailRow}>
  <span className={styles.label}>Heading</span>
  <span className={styles.value}>{getData.headingData?.heading}</span>
</div>

<div className={styles.descriptionBlock}>
  <span className={styles.label}>Description</span>

  <p className={styles.descriptionText}>
    {getData.headingData?.description}
  </p>
</div>

            <img src={getData.image} width="200" alt="" />

            <br /><br />

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

                              // <button
                              //             className={styles.deleteSelected}
                              //             onClick={handleDeleteSelected}
                              //           >
                              //             <i className="bi bi-trash"></i>
                              //             {allSelected ? " ALL" : ` (${selected.length})`}
                              //           </button>