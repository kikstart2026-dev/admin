import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./HomeBannerControl.module.scss";
import {
  getAllHomeBanner,
  updateHomeBanner,
  updateHeading,
  createHeading,
  createFile,
  createHomeBanner,
  singleDeleteHomeBanner,
  selectiveDeleteHomeBanner,
  toggleActiveBanner
} from "../../apis/api";
import "../../Main.scss";

export default function HomeBannerControl() {
  const queryClient = useQueryClient();

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
    tagline: "",
    heading: "",
    description: ""
  });

  // ================================
  // FETCH DATA
  // ================================
  const { data = [], isLoading } = useQuery({
    queryKey: ["homeBanners"],
    queryFn: async () => {
      const res = await getAllHomeBanner();
      return res?.data?.data || res?.data || [];
    },
  });

  const [banners, setBanners] = useState([]);

  React.useEffect(() => {
    setBanners(data);
  }, [data]);

  const fetchBanner = () => {
    queryClient.invalidateQueries(["homeBanners"]);
  };

  // ================================
  // SELECT LOGIC
  // ================================
  const allSelected = selected.length === banners.length && banners.length > 0;

  const handleSelect = (id) => {
    if (selected.includes(id)) setSelected(selected.filter((x) => x !== id));
    else setSelected([...selected, id]);
  };

  const handleSelectAll = () => {
    if (allSelected) setSelected([]);
    else setSelected(banners.map((x) => x._id));
  };

  const handleDeleteSelected = async () => {
    if (selected.length === 0) {
      alert("Select banners first");
      return;
    }
    if (!window.confirm("Delete Selected Banners?")) return;
    try {
      await selectiveDeleteHomeBanner({ ids: selected });
      setSelected([]);
      fetchBanner();
    } catch (err) {
      console.error(err);
    }
  };

  // ================================
  // FORM INPUT
  // ================================
  const handleChange = (e) =>
    setFormValues({ ...formValues, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // ================================
  // CREATE / UPDATE
  // ================================
  const handleCreate = async () => {
    try {
      // 1️⃣ Create the heading first
      const headingRes = await createHeading(formValues);
      const newHeadingId = headingRes?.data?._id;

      // 2️⃣ Upload image if any
      let imageUrl = "";
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const uploadRes = await createFile(fd);
        imageUrl = uploadRes.data[0].path;
      }

      // 3️⃣ Create the banner (default isActive = false)
      const bannerRes = await createHomeBanner({
        headingId: newHeadingId,
        image: "http://localhost:8008" + imageUrl
      });

      const newBannerId = bannerRes?.data?._id; // get the new banner ID

      // 4️⃣ Immediately activate the new banner
      if (newBannerId) {
        await toggleActiveBanner(newBannerId); // now it's active
      }

      alert("Banner Created and Activated Successfully");
      setShowForm(false);
      setImageFile(null);
      fetchBanner(); // refresh table to show active toggle
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateHeading(headingId, formValues);
      let imageUrl = preview;

      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const uploadRes = await createFile(fd);
        imageUrl = "http://localhost:8008" + uploadRes.data[0].path;
      }

      await updateHomeBanner(bannerId, { headingId, image: imageUrl });
      alert("Banner Updated Successfully");
      setShowForm(false);
      setImageFile(null);
      fetchBanner();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete Banner?")) return;
    await singleDeleteHomeBanner(id);
    fetchBanner();
  };

  const handleEdit = (item) => {
    setMode("update");
    setShowForm(true);
    setBannerId(item._id);
    setHeadingId(item.headingData._id);
    setFormValues({
      tagline: item.headingData?.tagline || "",
      heading: item.headingData?.heading || "",
      description: item.headingData?.description || ""
    });
    setPreview(item.image);
    setImageFile(null);
  };

  const handleGet = (item) => {
    setGetData(item);
    setShowGet(true);
  };

  const toggleActive = async (id) => {
    try {

      // UI instantly change
      setBanners((prev) =>
        prev.map((item) => ({
          ...item,
          isActive: item._id === id
        }))
      );

      // backend update
      await toggleActiveBanner(id);

      // backend থেকে fresh data আনবে
      fetchBanner();

    } catch (err) {
      console.error(err);
    }
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
              setMode("create");
              setShowForm(true);
              setFormValues({ tagline: "", heading: "", description: "" });
              setPreview("");
              setImageFile(null);
            }}
          >
            Create Banner
          </button>

          <button className={styles.deleteSelected} onClick={handleDeleteSelected}>
            <i className="bi bi-trash"></i>{" "}
            {allSelected ? "ALL" : `(${selected.length}/${banners.length})`}
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input type="checkbox" checked={allSelected} onChange={handleSelectAll} /> Select All
              </th>
              <th>Image</th>
              <th>Tagline</th>
              <th>Heading</th>
              <th>Active</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {banners.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                  No Banner Found
                </td>
              </tr>
            ) : (
              banners.map((item) => (
                <tr key={item._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(item._id)}
                      onChange={() => handleSelect(item._id)}
                    />
                  </td>
                  <td>
                    <img
                      src={item?.image || "https://via.placeholder.com/80?text=No+Image"}
                      alt=""
                    />
                  </td>
                  <td>{item?.headingData?.tagline || "No tagline"}</td>
                  <td>{item?.headingData?.heading || "No Heading"}</td>
                  
                  <td>
                    <i
                      className={item.isActive ? "bi bi-toggle-on" : "bi bi-toggle-off"}
                      style={{
                        fontSize: "26px",
                        cursor: "pointer",
                        color: item.isActive ? "#ED1C24" : "#aaa"  // red if active
                      }}
                      onClick={() => toggleActive(item._id)}
                    ></i>
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE / EDIT FORM */}
      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h4>{mode === "create" ? "Create Banner" : "Edit Banner"}</h4>

            <input
              type="text"
              placeholder="Tagline"
              name="tagline"
              value={formValues.tagline}
              onChange={handleChange}
            />

            <input
              type="text"
              placeholder="Heading"
              name="heading"
              value={formValues.heading}
              onChange={handleChange}
            />

            <textarea
              placeholder="Description"
              name="description"
              value={formValues.description}
              onChange={handleChange}
            />
            <input type="file" onChange={handleImageChange} />
            {preview && <img src={preview} alt="preview" className={styles.preview} />}
            <div className={styles.modalActions}>
              <button onClick={() => setShowForm(false)}>Cancel</button>
              <button onClick={mode === "create" ? handleCreate : handleUpdate}>
                {mode === "create" ? "Create" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GET MODAL */}
      {showGet && getData && (

        <div className={styles.modal}>

          <div className={styles.modalContent}>

            <h4>Banner Details</h4>

            <table>

              <tbody>
                <tr>
                  <th>Tagline</th>
                  <td>{getData.headingData.tagline}</td>
                </tr>
                <tr>

                  <th>Heading</th>
                  <td>{getData.headingData.heading}</td>
                </tr>

                <tr>
                  <th>Description</th>
                  <td>{getData.headingData.description}</td>
                </tr>

                <tr>
                  <th>Image</th>
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