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
} from "../../apis/api";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { handleSuccess, handleError } from "../../utils";

// Ekhane visibleCount default 1000 kora hoyeche jate sob data show hoy
export default function FAQsControl({ isFullPage = false, visibleCount = 1000 }) {
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
  const currentPage = isFullPage ? page : 1;
  const limit = visibleCount; // Akhon limit 1000 ba apnar deya prop onujayi hobe

  /* ================= FETCH FAQ ================= */
  const { data: response = {} } = useQuery({
    queryKey: ["faqs", currentPage, limit], // limit queryKey-te add kora hoyeche update track korar jonno
    queryFn: async () => {
      const res = await getFaqs(currentPage, limit);
      return res || {};
    },
  });

  const data = response.data || [];
  const totalPages = response.totalPages || 1;

  /* ================= 🔥 FIXED HEADING LOGIC ================= */
  useEffect(() => {
    if (data.length > 0) {
      const validHeading = data.find((item) => item.headingData);

      if (validHeading?.headingData) {
        setHeadingId(validHeading.headingData._id);
        setHeadingData({
          tagline: validHeading.headingData.tagline || "",
          heading: validHeading.headingData.heading || "",
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
    queryClient.invalidateQueries({ queryKey: ["faqs"] });
  };

  /* ================= ACTIONS ================= */
  const handleToggle = async (id) => {
    await toggleActiveFaq(id);
    refresh();
  };

  const handleSubmit = async () => {
    try {
      if (!formValues.question || !formValues.answer.trim()) {
        return handleError("Question and Answer required");
      }

      if (mode === "create") {
        await createFaq(formValues);
        handleSuccess("FAQ Created");
      } else {
        await updateFaq(faqId, formValues);
        handleSuccess("FAQ Updated");
      }

      closeModal();
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete FAQ?")) return;
    await deleteFaq(id);
    refresh();
  };

  const handleBulkDelete = async () => {
    if (!selected.length) return handleError("Select FAQs first");
    if (!window.confirm("Delete selected FAQs?")) return;

    for (let id of selected) {
      await deleteFaq(id);
    }

    setSelected([]);
    refresh();
  };

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    setSelected(e.target.checked ? data.map((i) => i._id) : []);
  };

  const handleEdit = (item) => {
    setMode("update");
    setFaqId(item._id);
    setFormValues({ question: item.question, answer: item.answer });
    setShowForm(true);
  };

  const handleGet = (item) => {
    setGetData(item);
    setShowGet(true);
  };

  const closeModal = () => {
    setShowForm(false);
    setShowGet(false);
    setFormValues({ question: "", answer: "" });
    setFaqId(null);
  };

  /* ================= 🔥 FIXED HEADING SAVE ================= */
  const handleHeadingSave = async () => {
    try {
      if (headingId) {
        await updateHeading(headingId, headingData);
        handleSuccess("Heading Updated");
      } else {
        const res = await createHeading(headingData);
        setHeadingId(res?.data?._id);
        handleSuccess("Heading Created");
      }

      setShowHeadingModal(false);
      refresh();
    } catch (err) {
      handleError("Failed to save heading");
    }
  };

  /* ================= OPEN HEADING MODAL FIX ================= */
  const openHeadingModal = () => {
    const validHeading = data.find((item) => item.headingData);

    if (validHeading?.headingData) {
      setHeadingId(validHeading.headingData._id);
      setHeadingData({
        tagline: validHeading.headingData.tagline || "",
        heading: validHeading.headingData.heading || "",
      });
    }

    setShowHeadingModal(true);
  };

  /* ================= UI ================= */
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
            }}
          >
            Create FAQ
          </button>

          {!isFullPage && (
            <button className={styles.createBtn} onClick={openHeadingModal}>
              Update Heading
            </button>
          )}

          <button className={styles.deleteSelected} onClick={handleBulkDelete}>
            <i className="bi bi-trash"></i>
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
                   type="checkbox" 
                   onChange={handleSelectAll} 
                   checked={data.length > 0 && selected.length === data.length}
                /> Select All
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
                    checked={selected.includes(item._id)}
                    onChange={() => handleSelect(item._id)}
                  />
                </td>

                <td>{item.question}</td>

                <td
                  dangerouslySetInnerHTML={{
                    __html: item.answer.substring(0, 80) + (item.answer.length > 80 ? "..." : ""),
                  }}
                />

                <td>
                  <i
                    className={
                      item.isActive ? "bi bi-toggle-on" : "bi bi-toggle-off"
                    }
                    style={{
                      fontSize: "26px",
                      cursor: "pointer",
                      color: item.isActive ? "#ED1C24" : "#aaa",
                    }}
                    onClick={() => handleToggle(item._id)}
                  />
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
            <h4>{mode === "create" ? "Create FAQ" : "Update FAQ"}</h4>

            <input
              placeholder="Question"
              value={formValues.question}
              onChange={(e) =>
                setFormValues({ ...formValues, question: e.target.value })
              }
            />

            <ReactQuill
              theme="snow"
              value={formValues.answer}
              onChange={(value) =>
                setFormValues({ ...formValues, answer: value })
              }
              modules={modules}
            />

            <div className={styles.modalActions}>
              <button onClick={closeModal}>Cancel</button>
              <button onClick={handleSubmit}>Submit</button>
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
                  <td>{getData.question}</td>
                </tr>
                <tr>
                  <th>Answer</th>
                  <td dangerouslySetInnerHTML={{ __html: getData.answer }} />
                </tr>
              </tbody>
            </table>
            <button onClick={() => setShowGet(false)}>Close</button>
          </div>
        </div>
      )}

      {/* HEADING MODAL */}
      {!isFullPage && showHeadingModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h4 style={{ color: "#ED1C24", textAlign: "center" }}>
              Update Heading
            </h4>

            <input
              placeholder="Tagline"
              value={headingData.tagline}
              onChange={(e) =>
                setHeadingData({ ...headingData, tagline: e.target.value })
              }
            />

            <input
              placeholder="Heading"
              value={headingData.heading}
              onChange={(e) =>
                setHeadingData({ ...headingData, heading: e.target.value })
              }
            />

            <div className={styles.modalActions}>
              <button onClick={() => setShowHeadingModal(false)}>
                Cancel
              </button>
              <button onClick={handleHeadingSave}>
                Save Heading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}