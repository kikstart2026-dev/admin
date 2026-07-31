import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import styles from "./HomeBannerControl.module.scss";

import {
  getAllHomeBanner,
  updateHomeBanner,
  updateHeading,
  createHeading,
  createFile,
  createHomeBanner,
  singleDeleteHomeBanner,
  selectiveDeleteHomeBanner,
  toggleActiveBanner,
  getSingle,
} from "../../apis/api";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import "../../Main.scss";

import {
  handleConfirm,
  handleError,
  handleSuccess,
} from "../../utils";

export default function HomeBannerControl() {
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showGet, setShowGet] = useState(false);

  const [mode, setMode] = useState("create");

  const [bannerId, setBannerId] = useState(null);
  const [headingId, setHeadingId] = useState(null);

  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [getData, setGetData] = useState(null);

  const [formValues, setFormValues] = useState({
    tagline: "",
    heading: "",
    description: "",
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

  // ================= USER =================
  const userData = JSON.parse(
    localStorage.getItem("adminUser") || "{}"
  );

  const permissionKey = "HomeBannerPermission";

  // ================= GET ALL + PERMISSION =================
  const { data = [], isLoading } = useQuery({
    queryKey: ["homeBanners"],

    queryFn: async () => {
      const bannerRes = await getAllHomeBanner();

      // 🔥 SINGLE API ONLY
      try {
        const res = await getSingle({
          role: userData?.role,
          dynamicRole: userData?.dynamicRole,
          moduleName: "Home Banner Control",
        });

        localStorage.setItem(
          permissionKey,
          JSON.stringify(res?.data || {})
        );
      } catch (err) {
        console.error(err);

        localStorage.setItem(
          permissionKey,
          JSON.stringify({})
        );
      }

      return bannerRes?.data?.data || bannerRes?.data || [];
    },

    enabled: !!userData,
  });

  // ================= PERMISSION =================
  const permissions = JSON.parse(
    localStorage.getItem(permissionKey) || "{}"
  );

  const hasPermission = (type) => {
    return permissions?.[type] === true;
  };

  const handleNoPermission = () => {
    handleError("Permission not granted");
  };

  const fetchBanner = () => {
    queryClient.invalidateQueries(["homeBanners"]);
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

    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(data.map((x) => x._id));
    }
  };

  // ================= DELETE SELECTED =================
  const handleDeleteSelected = async () => {
    if (!hasPermission("delete")) return handleNoPermission();

    if (selected.length === 0) {
      handleError("Select banners first");
      return;
    }

    if (!window.confirm("Delete Selected Banners?")) return;

    try {
      await selectiveDeleteHomeBanner({
        ids: selected,
      });

      setSelected([]);
      fetchBanner();
      handleSuccess("Deleted successfully");
    } catch (err) {
      handleError("Failed to delete");
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

      const bannerRes = await createHomeBanner({
        headingId: newHeadingId,
        image: "https://backend-8e6g.onrender.com" + imageUrl,
      });

      const newBannerId = bannerRes?.data?._id;

      if (newBannerId) {
        await toggleActiveBanner(newBannerId);
      }

      handleSuccess("Created Successfully");
      setShowForm(false);
      setImageFile(null);
      fetchBanner();
    } catch (err) {
      handleError("Create failed");
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

      await updateHomeBanner(bannerId, {
        headingId,
        image: imageUrl,
      });

      handleSuccess("Updated Successfully");
      setShowForm(false);
      setImageFile(null);
      fetchBanner();
    } catch (err) {
      handleError("Update failed");
    }
  };

  // ================= DELETE =================
  const handleDelete = (id) => {
    if (!hasPermission("delete")) return handleNoPermission();

    handleConfirm("Delete Banner?", async () => {
      try {
        await singleDeleteHomeBanner(id);
        fetchBanner();
        handleSuccess("Deleted");
      } catch {
        handleError("Failed delete");
      }
    });
  };

  // ================= EDIT =================
  const handleEdit = (item) => {
    if (!hasPermission("update")) return handleNoPermission();

    setMode("update");
    setShowForm(true);

    setBannerId(item._id);
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

  // ================= TOGGLE =================
  const toggleActive = async (id) => {
    if (!hasPermission("update")) return handleNoPermission();

    try {
      await toggleActiveBanner(id);
      fetchBanner();
    } catch {
      handleError("Failed toggle");
    }
  };

  if (isLoading) return <p>Loading...</p>;



const cleanHtml = getData?.headingData?.description
  ?.replace(/&nbsp;/g, " ");

  return (
    <div className={styles.banner}>

      <div className={styles.bannerWrap}>

        <h3 className={styles.title}>
          Control As You Want
        </h3>

        <div className={styles.topActions}>

          {/* CREATE */}
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
                tagline: "",
                heading: "",
                description: "",
              });

              setPreview("");

              setImageFile(null);
            }}
          >
            Create Banner
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
                : ` (${selected.length}/${data.length})`}
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
                  No Banner Found
                </td>

              </tr>

            ) : (

              data.map((item) => (

                <tr key={item._id}>

                  <td>

                    <input
                      className={`${styles.checkbox} ${!hasPermission("delete")
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

                  {/* TOGGLE */}
                  <td>

                    <i
                      className={`${item.isActive
                        ? "bi bi-toggle-on"
                        : "bi bi-toggle-off"
                        } ${!hasPermission("update")
                          ? styles.disabledBtn
                          : ""
                        }`}
                      style={{
                        fontSize: "26px",
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

      {/* MODAL */}
      {showForm && (

        <div className={styles.modal}>

          <div className={styles.modalContent}>

            <h4>
              {mode === "create"
                ? "Create Banner"
                : "Edit Banner"}
            </h4>

            <input
              type="text"
              placeholder="Tagline"
              name="tagline"
              value={formValues.tagline}
              onChange={handleChange}
            />

            <input
              type="text"
              placeholder="Heading"
              name="heading"
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
                alt="preview"
                className={styles.preview}
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

      {/* GET MODAL */}
      {showGet && getData && (

        <div className={styles.modal}>

          <div className={styles.modalContent}>

            <h4>Banner Details</h4>

            <table>

              <tbody>

                <tr>
                  <th>Tagline</th>
                  <td>
                    {getData.headingData.tagline}
                  </td>
                </tr>

                <tr>
                  <th>Heading</th>
                  <td>
                    {getData.headingData.heading}
                  </td>
                </tr>

                <tr>
                  <th>Description</th>

                  <td
                    dangerouslySetInnerHTML={{
                      __html:
                        cleanHtml ||
                        getData?.headingData?.description ||
                        "",
                    }}
                  ></td>
                </tr>

                <tr>
                  <th>Image</th>

                  <td>
                    <img
                      src={getData.image}
                      alt=""
                    />
                  </td>
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