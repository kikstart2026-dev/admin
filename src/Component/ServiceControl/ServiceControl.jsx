import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./ServiceControl.module.scss";

import {
  getAllService,
  createService,
  updateService,
  singleDeleteService,
  selectiveDeleteService,
  createHeading,
  updateHeading,
  createFile,
  getSingle
} from "../../apis/api";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import "../../Main.scss";

import {
  handleSuccess,
  handleError,
  handleConfirm,
} from "../../utils";

export default function ServiceControl() {

  const queryClient = useQueryClient();

  // --- STATES ---
  const [selected, setSelected] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showHeadingModal, setShowHeadingModal] = useState(false);
  const [showGet, setShowGet] = useState(false);

  const [mode, setMode] = useState("create");
  const [serviceId, setServiceId] = useState(null);
  const [headingId, setHeadingId] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [oldImage, setOldImage] = useState("");
  const [getData, setGetData] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [headingData, setHeadingData] = useState({
    tagline: "",
    heading: ""
  });

  const [formValues, setFormValues] = useState({
    title: "",
    details: ""
  });


    // ================= QUILL MODULES =================
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

  // ================= USER =================
  const userData = JSON.parse(
    localStorage.getItem("adminUser") || "{}"
  );

  // ================= PERMISSION KEY =================
  const permissionKey = "ServicePermission";

  // ================= FETCH DATA =================
  const { data = {}, isLoading } = useQuery({
    queryKey: ["services", page],

    queryFn: async () => {

      const res = await getAllService(page, limit);

      // ================= PERMISSION (ABOUT STYLE FIX) =================
      try {
        const permissionRes = await getSingle({
          role: userData?.role,
          dynamicRole: userData?.dynamicRole,
          moduleName: "Service Control",
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

      return res || {};
    },

    enabled: !!userData,

    keepPreviousData: true,
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

  // ================= DATA =================
  const services = data.data || [];
  const totalPages = data.totalPages || 1;

  useEffect(() => {

    if (services.length > 0) {

      const validHeading = services.find(
        item => item.headingData
      );

      if (validHeading?.headingData) {

        setHeadingId(validHeading.headingData._id);

        setHeadingData({
          tagline: validHeading.headingData.tagline || "",
          heading: validHeading.headingData.heading || ""
        });
      }
    }

  }, [services]);

  const fetchData = () => {
    queryClient.invalidateQueries({
      queryKey: ["services"]
    });
  };

  // ================= SELECT =================
  const handleSelect = (id) => {

    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {

    if (!hasPermission("delete")) {
      return handleNoPermission();
    }

    if (
      services.length > 0 &&
      selected.length === services.length
    ) {
      setSelected([]);
    } else {
      setSelected(services.map(x => x._id));
    }
  };

  // ================= DELETE SELECTED =================
  const handleDeleteSelected = async () => {

    if (!hasPermission("delete")) {
      return handleNoPermission();
    }

    if (selected.length === 0) {
      return handleError("Select services first");
    }

    if (!window.confirm("Delete Selected Services?")) return;

    try {

      await selectiveDeleteService({
        ids: selected
      });

      handleSuccess("Deleted Successfully");

      setSelected([]);

      fetchData();

    } catch (err) {
      console.error(err);
      handleError("Failed to delete selected services");
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

    if (!formValues.title || !imageFile) {
      return handleError("Title and Image required");
    }

    try {

      const fd = new FormData();
      fd.append("file", imageFile);

      const uploadRes = await createFile(fd);

      const imageUrl =
        "https://backend-8e6g.onrender.com" +
        uploadRes.data[0].path;

      await createService({
        headingId,
        image: imageUrl,
        title: formValues.title,
        details: formValues.details
      });

      handleSuccess("Created");

      setShowForm(false);

      fetchData();

    } catch (err) {
      console.error(err);
      handleError("Failed to create service");
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {

    if (!hasPermission("update")) {
      return handleNoPermission();
    }

    try {

      let imageUrl = oldImage;

      if (imageFile) {

        const fd = new FormData();
        fd.append("file", imageFile);

        const uploadRes = await createFile(fd);

        imageUrl =
          "https://backend-8e6g.onrender.com" +
          uploadRes.data[0].path;
      }

      await updateService(serviceId, {
        headingId,
        image: imageUrl,
        title: formValues.title,
        details: formValues.details
      });

      handleSuccess("Updated");

      setShowForm(false);

      fetchData();

    } catch (err) {
      console.error(err);
      handleError("Failed to update service");
    }
  };

  // ================= DELETE =================
  const handleDelete = (id) => {

    if (!hasPermission("delete")) {
      return handleNoPermission();
    }

    handleConfirm("Delete?", async () => {

      try {

        await singleDeleteService(id);

        handleSuccess("Deleted Successfully");

        fetchData();

      } catch (err) {

        console.error(err);
        handleError("Failed to delete service");
      }
    });
  };

  // ================= HEADING =================
  const handleHeadingSave = async () => {

    if (
      !hasPermission("create") &&
      !hasPermission("update")
    ) {
      return handleNoPermission();
    }

    try {

      if (headingId) {
        await updateHeading(headingId, headingData);
      } else {
        const res = await createHeading(headingData);
        setHeadingId(res?.data?._id);
      }

      handleSuccess("Heading Saved");

      setShowHeadingModal(false);

      fetchData();

    } catch (err) {

      console.error(err);
      handleError("Failed to save heading");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  const cleanHtml = getData?.details?.replace(/&nbsp;/g, " ");



  return (
    <div className={styles.banner}>

      <div className={styles.bannerWrap}>

        <h3 className={styles.title}>
          Control As You Want
        </h3>

        <div className={styles.topActions}>

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
                title: "",
                details: ""
              });

              setPreview("");

              setImageFile(null);

              setOldImage("");
            }}
          >
            Create Service
          </button>

          <button
            className={`${styles.createBtn} ${(
              !hasPermission("create") &&
              !hasPermission("update")
            )
              ? styles.disabledBtn
              : ""
              }`}
            onClick={() => {

              if (
                !hasPermission("create") &&
                !hasPermission("update")
              ) {
                return handleNoPermission();
              }

              setShowHeadingModal(true);
            }}
          >
            Update Heading
          </button>

          <button
            className={`${styles.deleteSelected} ${!hasPermission("delete")
              ? styles.disabledBtn
              : ""
              }`}
            onClick={handleDeleteSelected}
          >
            <i className="bi bi-trash"></i>

            {selected.length > 0 &&
              ` (${selected.length}/${services.length})`}
          </button>

        </div>

      </div>

      <div className={styles.tableWrap}>

        <table className={styles.table}>

          <thead>

            <tr>

              <th>

                <input
                  type="checkbox"
                  checked={
                    services.length > 0 &&
                    selected.length === services.length
                  }
                  onChange={handleSelectAll}
                  className={`${!hasPermission("delete")
                    ? styles.disabledBtn
                    : ""
                    }`}
                />

                {" "}Select All

              </th>

              <th>Image</th>

              <th>Title</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {services.map((item) => (

              <tr key={item._id}>

                <td>

                  <input
                    type="checkbox"
                    checked={selected.includes(item._id)}
                    className={`${!hasPermission("delete")
                      ? styles.disabledBtn
                      : ""
                      }`}
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
                    width="60"
                  />
                </td>

                <td>{item.title}</td>

                <td className={styles.actions}>

                  <button
                    className={
                      !hasPermission("update")
                        ? styles.disabledBtn
                        : ""
                    }
                    onClick={() => {

                      if (!hasPermission("update")) {
                        return handleNoPermission();
                      }

                      setMode("update");

                      setShowForm(true);

                      setServiceId(item._id);

                      setFormValues({
                        title: item.title,
                        details: item.details
                      });

                      setPreview(item.image);

                      setOldImage(item.image);
                    }}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>

                  <button
                    className={
                      !hasPermission("read")
                        ? styles.disabledBtn
                        : ""
                    }
                    onClick={() => {

                      if (!hasPermission("read")) {
                        return handleNoPermission();
                      }

                      setGetData(item);

                      setShowGet(true);
                    }}
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
            ))}

          </tbody>

        </table>

      </div>

      {/* --- PAGINATION UI --- */}

      <div className={styles.pagination}>

        <button
          disabled={page === 1}
          onClick={() =>
            setPage(prev => prev - 1)
          }
          className={styles.arrowBtn}
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        {[...Array(totalPages)].map((_, index) => (

          <button
            key={index + 1}
            onClick={() => setPage(index + 1)}
            className={`${styles.numberBtn} ${page === index + 1
              ? styles.activePage
              : ""
              }`}
          >
            {index + 1}
          </button>

        ))}

        <button
          disabled={page >= totalPages}
          onClick={() =>
            setPage(prev => prev + 1)
          }
          className={styles.arrowBtn}
        >
          <i className="bi bi-chevron-right"></i>
        </button>

      </div>

      {/* --- MODALS --- */}

      {showForm && (

        <div className={styles.modal}>

          <div className={styles.modalContent}>

            <h4>
              {mode === "create"
                ? "Create Service"
                : "Edit Service"}
            </h4>

            <input
              type="text"
              placeholder="Title"
              value={formValues.title}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  title: e.target.value
                })
              }
            />

            <ReactQuill
              theme="snow"
              value={formValues.details}
              onChange={(val) =>
                setFormValues({
                  ...formValues,
                  details: val
                })
              }
              modules={modules}
            />

            <input
              type="file"
              onChange={handleImageChange}
            />

            {preview && (
              <img
                src={preview}
                alt=""
                width="100"
                style={{ marginTop: "10px" }}
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
                  tagline: e.target.value
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
                  heading: e.target.value
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
                className={`${(
                  !hasPermission("create") &&
                  !hasPermission("update")
                )
                  ? styles.disabledBtn
                  : ""
                  }`}
                onClick={handleHeadingSave}
              >
                Save Heading
              </button>

            </div>

          </div>

        </div>

      )}

      {showGet && getData && (

        <div className={styles.modal}>

          <div className={styles.modalContent}>

            <h4>View Service</h4>

            <table className={styles.viewTable}>

              <tbody>
                <tr><th>Image</th><td><img src={getData.image} alt="" width="100" /></td></tr>
                <tr><th>Title</th><td>{getData.title}</td></tr>
                <tr><th>Details</th>

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