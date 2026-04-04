import React, { useState } from "react";
import styles from "./FAQsControl.module.scss";
import {
  getFaqs,
  deleteFaq,
  updateFaq,
  createFaq,
  toggleActiveFaq,
} from "../../apis/api";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { handleSuccess, handleError } from "../../utils";

export default function FAQsControl({ isFullPage = false, visibleCount = 5 }) {
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

  /* ================= PAGINATION ================= */

  const [page, setPage] = useState(1);
  const currentPage = isFullPage ? page : 1;
  const limit = visibleCount;

  const { data: response = {} } = useQuery({
    queryKey: ["faqs", currentPage, isFullPage],
    queryFn: async () => {
      const res = await getFaqs(currentPage, limit);
      return res || {};
    },
  });

  const data = response.data || [];
  const totalPages = response.totalPages || 1;

  // ❗ IMPORTANT (NO SLICE)
  const displayedData = data;

  /* ================= QUILL ================= */

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

  /* ================= REFRESH ================= */

  const refresh = () => queryClient.invalidateQueries(["faqs"]);

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
                <input type="checkbox" onChange={handleSelectAll} /> Select All
              </th>
              <th>Question</th>
              <th>Answer</th>
              <th>Active</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {displayedData.map((item) => (
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
                    __html: item.answer.substring(0, 80),
                  }}
                ></td>

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

      {/* ✅ PAGINATION ONLY FAQ PAGE */}
      {isFullPage && (
        <nav className="mt-4">
          <ul
            className={`pagination justify-content-center ${styles.customPagination}`}
          >
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                className="page-link arrow"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                &lt;
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <li
                key={num}
                className={`page-item ${page === num ? "active" : ""}`}
              >
                <button
                  className={`page-link ${page === num ? "num" : ""}`}
                  onClick={() => setPage(num)}
                >
                  {num}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                page === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link arrow"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                &gt;
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* CREATE / UPDATE MODAL */}
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
                  <td
                    dangerouslySetInnerHTML={{ __html: getData.answer }}
                  ></td>
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