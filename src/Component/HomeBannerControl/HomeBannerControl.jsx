import React, { useState } from "react";
import styles from "./HomeBannerControl.module.scss";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
    getAllHomeBanner,
    updateHomeBanner,
    updateHeading,
    createHeading,
    createFile,
    createHomeBanner,
    singleDeleteHomeBanner,
    selectiveDeleteHomeBanner,

} from "../../apis/api";

import "../../Main.scss";

export default function HomeBannerControl() {

    const queryClient = useQueryClient();

    const [banners, setBanners] = useState([]); // to store banner data
    const [selected, setSelected] = useState([]); //to store banners by checkbox

    const [showForm, setShowForm] = useState(false); // form show / hide control
    const [showGet, setShowGet] = useState(false); // for modal show

    const [mode, setMode] = useState("create"); // to set the form create mode or update

    const [bannerId, setBannerId] = useState(null); // to store banner id for update
    const [headingId, setHeadingId] = useState(null); //to store heading id for update

    const [preview, setPreview] = useState(""); // to show image preview
    const [imageFile, setImageFile] = useState(null); // to store uploaded file

    const [getData, setGetData] = useState(null); // when click the Get button show banner details in the modal box 

    const [formValues, setFormValues] = useState({
        subheading: "",
        heading: "",
        description: "",
    }); // to store form input data

    // =============================
    // FETCH BANNERS
    // =============================

    const { isLoading } = useQuery({
        queryKey: ["homeBanners"],
        queryFn: async () => {

            const res = await getAllHomeBanner();

            const bannersData = res?.data?.data || res?.data || []; // for safe data access

            const sorted = [...bannersData].sort( // copy banner data

                (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // compare by create date

            ); // sort to show newest banner first 

            setBanners(sorted); // banners state update

            return sorted;
        },
    });

    const fetchBanner = () => {
        queryClient.invalidateQueries(["homeBanners"]);
    };

    // =============================
    // INPUT CHANGE
    // =============================

    const handleChange = (e) => { //form input change handle

        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value, // exp: input name="heading" value="Banner" | output: { heading:"Banner" }
        });
    };

    // =============================
    // IMAGE CHANGE
    // =============================

    const handleImageChange = (e) => { //image upload handle

        const file = e.target.files[0]; // take selected file

        if (!file) return;

        setImageFile(file);
        setPreview(URL.createObjectURL(file)); // generate image preview
    };

    // =============================
    // CREATE
    // =============================
    const handleCreate = async () => {

        try {

            //  First create heading
            const headingRes = await createHeading(formValues);

            const newHeadingId = headingRes?.data?._id; // find heading id and store 

            let imageUrl = "";

            if (imageFile) {

                const fd = new FormData(); // use form data to upload file 
                fd.append("file", imageFile);

                const uploadRes = await createFile(fd); // upload in server

                imageUrl = uploadRes.data[0].path; // for image path 
            }

            const BaseUrl = "http://localhost:8008"; // base url

            // ✅ Then create banner
            await createHomeBanner({
                headingId: newHeadingId,
                image: BaseUrl + imageUrl, // full image path
            }); // create banner

            alert("Banner Created Successfully");

            fetchBanner(); //list refresh

            setShowForm(false); //clear form

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

            let imageUrl = preview; // if not upload new image then show old one

            if (imageFile) {

                const fd = new FormData();
                fd.append("file", imageFile);

                const uploadRes = await createFile(fd);

                const BaseUrl = "http://localhost:8008";

                imageUrl = BaseUrl + uploadRes.data[0].path; 
            }

            await updateHomeBanner(bannerId, {
                headingId: headingId,
                image: imageUrl, //  same image if not changed 
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

    const handleDelete = async (id) => { // delete by id

        if (!window.confirm("Delete Banner?")) return; // show confirmation popup

        await singleDeleteHomeBanner(id); //api call -> send request to server for delete single banner  

        fetchBanner();
    };


    // HANDLE SELECT / UNSELECT checkbox

    const handleSelect = (id) => {
        if (selected.includes(id)) {
            setSelected(selected.filter((item) => item !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    // =============================
    // DELETE SELECTED (USING BULK API)
    // =============================
    const handleDeleteSelected = async () => {
        if (selected.length === 0) {
            alert("Select banners first");
            return;
        }

        if (!window.confirm("Delete Selected Banners?")) return;

        try {
            // call your bulk delete API
            const payload = { ids: selected }; // { ids: [id1, id2, ...] }
            const res = await selectiveDeleteHomeBanner(payload);

            if (res.status === "success") {
                alert(`${res.deletedCount} banners deleted successfully`);
                setSelected([]);   // clear selection
                fetchBanner();     // refresh banner list
            } else {
                alert("Something went wrong");
            }
        } catch (err) {
            console.error(err);
            alert("Error deleting banners: " + err.message);
        }
    };

    // =============================
    // EDIT
    // =============================

    const handleEdit = (item) => {

        setMode("update");
        setShowForm(true);

        setBannerId(item._id); // set banner id to show exact banner data
        setHeadingId(item.headingData._id); // set heading id 

        setFormValues({ // fill the form with bannerdata
            subheading: item.headingData.subheading,
            heading: item.headingData.heading,
            description: item.headingData.description,
        });

        setPreview(item.image); // show exist banneer image 

        setImageFile(null); // fix image path null
    };

    // =============================
    // GET
    // =============================

    const handleGet = (item) => { // show banner details in modal

        setGetData(item); // store selected banner data in state
        setShowGet(true); // open modal
    };

    if (isLoading) return <p>Loading...</p>;

   


    return (

        <div className={styles.banner}>
            <div className={styles.bannerWrap}>

                <h3 className={styles.title}>Home Banner Control</h3>
                <div className={styles.topActions}>


                    <button
                        className={styles.createBtn}
                        onClick={() => {

                            setMode("create"); // form create mode a jbe click korle 
                            setShowForm(true);

                            setFormValues({
                                subheading: "",
                                heading: "",
                                description: "",
                            }); // remove old data and show blank form for create new

                            setPreview(""); // preview -> null

                            setImageFile(null); // make image path null

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

                    {/* hamdle button for update and create to call exact function */}

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
                            onClick={() => setShowGet(false)} // modal close
                        >
                            Close
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}