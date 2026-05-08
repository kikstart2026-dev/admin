import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import styles from "./TestimonailControl.module.scss";

import {
  getAllTest,
  createTest,
  updateTest,
  delSingleTest,
  delSelectiveTest,
  createHeading,
  updateHeading,
  createFile,
  getSingle,
} from "../../apis/api";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import "../../Main.scss";

import {
  handleSuccess,
  handleError,
} from "../../utils";

export default function TestimonialControl() {

  const queryClient = useQueryClient();

  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [showHeadingModal, setShowHeadingModal] = useState(false);
  const [showGet, setShowGet] = useState(false);

  const [mode, setMode] = useState("create");
  const [cardId, setCardId] = useState(null);

  const [headingId, setHeadingId] = useState(null);

  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [getData, setGetData] = useState(null);

  const [headingData, setHeadingData] = useState({
    tagline: "",
    heading: "",
    description: "",
  });

  const [formValues, setFormValues] = useState({
    name: "",
    designation: "",
    description: "",
  });

  // ================= USER =================
  const userData = JSON.parse(
    localStorage.getItem("adminUser") || "{}"
  );

  // ================= PERMISSION KEY =================
  const permissionKey = "TestimonialPermission";

  // ================= FETCH DATA =================
  const { data = {}, isLoading } = useQuery({
    queryKey: ["testimonials"],

    queryFn: async () => {

      const res = await getAllTest();

      // ================= PERMISSION (ABOUT STYLE FIX) =================
      try {
        const permissionRes = await getSingle({
          role: userData?.role,
          dynamicRole: userData?.dynamicRole,
          moduleName: "Testimonial Control",
        });

        localStorage.setItem(
          permissionKey,
          JSON.stringify(permissionRes?.data || {})
        );

      } catch (error) {

        console.error("Permission Error:", error);

        localStorage.setItem(
          permissionKey,
          JSON.stringify({})
        );
      }

      return res?.data || {};
    },

    enabled: !!userData,
  });

  // ================= PERMISSION =================
  const permissions = JSON.parse(
    localStorage.getItem(permissionKey) || "{}"
  );

  const hasPermission = (type) =>
    permissions?.[type] === true;

  const handleNoPermission = () => {
    handleError("Permission not granted");
  };

  // ================= QUILL =================
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

  // ================= DATA SET =================
  useEffect(() => {

    setCards(data.cards || []);

    if (data.heading) {

      setHeadingId(data.heading._id);

      setHeadingData({
        tagline: data.heading.tagline || "",
        heading: data.heading.heading || "",
        description: data.heading.description || "",
      });
    }

  }, [data]);

  // ================= REFRESH =================
  const fetchData = () => {
    queryClient.invalidateQueries(["testimonials"]);
  };

  const allSelected =
    selected.length === cards.length &&
    cards.length > 0;

  // ================= SELECT =================
  const handleSelect = (id) => {

    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {

    if (!hasPermission("delete")) {
      return handleNoPermission();
    }

    setSelected(allSelected ? [] : cards.map((x) => x._id));
  };

  // ================= DELETE SELECTED =================
  const handleDeleteSelected = async () => {

    if (!hasPermission("delete")) {
      return handleNoPermission();
    }

    if (!selected.length) {
      return handleError("Select cards first");
    }

    if (!window.confirm("Delete Selected Cards?")) return;

    await delSelectiveTest({
      ids: selected,
    });

    setSelected([]);

    fetchData();
  };

  // ================= HEADING SAVE =================
  const handleHeadingSave = async () => {

    if (!hasPermission("create") && !hasPermission("update")) {
      return handleNoPermission();
    }

    try {

      if (headingId) {

        await updateHeading(headingId, headingData);

        handleSuccess("Heading Updated");

      } else {

        const res = await createHeading(headingData);

        setHeadingId(res?.data?._id);

        handleSuccess("Heading Created");
      }

      fetchData();

    } catch (err) {
      console.log(err);
    }
  };

  // ================= IMAGE =================
  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);

    setPreview(URL.createObjectURL(file));
  };

  // ================= CREATE =================
  const handleCreate = async () => {

    if (!hasPermission("create")) {
      return handleNoPermission();
    }

    if (!headingId) {
      return handleError("Create heading first");
    }

    if (
      !formValues.name ||
      !formValues.designation ||
      !imageFile
    ) {
      return handleError(
        "Name, Designation and Image are required"
      );
    }

    let imageUrl = "";

    const fd = new FormData();
    fd.append("file", imageFile);

    const uploadRes = await createFile(fd);

    imageUrl =
      "http://localhost:8008" +
      uploadRes.data[0].path;

    await createTest({
      headingId,
      image: imageUrl,
      name: formValues.name,
      designation: formValues.designation,
      description: formValues.description,
    });

    handleSuccess("Card Created");

    setShowForm(false);

    fetchData();
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {

    if (!hasPermission("update")) {
      return handleNoPermission();
    }

    let imageUrl = preview;

    if (imageFile) {

      const fd = new FormData();
      fd.append("file", imageFile);

      const uploadRes = await createFile(fd);

      imageUrl =
        "http://localhost:8008" +
        uploadRes.data[0].path;
    }

    await updateTest(cardId, {
      headingId,
      image: imageUrl,
      name: formValues.name,
      designation: formValues.designation,
      description: formValues.description,
    });

    handleSuccess("Card Updated");

    setShowForm(false);

    fetchData();
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {

    if (!hasPermission("delete")) {
      return handleNoPermission();
    }

    if (!window.confirm("Delete Card?")) return;

    await delSingleTest(id);

    fetchData();
  };

  // ================= EDIT =================
  const handleEdit = (item) => {

    if (!hasPermission("update")) {
      return handleNoPermission();
    }

    setMode("update");
    setShowForm(true);

    setCardId(item._id);

    setFormValues({
      name: item.name,
      designation: item.designation,
      description: item.description,
    });

    setPreview(item.image);
    setImageFile(null);
  };

  // ================= GET =================
  const handleGet = (item) => {

    if (!hasPermission("read")) {
      return handleNoPermission();
    }

    setGetData(item);
    setShowGet(true);
  };

  if (isLoading) return <p>Loading...</p>;

  const cleanHtml = getData?.description?.replace(/&nbsp;/g, " ");

  return (
    <div className={styles.banner}>

      <div className={styles.bannerWrap}>

        <h3 className={styles.title}>
          Control As You Want
        </h3>

        <div className={styles.topActions}>

          {/* CREATE CARD */}
          <button
            className={`${styles.createBtn} ${!hasPermission("create")
              ? styles.disabledBtn
              : ""
              }`}
            onClick={() => {

              if (!hasPermission("create")) {
                return handleNoPermission();
              }

              setMode("create");

              setShowForm(true);

              setFormValues({
                name: "",
                designation: "",
                description: "",
              });

              setPreview("");

              setImageFile(null);
            }}
          >
            Create Card
          </button>

          {/* UPDATE HEADING */}
          <button
            className={`${styles.createBtn} ${!hasPermission("update")
              ? styles.disabledBtn
              : ""
              }`}
            onClick={() => {

              if (!hasPermission("update")) {
                return handleNoPermission();
              }

              setShowHeadingModal(true);
            }}
          >
            Update Heading
          </button>

          {/* DELETE SELECTED */}
          <button
            className={`${styles.deleteSelected} ${!hasPermission("delete")
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
                : ` (${selected.length}/${cards.length})`}
          </button>

        </div>
      </div>

      <div className={styles.tableWrap}>

        <table className={styles.table}>

          <thead>

            <tr>

              <th>

                <input
                  className={`${styles.checkbox} ${!hasPermission("delete")
                    ? styles.disabledBtn
                    : ""
                    }`}
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />

                {" "}Select All

              </th>

              <th>Image</th>

              <th>Name</th>

              <th>Designation</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {cards.length === 0 ? (

              <tr>

                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  No Testimonials Found
                </td>

              </tr>

            ) : (

              cards.map((item) => (

                <tr key={item._id}>

                  <td>

                    <input
                      type="checkbox"
                      className={`${styles.checkbox} ${!hasPermission("delete")
                        ? styles.disabledBtn
                        : ""
                        }`}
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
                      src={item.image}
                      alt=""
                      width="80"
                    />

                  </td>

                  <td>{item.name}</td>

                  <td>{item.designation}</td>

                  <td className={styles.actions}>

                    {/* EDIT */}
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

                    {/* VIEW */}
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

                    {/* DELETE */}
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

      {/* FORM MODAL */}
      {showForm && (

        <div className={styles.modal}>

          <div className={styles.modalContent}>

            <h4>
              {mode === "create"
                ? "Create Card"
                : "Edit Card"}
            </h4>

            <input
              type="text"
              placeholder="Name"
              value={formValues.name}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  name: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Designation"
              value={formValues.designation}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  designation: e.target.value,
                })
              }
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
                alt=""
                width="120"
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
                className={`${(
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

      {/* HEADING MODAL */}
      {showHeadingModal && (

        <div className={styles.modal}>

          <div className={styles.modalContent}>

            <h4>Update Heading</h4>

            <input
              type="text"
              placeholder="Tagline"
              value={headingData.tagline}
              onChange={(e) =>
                setHeadingData({
                  ...headingData,
                  tagline: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Heading"
              value={headingData.heading}
              onChange={(e) =>
                setHeadingData({
                  ...headingData,
                  heading: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Description"
              value={headingData.description}
              onChange={(e) =>
                setHeadingData({
                  ...headingData,
                  description: e.target.value,
                })
              }
            />

            <div className={styles.modalActions}>

              <button
                onClick={() =>
                  setShowHeadingModal(false)
                }
              >
                Cancel
              </button>

              <button
                className={`${!hasPermission("update")
                  ? styles.disabledBtn
                  : ""
                  }`}
                onClick={async () => {

                  if (!hasPermission("update")) {
                    return handleNoPermission();
                  }

                  await handleHeadingSave();

                  setShowHeadingModal(false);
                }}
              >
                Save Heading
              </button>

            </div>

          </div>

        </div>
      )}

      {/* GET MODAL */}
      {showGet && getData && (

        <div className={styles.modal}>

          <div className={styles.modalContent}>

            <h4>View Card</h4>

            <table>

              <tbody>

                <tr>

                  <th>Image</th>

                  <td>
                    <img
                      src={getData.image}
                      alt=""
                    />
                  </td>

                </tr>

                <tr>

                  <th>Name</th>

                  <td>{getData.name}</td>

                </tr>

                <tr>

                  <th>Designation</th>

                  <td>{getData.designation}</td>

                </tr>

                <tr>

                  <th>Description</th>

                  <td
                    dangerouslySetInnerHTML={{
                      __html: cleanHtml || "",
                    }}
                  ></td>

                </tr>

              </tbody>

            </table>

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