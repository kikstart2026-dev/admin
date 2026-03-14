import React, { useState } from "react";
import styles from "./FAQsControl.module.scss";
import { getFaqs, deleteFaq, updateFaq, createFaq } from "../../apis/api"; // createFaq import করুন
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function FAQsControl() {
    const queryClient = useQueryClient();
    const [selected, setSelected] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [mode, setMode] = useState("create");
    const [faqId, setFaqId] = useState(null);
    // FAQsControl.jsx
    const [formValues, setFormValues] = useState({
        question: "",
        answer: "",
        headingId: "YOUR_ACTUAL_HEADING_ID_HERE"
    });
    const [getData, setGetData] = useState(null);
    const [showGet, setShowGet] = useState(false);

    // Fetch Data
    const { data = [] } = useQuery({
        queryKey: ["faqs"],
        queryFn: async () => {
            const res = await getFaqs();
            return res?.data || [];
        },
    });

    const refresh = () => queryClient.invalidateQueries(["faqs"]);

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleGet = (item) => {
        setGetData(item);
        setShowGet(true);
    };

    // CREATE OR UPDATE
    const handleSubmit = async () => {
        try {
            if (mode === "create") {
                await createFaq(formValues);
                alert("FAQ Created Successfully");
            } else {
                await updateFaq(faqId, formValues);
                alert("FAQ Updated Successfully");
            }
            closeModal();
            refresh();
        } catch (err) {
            console.error(err);
        }
    };

    const closeModal = () => {
        setShowForm(false);
        setShowGet(false);
        setFormValues({ question: "", answer: "" });
        setFaqId(null);
    };

    const handleSelectAll = (e) => {
        setSelected(e.target.checked ? data.map((item) => item._id) : []);
    };

    const handleSelect = (id) => {
        setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete FAQ?")) return;
        await deleteFaq(id);
        refresh();
    };

    const handleEdit = (item) => {
        setMode("update");
        setFaqId(item._id);
        setFormValues({ question: item.question, answer: item.answer });
        setShowForm(true);
    };

    /* ===== BULK DELETE ===== */
    const handleBulkDelete = async () => {
        if (selected.length === 0) return alert("Please select at least one FAQ");

        if (!window.confirm(`Delete ${selected.length} selected FAQs?`)) return;

        try {
            await Promise.all(selected.map((id) => deleteFaq(id)));

            alert("Selected FAQs deleted successfully");
            setSelected([]); 
            refresh(); 
        } catch (err) {
            console.error(err);
            alert("Failed to delete some items");
        }
    };

    return (
        <div className={styles.banner}>
            <div className={styles.bannerWrap}>
                <h3 className={styles.title}>Control As You Want</h3>
                <div className={styles.topActions}>
                    <button className={styles.createBtn} onClick={() => { setMode("create"); setShowForm(true); }}>
                        Create FAQ
                    </button>
                    <button className={styles.deleteBtn} onClick={handleBulkDelete}>🗑 ({selected.length})</button>
                </div>
            </div>

            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th><input type="checkbox" onChange={handleSelectAll} /> Select All</th>
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
                            data.map((item) => (
                                <tr key={item._id}>
                                    <td><input type="checkbox" checked={selected.includes(item._id)} onChange={() => handleSelect(item._id)} /></td>
                                    <td>{item.question}</td>
                                    <td>
                                        {item.answer.length > 100 ? (
                                            <>
                                                {item.answer.substring(0, 50)}...{" "}
                                                <span
                                                    className={styles.readMore}
                                                    onClick={() => handleGet(item)}
                                                >
                                                    Read More
                                                </span>
                                            </>
                                        ) : (
                                            item.answer
                                        )}
                                    </td>
                                    <td>
                                        <label className={styles.switch}>
                                            <input type="checkbox" defaultChecked={item.isActive} />
                                            <span className={styles.slider}></span>
                                        </label>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button onClick={() => handleEdit(item)}><i className="bi bi-pencil-square"></i></button>
                                            <button onClick={() => { setGetData(item); setShowGet(true); }}><i className="bi bi-eye"></i></button>
                                            <button onClick={() => handleDelete(item._id)}><i className="bi bi-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* CREATE/UPDATE MODAL */}
            {showForm && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalBox}>
                        <h2 className={styles.modalTitle}>{mode === "create" ? "Create FAQ" : "Update FAQ"}</h2>
                        <input name="question" placeholder="Question" value={formValues.question} onChange={handleChange} />
                        <textarea name="answer" placeholder="Answer" rows="4" value={formValues.answer} onChange={handleChange} />
                        <div className={styles.modalBtns}>
                            <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                            <button className={styles.createModalBtn} onClick={handleSubmit}>
                                {mode === "create" ? "Submit" : "Update"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW MODAL */}
            {showGet && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalBox}>
                        <h2 className={styles.modalTitle}>FAQ Details</h2>
                        <p><strong>Question:</strong> {getData?.question}</p>
                        <p><strong>Answer:</strong> {getData?.answer}</p>
                        <div className={styles.modalBtns}>
                            <button className={styles.cancelBtn} onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}