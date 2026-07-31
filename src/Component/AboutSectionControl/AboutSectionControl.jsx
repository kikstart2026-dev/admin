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
  getSingle,
} from "../../apis/api";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import {
  handleSuccess,
  handleError,
  handleWarning,
  handleConfirm,
} from "../../utils";

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

  const userData = JSON.parse(localStorage.getItem("adminUser") || "{}");

  const permissionKey = "AboutSectionPermission";

  // ================= GET ALL + PERMISSION =================
  const { data = [], isLoading } = useQuery({
    queryKey: ["aboutSection"],

    queryFn: async () => {
      const aboutRes = await getAllAboutSection();

      // 🔥 SAME AS HOMEBANNER STYLE
      try {
        const res = await getSingle({
          role: userData?.role,
          dynamicRole: userData?.dynamicRole,
          moduleName: "About Us Control",
        });

        localStorage.setItem(permissionKey, JSON.stringify(res?.data || {}));
      } catch (err) {
        console.error(err);
        localStorage.setItem(permissionKey, JSON.stringify({}));
      }

      return aboutRes?.data?.data || aboutRes?.data || [];
    },

    enabled: !!userData,
  });


  
  const modules = {
  toolbar: [
    [{ font: [] }, { size: [] }],
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

  // ================= PERMISSION =================
  const permissions = JSON.parse(localStorage.getItem(permissionKey) || "{}");

  const hasPermission = (type) => permissions?.[type] === true;

  const handleNoPermission = () => {
    handleError("Permission not granted");
  };

  const fetchAbout = () => {
    queryClient.invalidateQueries(["aboutSection"]);
  };

  const allSelected =
    selected.length === data.length && data.length > 0;

  // ================= SELECT =================
  const handleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSelectAll = () => {
    if (!hasPermission("delete")) return handleNoPermission();

    if (allSelected) setSelected([]);
    else setSelected(data.map((x) => x._id));
  };

  // ================= DELETE SELECTED =================
  const handleDeleteSelected = async () => {
    if (!hasPermission("delete")) return handleNoPermission();

    if (!selected.length) {
      handleWarning("Select About first");
      return;
    }

    if (!window.confirm("Delete Selected About?")) return;

    try {
      await selectiveDeleteAboutSection({ ids: selected });
      setSelected([]);
      fetchAbout();
      handleSuccess("Deleted Successfully");
    } catch (err) {
      handleError("Delete Failed");
    }
  };

  // ================= INPUT =================
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

  // ================= CREATE =================
  const handleCreate = async () => {
    if (!hasPermission("create")) return handleNoPermission();

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
        image: "https://backend-8e6g.onrender.com" + imageUrl,
      });

      const newAboutId = aboutRes?.data?._id;

      if (newAboutId) {
        await toggleActiveAboutSection(newAboutId);
      }

      handleSuccess("Created Successfully");
      setShowForm(false);
      setImageFile(null);
      fetchAbout();
    } catch (err) {
      handleError("Create Failed");
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    if (!hasPermission("update")) return handleNoPermission();

    try {
      await updateHeading(headingId, formValues);

      let imageUrl = preview;

      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);

        const uploadRes = await createFile(fd);
        imageUrl =
          "https://backend-8e6g.onrender.com" + uploadRes.data[0].path;
      }

      await updateAboutSection(aboutId, {
        headingId,
        image: imageUrl,
      });

      handleSuccess("Updated Successfully");
      setShowForm(false);
      fetchAbout();
    } catch (err) {
      handleError("Update Failed");
    }
  };

  // ================= DELETE =================
  const handleDelete = (id) => {
    if (!hasPermission("delete")) return handleNoPermission();

    handleConfirm("Delete About?", async () => {
      try {
        await singleDeleteAboutSection(id);
        fetchAbout();
        handleSuccess("Deleted");
      } catch {
        handleError("Delete Failed");
      }
    });
  };

  // ================= EDIT =================
  const handleEdit = (item) => {
    if (!hasPermission("update")) return handleNoPermission();

    setMode("update");
    setShowForm(true);

    setAboutId(item._id);
    setHeadingId(item.headingData._id);

    setFormValues({
      tagline: item.headingData?.tagline || "",
      heading: item.headingData?.heading || "",
      description: item.headingData?.description || "",
    });

    setPreview(item.image);
    setImageFile(null);
  };

  // ================= GET =================
  const handleGet = (item) => {
    if (!hasPermission("read")) return handleNoPermission();

    setGetData(item);
    setShowGet(true);
  };

  // ================= ACTIVE =================
  const toggleActive = async (id) => {
    if (!hasPermission("update")) return handleNoPermission();

    try {
      await toggleActiveAboutSection(id);
      fetchAbout();
    } catch {
      handleError("Toggle Failed");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  const cleanHtml = getData?.headingData?.description?.replace(/&nbsp;/g, " ");

  return (

    <div className={styles.banner}>

      <div className={styles.bannerWrap}>

        <h3 className={styles.title}>
          Control As You Want
        </h3>

        <div className={styles.topActions}>

          <button
            className={`${styles.createBtn} ${
              !hasPermission("create")
                ? styles.disabledBtn
                : ""
            }`}
            onClick={() => {

              if (!hasPermission("create")) {
                return handleNoPermission();
              }

              setMode("create");

              setShowForm(true);

              setPreview("");

              setFormValues({
                tagline: "",
                heading: "",
                description: "",
              });

              setImageFile(null);

            }}
          >
            Create About
          </button>

          <button
            className={`${styles.deleteSelected} ${
              !hasPermission("delete")
                ? styles.disabledBtn
                : ""
            }`}
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
                  className={`${styles.checkbox} ${
                    !hasPermission("delete")
                      ? styles.disabledBtn
                      : ""
                  }`}
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

            {data.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  No About Found
                </td>

              </tr>

            ) : (

              data.map((item) => (

                <tr key={item._id}>

                  <td>

                    <input
                      className={`${styles.checkbox} ${
                        !hasPermission("delete")
                          ? styles.disabledBtn
                          : ""
                      }`}
                      type="checkbox"
                      checked={selected.includes(item._id)}
                      onChange={() => {

                        if (!hasPermission("delete")) {
                          return handleNoPermission();
                        }

                        handleSelect(item._id);

                      }}
                    />

                  </td>

                  <td>
                    <img
                      src={
                        item?.image ||
                        "https://via.placeholder.com/80?text=No+Image"
                      }
                      width="80"
                      alt=""
                    />
                  </td>

                  <td>
                    {item?.headingData?.tagline ||
                      "No tagline"}
                  </td>

                  <td>
                    {item?.headingData?.heading ||
                      "No Heading"}
                  </td>

                  <td>

                    <i
                      className={`${
                        item.isActive
                          ? "bi bi-toggle-on"
                          : "bi bi-toggle-off"
                      } ${
                        !hasPermission("update")
                          ? styles.disabledBtn
                          : ""
                      }`}
                      style={{
                        fontSize: "28px",
                        cursor: "pointer",
                        color: item.isActive
                          ? "#ED1C24"
                          : "#aaa",
                      }}
                      onClick={() => {

                        if (!hasPermission("update")) {
                          return handleNoPermission();
                        }

                        toggleActive(item._id);

                      }}
                    ></i>

                  </td>

                  <td className={styles.actions}>

                    <button
                      className={
                        !hasPermission("update")
                          ? styles.disabledBtn
                          : ""
                      }
                      onClick={() =>
                        handleEdit(item)
                      }
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>

                    <button
                      className={
                        !hasPermission("read")
                          ? styles.disabledBtn
                          : ""
                      }
                      onClick={() =>
                        handleGet(item)
                      }
                    >
                      <i className="bi bi-eye"></i>
                    </button>

                    <button
                      className={
                        !hasPermission("delete")
                          ? styles.disabledBtn
                          : ""
                      }
                      onClick={() =>
                        handleDelete(item._id)
                      }
                    >
                      <i className="bi bi-trash"></i>
                    </button>

                  </td>

                </tr>

              ))
            )}

          </tbody>

        </table>

      </div>

      {showForm && (

        <div className={styles.modal}>

          <div className={styles.modalContent}>

            <h4>
              {mode === "create"
                ? "Create About"
                : "Update About"}
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

            <div className={styles.ck}>

              <ReactQuill
                theme="snow"
                value={formValues.description}
                onChange={(value) =>
                  setFormValues({
                    ...formValues,
                    description: value,
                  })
                }
                modules={modules}
              />

            </div>

            <input
              type="file"
              onChange={handleImageChange}
            />

            {preview && (
              <img
                src={preview}
                width="120"
                alt=""
              />
            )}

            <div className={styles.modalActions}>

              <button
                onClick={() =>
                  setShowForm(false)
                }
              >
                Cancel
              </button>

              <button
                className={`${
                  (
                    mode === "create" &&
                    !hasPermission("create")
                  ) ||
                  (
                    mode === "update" &&
                    !hasPermission("update")
                  )
                    ? styles.disabledBtn
                    : ""
                }`}
                onClick={() => {

                  if (
                    mode === "create" &&
                    !hasPermission("create")
                  ) {
                    return handleNoPermission();
                  }

                  if (
                    mode === "update" &&
                    !hasPermission("update")
                  ) {
                    return handleNoPermission();
                  }

                  mode === "create"
                    ? handleCreate()
                    : handleUpdate();

                }}
              >
                {mode === "create"
                  ? "Create"
                  : "Update"}
              </button>

            </div>

          </div>

        </div>

      )}

      {showGet && getData && (

        <div className={styles.modal}>

          <div className={styles.modalContent}>

            <h4>About Details</h4>

            <div className={styles.detailRow}>
              <span className={styles.label}>
                Tagline
              </span>

              <span className={styles.value}>
                {getData.headingData?.tagline}
              </span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>
                Heading
              </span>

              <span className={styles.value}>
                {getData.headingData?.heading}
              </span>
            </div>

            <div className={styles.descriptionBlock}>
              <span className={styles.label}>Description</span>
              <div
                className={styles.descriptionText}
                dangerouslySetInnerHTML={{
                  __html: cleanHtml || "",
                }}
              ></div>

            </div>

            <img
              src={getData.image}
              width="200"
              alt=""
            />

            <br /><br />

            <button
              className={styles.closeBtn}
              onClick={() =>
                setShowGet(false)
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>

  );

}