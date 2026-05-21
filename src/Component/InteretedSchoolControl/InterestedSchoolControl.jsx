import React, { useState, useEffect } from "react";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import {
  getSchools,
  createSchool,
  updateSchool,
  deleteSchool,
  selectiveDeleteSchool,
  createFile,
  getSingle,
} from "../../apis/api";

import {
  handleSuccess,
  handleError,
} from "../../utils";

import styles from "./InterestedSchoolControl.module.scss";
import "../../Main.scss";

export default function InterestedSchoolsControl() {

  const queryClient = useQueryClient();

  const [selected, setSelected] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);

  const [mode, setMode] = useState("create");
  const [schoolId, setSchoolId] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [authorImageFile, setAuthorImageFile] = useState(null);

  const [preview, setPreview] = useState("");
  const [authorPreview, setAuthorPreview] = useState("");

  const [oldImage, setOldImage] = useState("");
  const [oldAuthorImg, setOldAuthorImg] = useState("");

  const [getData, setGetData] = useState(null);

  const [page, setPage] = useState(1);

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    coach: "",
    author: "",
  });

  const [viewData, setViewData] = useState(null);



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
  const permissionKey = "InterestedSchoolPermission";

  // ================= FETCH =================
  const { data = {}, isLoading } = useQuery({
    queryKey: ["schools", page],

    queryFn: async () => {

      const res = await getSchools(page, 6);

      // ================= PERMISSION (ABOUT STYLE FIX) =================
      try {
        const permissionRes = await getSingle({
          role: userData?.role,
          dynamicRole: userData?.dynamicRole,
          moduleName: "Interested Schools",
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

      return res;
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

  // ================= DATA =================
  const schools = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const allSelected =
    schools.length > 0 &&
    selected.length === schools.length;

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

    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(schools.map((x) => x._id));
    }
  };

  // ================= DELETE SELECTED =================
  const handleDeleteSelected = async () => {

    if (!hasPermission("delete")) {
      return handleNoPermission();
    }

    if (!selected.length) {
      return handleError("Select schools first");
    }

    if (!window.confirm("Delete selected schools?")) return;

    await selectiveDeleteSchool({
      ids: selected,
    });

    setSelected([]);

    queryClient.invalidateQueries(["schools", page]);

    handleSuccess("Deleted successfully");
  };

  // ================= IMAGE =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAuthorImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAuthorImageFile(file);
    setAuthorPreview(URL.createObjectURL(file));
  };

  // ================= CREATE / UPDATE =================
  const handleCreateOrUpdate = async () => {

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

    if (!formValues.title) {
      return handleError("Title is required");
    }

    let imageUrl = oldImage;
    let authorImgUrl = oldAuthorImg;

    try {

      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);

        const res = await createFile(fd);

        imageUrl =
          "http://localhost:8008" +
          res.data[0].path;
      }

      if (authorImageFile) {
        const fd = new FormData();
        fd.append("file", authorImageFile);

        const res = await createFile(fd);

        authorImgUrl =
          "http://localhost:8008" +
          res.data[0].path;
      }

      const payload = {
        ...formValues,
        image: imageUrl,
        authorImg: authorImgUrl,
      };

      if (mode === "create") {
        await createSchool(payload);
        handleSuccess("Created successfully");
      } else {
        await updateSchool(schoolId, payload);
        handleSuccess("Updated successfully");
      }

      setShowForm(false);
      queryClient.invalidateQueries(["schools", page]);

    } catch (err) {
      handleError(err.message);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {

    if (!hasPermission("delete")) {
      return handleNoPermission();
    }

    if (!window.confirm("Delete this school?")) return;

    await deleteSchool(id);

    queryClient.invalidateQueries(["schools", page]);

    handleSuccess("Deleted successfully");
  };

  // ================= EDIT =================
  const handleEdit = (item) => {

    if (!hasPermission("update")) {
      return handleNoPermission();
    }

    setMode("update");
    setShowForm(true);

    setSchoolId(item._id);

    setFormValues({
      title: item.title,
      description: item.description,
      coach: item.coach,
      author: item.author,
    });

    setPreview(item.image);
    setAuthorPreview(item.authorImg);

    setOldImage(item.image);
    setOldAuthorImg(item.authorImg);
  };

  // ================= VIEW =================
  const handleView = (item) => {

    if (!hasPermission("read")) {
      return handleNoPermission();
    }

    setViewData(item);
    setShowView(true);
  };

  if (isLoading) return <p>Loading...</p>;

  const cleanHtml =
    viewData?.headingData?.description?.replace(/&nbsp;/g, " ");

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

                            if (
                                !hasPermission("create")
                            ) {
                                return handleNoPermission();
                            }

                            setMode("create");

                            setShowForm(true);

                            setFormValues({
                                title: "",
                                description: "",
                                coach: "",
                                author: "",
                            });

                            setPreview("");

                            setAuthorPreview("");

                            setImageFile(null);

                            setAuthorImageFile(
                                null
                            );

                            setOldImage("");

                            setOldAuthorImg("");

                            setSchoolId(null);
                        }}
                    >
                        Create School
                    </button>

                    {/* DELETE SELECTED */}
                    <button
                        className={`${styles.deleteSelected} ${!hasPermission("delete")
                            ? styles.disabledBtn
                            : ""
                            }`}
                        onClick={
                            handleDeleteSelected
                        }
                    >
                        <i className="bi bi-trash"></i>

                        {selected.length === 0
                            ? ""
                            : allSelected
                                ? " ALL"
                                : ` (${selected.length}/${schools.length})`}
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
                                    className={`${styles.checkbox} ${!hasPermission(
                                        "delete"
                                    )
                                        ? styles.disabledBtn
                                        : ""
                                        }`}
                                    checked={
                                        allSelected
                                    }
                                    onChange={
                                        handleSelectAll
                                    }
                                />

                                {" "}Select All

                            </th>

                            <th>Image</th>

                            <th>Title</th>

                            <th>Author</th>

                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {schools.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={5}
                                    style={{
                                        textAlign:
                                            "center",
                                        padding: "20px",
                                    }}
                                >
                                    No schools found
                                </td>

                            </tr>

                        ) : (

                            schools.map((item) => (

                                <tr key={item._id}>

                                    <td>

                                        <input
                                            type="checkbox"
                                            className={`${styles.checkbox} ${!hasPermission(
                                                "delete"
                                            )
                                                ? styles.disabledBtn
                                                : ""
                                                }`}
                                            checked={selected.includes(
                                                item._id
                                            )}
                                            onChange={() => {

                                                if (
                                                    !hasPermission(
                                                        "delete"
                                                    )
                                                ) {
                                                    return handleNoPermission();
                                                }

                                                handleSelect(
                                                    item._id
                                                );
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

                                    <td>
                                        {item.title}
                                    </td>

                                    <td>
                                        {item.author}
                                    </td>

                                    <td
                                        className={
                                            styles.actions
                                        }
                                    >

                                        {/* EDIT */}
                                        <button
                                            className={
                                                !hasPermission(
                                                    "update"
                                                )
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
                                                !hasPermission(
                                                    "read"
                                                )
                                                    ? styles.disabledBtn
                                                    : ""
                                            }
                                            onClick={() =>
                                                handleView(item)
                                            }
                                        >
                                            <i className="bi bi-eye"></i>
                                        </button>

                                        {/* DELETE */}
                                        <button
                                            className={
                                                !hasPermission(
                                                    "delete"
                                                )
                                                    ? styles.disabledBtn
                                                    : ""
                                            }
                                            onClick={() =>
                                                handleDelete(
                                                    item._id
                                                )
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

            {/* PAGINATION */}
            <nav className="mt-4">

                <ul
                    className={`pagination justify-content-center ${styles.customPagination}`}
                >

                    {/* LEFT */}
                    <li
                        className={`page-item ${page === 1
                            ? "disabled"
                            : ""
                            }`}
                    >
                        <button
                            className="page-link arrow"
                            onClick={() =>
                                setPage(page - 1)
                            }
                            disabled={page === 1}
                        >
                            &lt;
                        </button>
                    </li>

                    {/* PAGE NUMBER */}
                    {Array.from(
                        {
                            length: totalPages,
                        },
                        (_, i) => i + 1
                    ).map((num) => (

                        <li
                            key={num}
                            className={`page-item ${page === num
                                ? "active"
                                : ""
                                }`}
                        >
                            <button
                                className={`page-link ${page === num
                                    ? "num"
                                    : ""
                                    }`}
                                onClick={() =>
                                    setPage(num)
                                }
                            >
                                {num}
                            </button>
                        </li>

                    ))}

                    {/* RIGHT */}
                    <li
                        className={`page-item ${page === totalPages
                            ? "disabled"
                            : ""
                            }`}
                    >
                        <button
                            className="page-link arrow"
                            onClick={() =>
                                setPage(page + 1)
                            }
                            disabled={
                                page === totalPages
                            }
                        >
                            &gt;
                        </button>
                    </li>

                </ul>

            </nav>

            {/* FORM MODAL */}
            {showForm && (

                <div className={styles.modal}>

                    <div className={styles.modalContent}>

                        <h4>
                            {mode === "create"
                                ? "Create School"
                                : "Edit School"}
                        </h4>

                        <input
                            type="text"
                            placeholder="Title"
                            value={
                                formValues.title
                            }
                            onChange={(e) =>
                                setFormValues({
                                    ...formValues,
                                    title:
                                        e.target.value,
                                })
                            }
                        />

                        <div
                            style={{
                                marginBottom:
                                    "10px",
                            }}
                        >

                            <label>
                                Description:
                            </label>

                            <ReactQuill
                                theme="snow"
                                value={
                                    formValues.description
                                }
                                onChange={(v) =>
                                    setFormValues({
                                        ...formValues,
                                        description: v,
                                    })
                                }
                                modules={modules}
                            />

                        </div>

                        <input
                            type="text"
                            placeholder="Coach"
                            value={
                                formValues.coach
                            }
                            onChange={(e) =>
                                setFormValues({
                                    ...formValues,
                                    coach:
                                        e.target.value,
                                })
                            }
                        />

                        <input
                            type="text"
                            placeholder="Author"
                            value={
                                formValues.author
                            }
                            onChange={(e) =>
                                setFormValues({
                                    ...formValues,
                                    author:
                                        e.target.value,
                                })
                            }
                        />

                        <div
                            className={
                                styles.fileContent
                            }
                        >

                            <input
                                type="file"
                                onChange={
                                    handleImageChange
                                }
                            />

                            {preview && (
                                <img
                                    src={preview}
                                    width="100"
                                />
                            )}

                            <input
                                type="file"
                                onChange={
                                    handleAuthorImageChange
                                }
                            />

                            {authorPreview && (
                                <img
                                    src={
                                        authorPreview
                                    }
                                    width="80"
                                />
                            )}

                        </div>

                        <div
                            className={
                                styles.modalActions
                            }
                        >

                            <button
                                onClick={() =>
                                    setShowForm(
                                        false
                                    )
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className={`${(
                                    mode ===
                                    "create" &&
                                    !hasPermission(
                                        "create"
                                    )
                                ) ||
                                    (
                                        mode ===
                                        "update" &&
                                        !hasPermission(
                                            "update"
                                        )
                                    )
                                    ? styles.disabledBtn
                                    : ""
                                    }`}
                                onClick={
                                    handleCreateOrUpdate
                                }
                            >
                                {mode === "create"
                                    ? "Create"
                                    : "Update"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {/* VIEW MODAL */}
            {showView && viewData && (

                <div className={styles.modal}>

                    <div className={styles.modalContent}>

                        <h4>View School</h4>

                        <table
                            className={
                                styles.viewTable
                            }
                        >

                            <tbody>

                                <tr>

                                    <th>Image</th>

                                    <td>

                                        <img
                                            src={
                                                viewData.image
                                            }
                                            alt=""
                                            width="120"
                                        />

                                    </td>

                                </tr>

                                <tr>

                                    <th>Title</th>

                                    <td>
                                        {viewData.title}
                                    </td>

                                </tr>

                                <tr>

                                    <th>
                                        Description
                                    </th>

                                    <td
                                        dangerouslySetInnerHTML={{
                                            __html: viewData?.description || "",
                                        }}
                                    ></td>

                                </tr>

                            </tbody>

                        </table>

                        <button
                            className={
                                styles.closeBtn
                            }
                            onClick={() =>
                                setShowView(false)
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