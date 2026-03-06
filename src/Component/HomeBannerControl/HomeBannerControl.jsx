import React, { useEffect, useState } from "react";
import styles from "./HomeBannerControl.module.scss";

import {
    getAllHomeBanner,
    updateHomeBanner,
    updateHeading,
    createHeading,
    createFile,
    createHomeBanner,
    singleDeleteHomeBanner,
} from "../../apis/api";

export default function HomeBannerControl() {

    const [banners, setBanners] = useState([]);
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
        subheading: "",
        heading: "",
        description: "",
    });

    // =============================
    // FETCH BANNERS
    // =============================

    const fetchBanner = async () => {

        const res = await getAllHomeBanner();

        const bannersData = res?.data?.data || res?.data || [];

        const sorted = [...bannersData].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setBanners(sorted);
    };

    useEffect(() => {
        fetchBanner();
    }, []);

    // =============================
    // INPUT CHANGE
    // =============================

    const handleChange = (e) => {

        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    // =============================
    // IMAGE CHANGE
    // =============================

    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    // =============================
    // CREATE
    // =============================
    const handleCreate = async () => {

        try {

            // ✅ First create heading
            const headingRes = await createHeading(formValues);

            const newHeadingId = headingRes?.data?._id;

            let imageUrl = "";

            if (imageFile) {

                const fd = new FormData();
                fd.append("file", imageFile);

                const uploadRes = await createFile(fd);

                imageUrl = uploadRes.data[0].path;
            }

            const BaseUrl = "http://localhost:8008";

            // ✅ Then create banner
            await createHomeBanner({
                headingId: newHeadingId,
                image: BaseUrl + imageUrl,
            });

            alert("Banner Created Successfully");

            fetchBanner();

            setShowForm(false);

            setImageFile(null);

        } catch (err) {
            console.log(err);
        }
    };

    // =============================
    // UPDATE
    // =============================

    const handleUpdate = async () => {

        try {

            await updateHeading(headingId, formValues);

            let imageUrl = preview;

            if (imageFile) {

                const fd = new FormData();
                fd.append("file", imageFile);

                const uploadRes = await createFile(fd);

                const BaseUrl = "http://localhost:8008";

                imageUrl = BaseUrl + uploadRes.data[0].path;
            }

            await updateHomeBanner(bannerId, {
                headingId: headingId,
                image: imageUrl, // ✅ same image if not changed
            });

            alert("Banner Updated Successfully");

            fetchBanner();

            setShowForm(false);
            setImageFile(null);

        } catch (err) {
            console.log(err);
        }
    };

    // =============================
    // DELETE
    // =============================

    const handleDelete = async (id) => {

        if (!window.confirm("Delete Banner?")) return;

        await singleDeleteHomeBanner(id);

        fetchBanner();
    };

    // =============================
    // SELECT CHECKBOX
    // =============================

    const handleSelect = (id) => {

        if (selected.includes(id)) {

            setSelected(selected.filter((item) => item !== id));

        } else {

            setSelected([...selected, id]);
        }
    };

    // =============================
    // DELETE SELECTED
    // =============================

    const handleDeleteSelected = async () => {

        if (selected.length === 0) {

            alert("Select banners first");
            return;
        }

        if (!window.confirm("Delete Selected Banners?")) return;

        for (let id of selected) {

            await singleDeleteHomeBanner(id);
        }

        setSelected([]);

        fetchBanner();
    };

    // =============================
    // EDIT
    // =============================

    const handleEdit = (item) => {

        setMode("update");
        setShowForm(true);

        setBannerId(item._id);
        setHeadingId(item.headingData._id);

        setFormValues({
            subheading: item.headingData.subheading,
            heading: item.headingData.heading,
            description: item.headingData.description,
        });

        setPreview(item.image);

        // FIX
        setImageFile(null);
    };

    // =============================
    // GET
    // =============================

    const handleGet = (item) => {

        setGetData(item);
        setShowGet(true);
    };

    return (

        <div className={styles.bannerWrap}>

            <h3 className={styles.title}>Home Banner Control</h3>

            <div className={styles.topActions}>

                <button
                    className={styles.createBtn}
                    onClick={() => {

                        setMode("create");
                        setShowForm(true);

                        setFormValues({
                            subheading: "",
                            heading: "",
                            description: "",
                        });

                        setPreview("");

                        // FIX
                        setImageFile(null);

                    }}
                >
                    Create Banner
                </button>

                <button
                    className={styles.deleteSelected}
                    onClick={handleDeleteSelected}
                >
                    Delete Selected
                </button>

            </div>

            {/* FORM */}

            {showForm && (

                <div className={styles.formBox}>

                    <h4>
                        {mode === "create" ? "Create Banner" : "Update Banner"}
                    </h4>

                    <div className={styles.formRow}>
                        <label>Subheading</label>
                        <input
                            name="subheading"
                            value={formValues.subheading}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label>Heading</label>
                        <input
                            name="heading"
                            value={formValues.heading}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formValues.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label>Banner Image</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                        />
                    </div>

                    {preview && (

                        <div className={styles.preview}>
                            <img src={preview} alt="" />
                        </div>

                    )}

                    <button
                        className={styles.saveBtn}
                        onClick={
                            mode === "create"
                                ? handleCreate
                                : handleUpdate
                        }
                    >
                        {mode === "create"
                            ? "Create Banner"
                            : "Update Banner"}
                    </button>

                </div>

            )}

            {/* TABLE */}
            <div className={styles.tableWrap}>
                <table className={styles.table}>

                    <thead className={styles.tableHead}>

                        <tr>
                            <th>Select</th>
                            <th>Image</th>
                            <th>Heading</th>
                            <th>Subheading</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {banners.map((item) => (

                            <tr key={item._id}>

                                <td>

                                    <input
                                        type="checkbox"
                                        checked={selected.includes(item._id)}
                                        onChange={() => handleSelect(item._id)}
                                    />

                                </td>

                                <td>
                                    <img src={item.image} alt="" />
                                </td>

                                <td>{item.headingData.heading}</td>

                                <td>{item.headingData.subheading}</td>

                                <td className={styles.actions}>

                                    <button onClick={() => handleEdit(item)}>
                                        Edit
                                    </button>

                                    <button onClick={() => handleGet(item)}>
                                        Get
                                    </button>

                                    <button onClick={() => handleDelete(item._id)}>
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>
            </div>

            {/* MODAL */}

            {showGet && getData && (

                <div className={styles.modal}>

                    <div className={styles.modalContent}>

                        <h3>Banner Details</h3>

                        <table>

                            <tbody>

                                <tr>
                                    <td>Heading</td>
                                    <td>{getData.headingData.heading}</td>
                                </tr>

                                <tr>
                                    <td>Subheading</td>
                                    <td>{getData.headingData.subheading}</td>
                                </tr>

                                <tr>
                                    <td>Description</td>
                                    <td>{getData.headingData.description}</td>
                                </tr>

                                <tr>
                                    <td>Image</td>
                                    <td>
                                        <img src={getData.image} alt="" />
                                    </td>
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