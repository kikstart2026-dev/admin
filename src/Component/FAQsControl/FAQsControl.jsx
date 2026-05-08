import React, { useState, useEffect } from "react";
import styles from "./FAQsControl.module.scss";

import {
  getFaqs,
  deleteFaq,
  updateFaq,
  createFaq,
  createHeading,
  updateHeading,
  toggleActiveFaq,
  getSingle,
} from "../../apis/api";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import "../../Main.scss";

import {
  handleSuccess,
  handleError,
} from "../../utils";

// Ekhane visibleCount default 1000 kora hoyeche jate sob data show hoy
export default function FAQsControl({
  isFullPage = false,
  visibleCount = 1000,
}) {

  const queryClient = useQueryClient();

  const [selected, setSelected] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [showGet, setShowGet] = useState(false);

  const [mode, setMode] = useState("create");

  const [faqId, setFaqId] = useState(null);

  const [getData, setGetData] = useState(null);

  const [formValues, setFormValues] = useState({
    question: "",
    answer: "",
  });

  /* ================= HEADING STATES ================= */
  const [headingId, setHeadingId] = useState(null);

  const [headingData, setHeadingData] = useState({
    tagline: "",
    heading: "",
  });

  const [showHeadingModal, setShowHeadingModal] = useState(false);

  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(1);

  const currentPage = isFullPage
    ? page
    : 1;

  const limit = visibleCount;

  // ================= USER =================
  const userData = JSON.parse(
    localStorage.getItem("adminUser") || "{}"
  );

  // ================= PERMISSION STORAGE KEY =================
  const permissionKey = "FAQsPermission";

  /* ================= FETCH FAQ ================= */
  const { data: response = {} } = useQuery({
    queryKey: ["faqs", currentPage, limit],

    queryFn: async () => {

      const res = await getFaqs(
        currentPage,
        limit
      );

      // ================= GET SINGLE PERMISSION =================
      if (userData?.dynamicRole) {

        try {

          const permissionRes =
            await getSingle({
              dynamicRole:
                userData?.dynamicRole,
              moduleName: "FAQ Control",
            });

          localStorage.setItem(
            permissionKey,
            JSON.stringify(
              permissionRes?.data || {}
            )
          );

        } catch (error) {

          console.error(
            "Permission Error:",
            error
          );

          localStorage.setItem(
            permissionKey,
            JSON.stringify({})
          );
        }
      }

      return res || {};
    },

    enabled: !!userData,
  });

  // ================= GET PERMISSION =================
  const permissions = JSON.parse(
    localStorage.getItem(permissionKey) || "{}"
  );

  // ================= NO PERMISSION =================
  const handleNoPermission = () => {
    handleError("Permission not granted");
  };

  // ================= CHECK PERMISSION =================
  const hasPermission = (type) => {
    return permissions?.[type] === true;
  };

  const data = response.data || [];

  const totalPages =
    response.totalPages || 1;

  /* ================= 🔥 FIXED HEADING LOGIC ================= */
  useEffect(() => {

    if (data.length > 0) {

      const validHeading = data.find(
        (item) => item.headingData
      );

      if (validHeading?.headingData) {

        setHeadingId(
          validHeading.headingData._id
        );

        setHeadingData({
          tagline:
            validHeading.headingData
              .tagline || "",
          heading:
            validHeading.headingData
              .heading || "",
        });
      }
    }

  }, [data]);

  /* ================= QUILL ================= */
  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  /* ================= REFRESH ================= */
  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: ["faqs"],
    });
  };

  const allSelected =
    selected.length === data.length &&
    data.length > 0;

  /* ================= TOGGLE ================= */
  const handleToggle = async (id) => {

    if (!hasPermission("update")) {
      return handleNoPermission();
    }

    await toggleActiveFaq(id);

    refresh();
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {

    try {

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

      if (
        !formValues.question ||
        !formValues.answer.trim()
      ) {
        return handleError(
          "Question and Answer required"
        );
      }

      if (mode === "create") {

        await createFaq(formValues);

        handleSuccess("FAQ Created");

      } else {

        await updateFaq(
          faqId,
          formValues
        );

        handleSuccess("FAQ Updated");
      }

      closeModal();

      refresh();

    } catch (err) {

      console.error(err);

    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {

    if (!hasPermission("delete")) {
      return handleNoPermission();
    }

    if (!window.confirm("Delete FAQ?")) return;

    await deleteFaq(id);

    refresh();
  };

  /* ================= BULK DELETE ================= */
  const handleBulkDelete = async () => {

    if (!hasPermission("delete")) {
      return handleNoPermission();
    }

    if (!selected.length) {
      return handleError(
        "Select FAQs first"
      );
    }

    if (
      !window.confirm(
        "Delete selected FAQs?"
      )
    ) return;

    for (let id of selected) {

      await deleteFaq(id);

    }

    setSelected([]);

    refresh();
  };

  /* ================= SELECT ================= */
  const handleSelect = (id) => {

    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  /* ================= SELECT ALL ================= */
  const handleSelectAll = (e) => {

    if (!hasPermission("delete")) {
      return handleNoPermission();
    }

    setSelected(
      e.target.checked
        ? data.map((i) => i._id)
        : []
    );
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {

    if (!hasPermission("update")) {
      return handleNoPermission();
    }

    setMode("update");

    setFaqId(item._id);

    setFormValues({
      question: item.question,
      answer: item.answer,
    });

    setShowForm(true);
  };

  /* ================= GET ================= */
  const handleGet = (item) => {

    if (!hasPermission("read")) {
      return handleNoPermission();
    }

    setGetData(item);

    setShowGet(true);
  };

  /* ================= CLOSE ================= */
  const closeModal = () => {

    setShowForm(false);

    setShowGet(false);

    setFormValues({
      question: "",
      answer: "",
    });

    setFaqId(null);
  };

  /* ================= HEADING SAVE ================= */
  const handleHeadingSave = async () => {

    if (!hasPermission("update")) {
      return handleNoPermission();
    }

    try {

      if (
        !headingData.tagline ||
        !headingData.heading
      ) {

        return handleError(
          "All fields required"
        );
      }

      if (headingId) {

        await updateHeading(
          headingId,
          headingData
        );

      } else {

        const res =
          await createHeading(
            headingData
          );

        setHeadingId(res?._id);
      }

      handleSuccess("Done");

      setShowHeadingModal(false);

      refresh();

    } catch (err) {

      console.error("ERROR:", err);

      handleError(
        "Failed to save heading"
      );
    }
  };

  /* ================= OPEN HEADING MODAL ================= */
  const openHeadingModal = () => {

    if (!hasPermission("update")) {
      return handleNoPermission();
    }

    const validHeading = data.find(
      (item) => item.headingData
    );

    if (validHeading?.headingData) {

      setHeadingId(
        validHeading.headingData._id
      );

      setHeadingData({
        tagline:
          validHeading.headingData
            .tagline || "",
        heading:
          validHeading.headingData
            .heading || "",
      });
    }

    setShowHeadingModal(true);
  };



  /* ================= UI ================= */
  return (
    <div className={styles.banner}>

      <div className={styles.bannerWrap}>

        <h3 className={styles.title}>
          Control As You Want
        </h3>

        <div className={styles.topActions}>

          {/* CREATE FAQ */}
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
            }}
          >
            Create FAQ
          </button>

          {/* UPDATE HEADING */}
          {!isFullPage && (

            <button
              className={`${styles.createBtn} ${!hasPermission("update")
                ? styles.disabledBtn
                : ""
                }`}
              onClick={openHeadingModal}
            >
              Update Heading
            </button>

          )}

          {/* DELETE SELECTED */}
          <button
            className={`${styles.deleteSelected} ${!hasPermission("delete")
              ? styles.disabledBtn
              : ""
              }`}
            onClick={handleBulkDelete}
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

      {/* TABLE */}
      <div className={styles.tableWrap}>

        <table className={styles.table}>

          <thead>

            <tr>

              <th>

                <input
                  className={`${!hasPermission("delete")
                    ? styles.disabledBtn
                    : ""
                    }`}
                  type="checkbox"
                  onChange={
                    handleSelectAll
                  }
                  checked={
                    data.length > 0 &&
                    selected.length ===
                    data.length
                  }
                />

                {" "}Select All

              </th>

              <th>Question</th>

              <th>Answer</th>

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
                    checked={selected.includes(
                      item._id
                    )}
                    className={`${!hasPermission("delete")
                      ? styles.disabledBtn
                      : ""
                      }`}
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

                <td>{item.question}</td>

                <td
                  dangerouslySetInnerHTML={{
                    __html:
                      item?.answer
                        ?.replace(/&nbsp;/g, " ")
                        ?.substring(0, 80) +
                      (item?.answer?.replace(/&nbsp;/g, " ")?.length > 80
                        ? "..."
                        : ""),
                  }}
                ></td>

                {/* TOGGLE */}
                <td>

                  <i
                    className={`${item.isActive
                      ? "bi bi-toggle-on"
                      : "bi bi-toggle-off"
                      } ${!hasPermission(
                        "update"
                      )
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

                      if (
                        !hasPermission(
                          "update"
                        )
                      ) {
                        return handleNoPermission();
                      }

                      handleToggle(
                        item._id
                      );
                    }}
                  ></i>

                </td>

                {/* ACTIONS */}
                <td className={styles.actions}>

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
                      handleGet(item)
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

            ))}

          </tbody>

        </table>

      </div>

      {/* FORM MODAL */}
      {showForm && (

        <div className={styles.modal}>

          <div className={styles.modalContent}>

            <h4>
              {mode === "create"
                ? "Create FAQ"
                : "Update FAQ"}
            </h4>

            <input
              placeholder="Question"
              value={
                formValues.question
              }
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  question:
                    e.target.value,
                })
              }
            />

            <ReactQuill
              theme="snow"
              value={formValues.answer}
              onChange={(value) =>
                setFormValues({
                  ...formValues,
                  answer: value,
                })
              }
              modules={modules}
            />

            <div className={styles.modalActions}>

              <button
                onClick={closeModal}
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
                onClick={handleSubmit}
              >
                Submit
              </button>

            </div>

          </div>

        </div>
      )}

      {/* VIEW MODAL */}
      {showGet && getData && (

        <div className={styles.modal}>

          <div className={styles.modalContent}>

            <h4>FAQ Details</h4>

            <table>

              <tbody>

                <tr>

                  <th>Question</th>

                  <td>
                    {getData.question}
                  </td>

                </tr>

                <tr>

                  <th>Answer</th>

                <td
  dangerouslySetInnerHTML={{
    __html:
      getData?.answer?.replace(/&nbsp;/g, " ") || "",
  }}
></td>

                </tr>

              </tbody>

            </table>

            <button
              onClick={() =>
                setShowGet(false)
              }
            >
              Close
            </button>

          </div>

        </div>
      )}

      {/* HEADING MODAL */}
      {!isFullPage &&
        showHeadingModal && (

          <div className={styles.modal}>

            <div className={styles.modalContent}>

              <h4
                style={{
                  color: "#ED1C24",
                  textAlign: "center",
                }}
              >
                Update Heading
              </h4>

              <input
                placeholder="Tagline"
                value={
                  headingData.tagline
                }
                onChange={(e) =>
                  setHeadingData({
                    ...headingData,
                    tagline:
                      e.target.value,
                  })
                }
              />

              <input
                placeholder="Heading"
                value={
                  headingData.heading
                }
                onChange={(e) =>
                  setHeadingData({
                    ...headingData,
                    heading:
                      e.target.value,
                  })
                }
              />

              <div className={styles.modalActions}>

                <button
                  onClick={() =>
                    setShowHeadingModal(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  className={`${!hasPermission(
                    "update"
                  )
                    ? styles.disabledBtn
                    : ""
                    }`}
                  onClick={
                    handleHeadingSave
                  }
                >
                  Save Heading
                </button>

              </div>

            </div>

          </div>
        )}

    </div>
  );
}