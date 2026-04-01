import React, { useState } from "react";
import styles from "./FAQsControl.module.scss";
import {
  getFaqs,
  deleteFaq,
  updateFaq,
  createFaq,
  toggleActiveFaq,
  createHeading,
  updateHeading
} from "../../apis/api";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { handleSuccess, handleError } from "../../utils";

// ✅ Added isFullPage prop to control the view
export default function FAQsControl({ isFullPage = false }) {
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showGet, setShowGet] = useState(false);
  const [showHeadingModal, setShowHeadingModal] = useState(false);

  const [mode, setMode] = useState("create");
  const [faqId, setFaqId] = useState(null);
  const [headingId, setHeadingId] = useState(null);
  const [getData, setGetData] = useState(null);

  const [formValues, setFormValues] = useState({
    question: "",
    answer: "",
  });

  const [headingData, setHeadingData] = useState({
    tagline: "",
    heading: "",
    description: ""
  });

  // ================= PAGINATION & LIMIT LOGIC =================
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(() => {
    if (isFullPage) return 1000; 
    return Number(localStorage.getItem("faqLimit")) || 5;
  });

  // ================= FETCH =================
  const { data: response = {} } = useQuery({
    queryKey: ["faqs", page, limit, isFullPage],
    queryFn: async () => {
      const res = await getFaqs(page, limit);
      return res || {};
    },
  });

  const data = response.data || [];
  const totalPages = response.totalPages || 1;

  // ✅ Quill Modules Setup
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

  // ================= HEADING FETCH =================
  useQuery({
    queryKey: ["faqHeading"],
    enabled: data.length > 0 && !headingId,
    queryFn: async () => {
      const first = data[0];
      if (first?.headingData) {
        setHeadingId(first.headingData._id);
        setHeadingData({
          tagline: first.headingData.tagline || "",
          heading: first.headingData.heading || "",
          description: first.headingData.description || ""
        });
      }
      return null;
    },
  });

  const refresh = () => queryClient.invalidateQueries(["faqs"]);

  const handleToggle = async (id) => {
    await toggleActiveFaq(id);
    refresh();
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!headingId) {
        handleError("Create heading first");
        return;
      }

      if (!formValues.question || !formValues.answer || formValues.answer.trim() === "") {
        handleError("Quetion and Answer both are required");
        return;
      }

      if (mode === "create") {
        await createFaq({ ...formValues, headingId });
        handleSuccess("FAQ Created");
      } else {
        await updateFaq(faqId, { ...formValues, headingId });
        handleSuccess("FAQ Updated");
      }

      closeModal();
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= HEADING =================
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
    if (selected.length === 0) {
      handleError("Select FAQs first");
      return;
    }
    if (!window.confirm("Delete selected FAQs?")) return;

    try {
      for (let i = 0; i < selected.length; i++) {
        await deleteFaq(selected[i]);
      }
      setSelected([]);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const allSelected = selected.length === data.length && data.length > 0;

  const handleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    setSelected(e.target.checked ? data.map(i => i._id) : []);
  };

  const handleEdit = (item) => {
    setMode("update");
    setFaqId(item._id);
    setFormValues({
      question: item.question,
      answer: item.answer
    });
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

  return (
    <div className={styles.banner}>

      {/* HEADER */}
      <div className={styles.bannerWrap}>
        <h3 className={styles.title}>Control As You Want</h3>
        <div className={styles.topActions}>
          <button
            className={styles.createBtn}
            onClick={() => { setMode("create"); setShowForm(true); }}
          >
            Create FAQ
          </button>

          <button
            className={styles.createBtn}
            onClick={() => setShowHeadingModal(true)}
          >
            {headingId ? "Update Heading" : "Create Heading"}
          </button>

          <button
            className={styles.deleteSelected}
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
              <th><input type="checkbox" checked={allSelected} onChange={handleSelectAll} /> Select All</th>
              <th>Question</th>
              <th>Answer</th>
              <th>Active</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan="5">No FAQs Found</td></tr>
            ) : (
              data.map(item => (
                <tr key={item._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(item._id)}
                      onChange={() => handleSelect(item._id)}
                    />
                  </td>
                  <td>{item.question}</td>
                  <td dangerouslySetInnerHTML={{ __html: item.answer.substring(0, 80) }}></td>
                  <td>
                    <i
                      className={item.isActive ? "bi bi-toggle-on" : "bi bi-toggle-off"}
                      style={{ fontSize: "26px", cursor: "pointer", color: item.isActive ? "#ED1C24" : "#aaa" }}
                      onClick={() => handleToggle(item._id)}
                    ></i>
                  </td>
                  <td className={styles.actions}>
                    <button onClick={() => handleEdit(item)}><i className="bi bi-pencil-square"></i></button>
                    <button onClick={() => handleGet(item)}><i className="bi bi-eye"></i></button>
                    <button onClick={() => handleDelete(item._id)}><i className="bi bi-trash"></i></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE/UPDATE MODAL */}
      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h4>{mode === "create" ? "Create FAQ" : "Update FAQ"}</h4>

            <input
              name="question"
              placeholder="Enter Question"
              value={formValues.question}
              onChange={(e) =>
                setFormValues({ ...formValues, question: e.target.value })
              }
            />

            {/* ✅ ReactQuill Added here for Answer */}
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
              <button onClick={closeModal}>Cancel</button>
              <button onClick={handleSubmit}>
                {mode === "create" ? "Submit" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADING MODAL */}
      {showHeadingModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h4>Heading</h4>
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
              <button onClick={() => setShowHeadingModal(false)}>Cancel</button>
              <button
                onClick={async () => {
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

      {/* GET/DETAILS MODAL */}
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
                  <td dangerouslySetInnerHTML={{ __html: getData.answer }}></td>
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

      {/* PAGINATION */}
      {!isFullPage && (
        <div className={styles.paginationWrap}>
          <button
            className={styles.createBtn}
            disabled={page === 1}
            onClick={() => {
              const newPage = page - 1;
              setPage(newPage);
              localStorage.setItem("faqPage", newPage);
            }}
          >
            Prev
          </button>

          <span className={styles.pageText}>
            Page <strong>{page}</strong>
            <span className={styles.divider}> / </span>
            <strong>{totalPages}</strong>
          </span>

          <button
            className={styles.createBtn}
            disabled={page === totalPages}
            onClick={() => {
              const newPage = page + 1;
              setPage(newPage);
              localStorage.setItem("faqPage", newPage);
            }}
          >
            Next
          </button>

          <select
            className={styles.limitSelect}
            value={limit}
            onChange={(e) => {
              const value = Number(e.target.value);
              setLimit(value);
              localStorage.setItem("faqLimit", value);
              setPage(1);
              localStorage.setItem("faqPage", 1);
            }}
          >
            <option value={5}>Show 5 FAQs</option>
            <option value={10}>Show 10 FAQs</option>
            <option value={20}>Show 20 FAQs</option>
          </select>
        </div>
      )}

    </div>
  );
}