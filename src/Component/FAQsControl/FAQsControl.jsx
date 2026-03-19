import React, { useState, useEffect } from "react";
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

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function FAQsControl() {
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showGet, setShowGet] = useState(false);
  const [showHeadingModal, setShowHeadingModal] = useState(false);

  const [mode, setMode] = useState("create"); // create/update
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

  // ================= FETCH =================
  const { data = [] } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const res = await getFaqs();
      return res?.data || [];
    },
  });

  // ================= AUTO LOAD HEADING =================
  useEffect(() => {
    if (data.length && data[0]?.headingData && !headingId) {
      setHeadingId(data[0].headingData._id);
      setHeadingData({
        tagline: data[0].headingData.tagline || "",
        heading: data[0].headingData.heading || "",
        description: data[0].headingData.description || ""
      });
    }
  }, [data]);

  const refresh = () => queryClient.invalidateQueries(["faqs"]);

  // ================= TOGGLE =================
  const handleToggle = async (id) => {
    await toggleActiveFaq(id);
    refresh();
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!headingId) {
        alert("Create heading first");
        return;
      }

      if (mode === "create") {
        await createFaq({ ...formValues, headingId });
        alert("FAQ Created");
      } else {
        await updateFaq(faqId, { ...formValues, headingId });
        alert("FAQ Updated");
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
        alert("Heading Updated");
      } else {
        const res = await createHeading(headingData);
        setHeadingId(res?.data?._id);
        alert("Heading Created");
      }
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete FAQ?")) return;
    await deleteFaq(id);
    refresh();
  };

  // DELETE SELECTED — **About style** without Promise.all
  const handleBulkDelete = async () => {
    if (selected.length === 0) {
      alert("Select FAQs first");
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

  // ================= SELECT =================
  const allSelected = selected.length === data.length && data.length > 0;

  const handleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    setSelected(e.target.checked ? data.map(i => i._id) : []);
  };

  // ================= EDIT =================
  const handleEdit = (item) => {
    setMode("update");
    setFaqId(item._id);
    setFormValues({
      question: item.question,
      answer: item.answer
    });
    setShowForm(true);
  };

  // ================= GET =================
  const handleGet = (item) => {
    setGetData(item);
    setShowGet(true);
  };

  // ================= CLOSE =================
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
            className={styles.deleteSelected} // About style delete
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
              <th><input type="checkbox" checked={allSelected} onChange={handleSelectAll} /></th>
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

      {/* FORM MODAL */}
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

            <CKEditor
              editor={ClassicEditor}
              data={formValues.answer}
              config={{ placeholder: "Write answer here..." }}
              onChange={(event, editor) =>
                setFormValues({ ...formValues, answer: editor.getData() })
              }
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

            {/* <CKEditor
              editor={ClassicEditor}
              data={headingData.description}
              config={{ placeholder: "Write heading description..." }}
              onChange={(event, editor) =>
                setHeadingData({ ...headingData, description: editor.getData() })
              }
            /> */}

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

      {/* GET MODAL */}
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

    </div>
  );
}