import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./ServiceControl.module.scss";

import {
  getAllService,
  createService,
  updateService,
  singleDeleteService,
  selectiveDeleteService,
  createHeading,
  updateHeading,
  createFile
} from "../../apis/api";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { handleSuccess, handleError } from "../../utils";

export default function ServiceControl() {
  const queryClient = useQueryClient();

  // --- STATES ---
  const [selected, setSelected] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showHeadingModal, setShowHeadingModal] = useState(false);
  const [showGet, setShowGet] = useState(false);

  const [mode, setMode] = useState("create");
  const [serviceId, setServiceId] = useState(null);
  const [headingId, setHeadingId] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [oldImage, setOldImage] = useState("");
  const [getData, setGetData] = useState(null);

  // PAGINATION STATE
  const [page, setPage] = useState(1);
  const limit = 10; // প্রতি পেজে ১০টি ডাটা

  const [headingData, setHeadingData] = useState({
    tagline: "",
    heading: ""
  });

  const [formValues, setFormValues] = useState({
    title: "",
    details: ""
  });

  // --- FETCH DATA WITH PAGINATION ---
  const { data = {}, isLoading } = useQuery({
    queryKey: ["services", page], // page change হলে রি-ফেচ হবে
    queryFn: async () => {
      const res = await getAllService(page, limit);
      return res || {};
    },
    keepPreviousData: true, // নতুন ডাটা লোড হওয়ার সময় পুরনো ডাটা দেখাবে
  });

  const services = data.data || [];
  const totalPages = data.totalPages || 1; // ব্যাকএন্ড থেকে আসা টোটাল পেজ সংখ্যা

  useEffect(() => {
    if (services.length > 0) {
      const validHeading = services.find(item => item.headingData);
      if (validHeading?.headingData) {
        setHeadingId(validHeading.headingData._id);
        setHeadingData({
          tagline: validHeading.headingData.tagline || "",
          heading: validHeading.headingData.heading || ""
        });
      }
    }
  }, [services]);

  const fetchData = () => {
    queryClient.invalidateQueries({ queryKey: ["services"] });
  };

  // --- HANDLERS ---
  const handleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (services.length > 0 && selected.length === services.length) setSelected([]);
    else setSelected(services.map(x => x._id));
  };

  const handleDeleteSelected = async () => {
    if (selected.length === 0) return handleError("Select services first");
    if (!window.confirm("Delete Selected Services?")) return;
    await selectiveDeleteService({ ids: selected });
    handleSuccess("Deleted Successfully");
    setSelected([]);
    fetchData();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleCreate = async () => {
    if (!formValues.title || !imageFile) return handleError("Title and Image required");
    let imageUrl = "";
    const fd = new FormData();
    fd.append("file", imageFile);
    const uploadRes = await createFile(fd);
    imageUrl = "http://localhost:8008" + uploadRes.data[0].path;

    await createService({ headingId, image: imageUrl, title: formValues.title, details: formValues.details });
    handleSuccess("Created");
    setShowForm(false);
    fetchData();
  };

  const handleUpdate = async () => {
    let imageUrl = oldImage;
    if (imageFile) {
      const fd = new FormData();
      fd.append("file", imageFile);
      const uploadRes = await createFile(fd);
      imageUrl = "http://localhost:8008" + uploadRes.data[0].path;
    }
    await updateService(serviceId, { headingId, image: imageUrl, title: formValues.title, details: formValues.details });
    handleSuccess("Updated");
    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;
    await singleDeleteService(id);
    fetchData();
  };

  const handleHeadingSave = async () => {
    if (headingId) await updateHeading(headingId, headingData);
    else {
      const res = await createHeading(headingData);
      setHeadingId(res?.data?._id);
    }
    handleSuccess("Heading Saved");
    setShowHeadingModal(false);
    fetchData();
  };

  const modules = {
    toolbar: [[{ font: [] }, { size: [] }], [{ header: [1, 2, 3, false] }], ["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }], ["link", "clean"]],
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className={styles.banner}>
      <div className={styles.bannerWrap}>
        <h3 className={styles.title}>Control As You Want</h3>
        <div className={styles.topActions}>
          <button className={styles.createBtn} onClick={() => {
            setMode("create"); setShowForm(true); setFormValues({ title: "", details: "" });
            setPreview(""); setImageFile(null); setOldImage("");
          }}>Create Service</button>
          <button className={styles.createBtn} onClick={() => setShowHeadingModal(true)}>Update Heading</button>
          <button className={styles.deleteSelected} onClick={handleDeleteSelected}>
            <i className="bi bi-trash"></i> {selected.length > 0 && ` (${selected.length}/${services.length})`}
          </button>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th><input type="checkbox" checked={services.length > 0 && selected.length === services.length} onChange={handleSelectAll} /> Select All</th>
              <th>Image</th>
              <th>Title</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {services.map((item) => (
              <tr key={item._id}>
                <td><input type="checkbox" checked={selected.includes(item._id)} onChange={() => handleSelect(item._id)} /></td>
                <td><img src={item.image} alt="" width="60" /></td>
                <td>{item.title}</td>
                <td className={styles.actions}>
                  <button onClick={() => {
                    setMode("update"); setShowForm(true); setServiceId(item._id);
                    setFormValues({ title: item.title, details: item.details });
                    setPreview(item.image); setOldImage(item.image);
                  }}><i className="bi bi-pencil-square"></i></button>
                  <button onClick={() => { setGetData(item); setShowGet(true); }}><i className="bi bi-eye"></i></button>
                  <button onClick={() => handleDelete(item._id)}><i className="bi bi-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION UI --- */}
      <div className={styles.pagination}>
        {/* Previous Arrow */}
        <button 
          disabled={page === 1} 
          onClick={() => setPage(prev => prev - 1)}
          className={styles.arrowBtn}
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        
        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => setPage(index + 1)}
            className={`${styles.numberBtn} ${page === index + 1 ? styles.activePage : ""}`}
          >
            {index + 1}
          </button>
        ))}
        
        {/* Next Arrow */}
        <button 
          disabled={page >= totalPages} 
          onClick={() => setPage(prev => prev + 1)}
          className={styles.arrowBtn}
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>

      {/* --- MODALS (Same as before) --- */}
      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h4>{mode === "create" ? "Create Service" : "Edit Service"}</h4>
            <input type="text" placeholder="Title" value={formValues.title} onChange={(e) => setFormValues({ ...formValues, title: e.target.value })} />
            <ReactQuill theme="snow" value={formValues.details} onChange={(val) => setFormValues({ ...formValues, details: val })} modules={modules} />
            <input type="file" onChange={handleImageChange} />
            {preview && <img src={preview} alt="" width="100" style={{marginTop:'10px'}} />}
            <div className={styles.modalActions}>
              <button onClick={() => setShowForm(false)}>Cancel</button>
              <button onClick={mode === "create" ? handleCreate : handleUpdate}>{mode === "create" ? "Create" : "Update"}</button>
            </div>
          </div>
        </div>
      )}

      {showHeadingModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h4>Update Heading</h4>
            <input type="text" placeholder="Tagline" value={headingData.tagline} onChange={(e) => setHeadingData({ ...headingData, tagline: e.target.value })} />
            <input type="text" placeholder="Heading" value={headingData.heading} onChange={(e) => setHeadingData({ ...headingData, heading: e.target.value })} />
            <div className={styles.modalActions}>
              <button onClick={() => setShowHeadingModal(false)}>Cancel</button>
              <button onClick={handleHeadingSave}>Save Heading</button>
            </div>
          </div>
        </div>
      )}

      {showGet && getData && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h4>View Service</h4>
            <table className={styles.viewTable}>
              <tbody>
                <tr><th>Image</th><td><img src={getData.image} alt="" width="100" /></td></tr>
                <tr><th>Title</th><td>{getData.title}</td></tr>
                <tr><th>Details</th><td dangerouslySetInnerHTML={{ __html: getData.details }} /></tr>
              </tbody>
            </table>
            <button className={styles.closeBtn} onClick={() => setShowGet(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}