import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import {
    getSchools,
    createSchool,
    updateSchool,
    deleteSchool,
    selectiveDeleteSchool,
    createFile
} from "../../apis/api";

import { handleSuccess, handleError } from "../../utils";

// import styles from "../ServiceControl/ServiceControl.module.scss";
import styles from "./InterestedSchoolControl.module.scss"

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

    const [formValues, setFormValues] = useState({
        title: "",
        description: "",
        coach: "",
        author: ""
    });

    const [viewData, setViewData] = useState(null);

    const modules = {
        toolbar: [
            [{ font: [] }, { size: [] }],
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["link"],
            ["clean"]
        ]
    };

    // ---------------- FETCH ALL SCHOOLS ----------------
    const { data: schools = [], isLoading } = useQuery({
        queryKey: ["schools"],
        queryFn: () => getSchools(1, 100)
    });

    const allSelected = schools.length > 0 && selected.length === schools.length;

    // ---------------- MUTATIONS ----------------
    const createMutation = useMutation({
        mutationFn: (payload) => createSchool(payload),
        onSuccess: () => {
            queryClient.invalidateQueries(["schools"]);
            handleSuccess("School created successfully");
        },
        onError: (err) => handleError(err.message)
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }) => updateSchool(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries(["schools"]);
            handleSuccess("School updated successfully");
        },
        onError: (err) => handleError(err.message)
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteSchool(id),
        onSuccess: () => {
            queryClient.invalidateQueries(["schools"]);
            handleSuccess("School deleted successfully");
        },
        onError: (err) => handleError(err.message)
    });

    const deleteSelectedMutation = useMutation({
        mutationFn: (ids) => selectiveDeleteSchool({ ids }),
        onSuccess: () => {
            queryClient.invalidateQueries(["schools"]);
            handleSuccess("Selected schools deleted successfully");
        },
        onError: (err) => handleError(err.message)
    });

    // ---------------- HANDLERS ----------------
    const handleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (!schools || schools.length === 0) return;
        if (allSelected) setSelected([]);
        else setSelected(schools.map((x) => x._id));
    };

    const handleDeleteSelected = () => {
        if (selected.length === 0) return handleError("Select schools first");
        if (!window.confirm("Delete selected schools?")) return;
        deleteSelectedMutation.mutate(selected);
        setSelected([]);
    };

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

    const handleCreateOrUpdate = async () => {
        if (!formValues.title) return handleError("Title is required");

        let imageUrl = oldImage;
        let authorImgUrl = oldAuthorImg;

        try {
            if (imageFile) {
                const fd = new FormData();
                fd.append("file", imageFile);
                const res = await createFile(fd);
                imageUrl = "http://localhost:8008" + res.data[0].path;
            }

            if (authorImageFile) {
                const fd = new FormData();
                fd.append("file", authorImageFile);
                const res = await createFile(fd);
                authorImgUrl = "http://localhost:8008" + res.data[0].path;
            }

            const payload = { ...formValues, image: imageUrl, authorImg: authorImgUrl };

            if (mode === "create") createMutation.mutate(payload);
            else updateMutation.mutate({ id: schoolId, payload });

            // reset form
            setFormValues({ title: "", description: "", coach: "", author: "" });
            setPreview("");
            setAuthorPreview("");
            setOldImage("");
            setOldAuthorImg("");
            setImageFile(null);
            setAuthorImageFile(null);
            setShowForm(false);
            setSchoolId(null);
        } catch (err) {
            handleError(err.message);
        }
    };

    const handleDelete = (id) => {
        if (!window.confirm("Delete this school?")) return;
        deleteMutation.mutate(id);
    };

    if (isLoading) return <p>Loading...</p>;

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
                            setFormValues({ title: "", description: "", coach: "", author: "" });
                            setPreview("");
                            setAuthorPreview("");
                            setImageFile(null);
                            setAuthorImageFile(null);
                            setOldImage("");
                            setOldAuthorImg("");
                            setSchoolId(null);
                        }}
                    >
                        Create School
                    </button>

                    <button className={styles.deleteSelected} onClick={handleDeleteSelected}>
                        <i className="bi bi-trash"></i>
                        {selected.length === 0 ? "" : allSelected ? " ALL" : ` (${selected.length}/${schools.length})`}
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
                                    className={styles.checkbox}
                                    checked={allSelected}
                                    onChange={handleSelectAll}
                                />{" "}
                                Select All
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
                                <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                                    No schools found
                                </td>
                            </tr>
                        ) : (
                            schools.map((item) => (
                                <tr key={item._id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            checked={selected.includes(item._id)}
                                            onChange={() => handleSelect(item._id)}
                                        />
                                    </td>
                                    <td>
                                        <img src={item.image} alt="" width="80" />
                                    </td>
                                    <td>{item.title}</td>
                                    <td>{item.author}</td>
                                    <td className={styles.actions}>
                                        <button
                                            onClick={() => {
                                                setMode("update");
                                                setShowForm(true);
                                                setSchoolId(item._id);
                                                setFormValues({
                                                    title: item.title,
                                                    description: item.description,
                                                    coach: item.coach,
                                                    author: item.author
                                                });
                                                setPreview(item.image);
                                                setAuthorPreview(item.authorImg);
                                                setOldImage(item.image);
                                                setOldAuthorImg(item.authorImg);
                                            }}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setViewData(item);
                                                setShowView(true);
                                            }}
                                        >
                                            <i className="bi bi-eye"></i>
                                        </button>
                                        <button onClick={() => handleDelete(item._id)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h4>{mode === "create" ? "Create School" : "Edit School"}</h4>
                        <input
                            type="text"
                            placeholder="Title"
                            value={formValues.title}
                            onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                        />
                        <div style={{ marginBottom: "10px" }}>
                            <label>Description:</label>
                            <ReactQuill
                                theme="snow"
                                value={formValues.description}
                                onChange={(v) => setFormValues({ ...formValues, description: v })}
                                modules={modules}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Coach"
                            value={formValues.coach}
                            onChange={(e) => setFormValues({ ...formValues, coach: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Author"
                            value={formValues.author}
                            onChange={(e) => setFormValues({ ...formValues, author: e.target.value })}
                        />
                        <div className={styles.fileContent}>
                            <input type="file" onChange={handleImageChange} />
                            {preview && <img src={preview} width="100" />}

                            <input type="file" onChange={handleAuthorImageChange} />
                            {authorPreview && <img src={authorPreview} width="80"/>}
                        </div>
                        <div className={styles.modalActions}>
                            <button onClick={() => setShowForm(false)}>Cancel</button>
                            <button onClick={handleCreateOrUpdate}>{mode === "create" ? "Create" : "Update"}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {showView && viewData && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h4>View School</h4>
                        <table className={styles.viewTable}>
                            <tbody>
                                <tr>
                                    <th>Image</th>
                                    <td><img src={viewData.image} alt="" width="120" /></td>
                                </tr>
                                <tr>
                                    <th>Title</th>
                                    <td>{viewData.title}</td>
                                </tr>
                                <tr>
                                    <th>Description</th>
                                    <td dangerouslySetInnerHTML={{ __html: viewData.description }} />
                                </tr>
                            </tbody>
                        </table>
                        <button className={styles.closeBtn} onClick={() => setShowView(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}