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
  toggleActiveBanner,
} from "../../apis/api";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import "../../Main.scss";

export default function HomeBannerControl() {
  const queryClient = useQueryClient(); // catch control and data refresh
  const [selected, setSelected] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showGet, setShowGet] = useState(false);
  const [mode, setMode] = useState("create"); // create and update mode control
  const [bannerId, setBannerId] = useState(null);
  const [headingId, setHeadingId] = useState(null);
  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [getData, setGetData] = useState(null);

  const [formValues, setFormValues] = useState({
    tagline: "",
    heading: "",
    description: "",
  }); // form data store 

  const { data = [], isLoading } = useQuery({
    queryKey: ["homeBanners"],
    queryFn: async () => {
      const res = await getAllHomeBanner();
      return res?.data?.data || res?.data || []; // for safe data fetch
    },
  });

  const fetchBanner = () => {
    queryClient.invalidateQueries(["homeBanners"]);
  }; // refresh data

  const allSelected = selected.length === data.length && data.length > 0;

  const handleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSelectAll = () => {
    if (allSelected) setSelected([]);
    else setSelected(data.map((x) => x._id));
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

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleCreate = async () => {
    try {
      const headingRes = await createHeading(formValues);
      const newHeadingId = headingRes?.data?._id;

      let imageUrl = "";

      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);

        const uploadRes = await createFile(fd);
        imageUrl = uploadRes.data[0].path;
      }

      const bannerRes = await createHomeBanner({
        headingId: newHeadingId,
        image: "http://localhost:8008" + imageUrl,
      });

      const newBannerId = bannerRes?.data?._id;

      if (newBannerId) {
        await toggleActiveBanner(newBannerId);
      }

      alert("Banner Created Successfully");

      setShowForm(false);
      setImageFile(null);
      fetchBanner();
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

      await updateHomeBanner(bannerId, {
        headingId,
        image: imageUrl,
      });

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

    try {
      await singleDeleteHomeBanner(id);
      fetchBanner();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setMode("update");
    setShowForm(true);

    setBannerId(item._id);
    setHeadingId(item.headingData._id);

    setFormValues({
      tagline: item.headingData?.tagline || "",
      heading: item.headingData?.heading || "",
      description: item.headingData?.description || "",
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
      await toggleActiveBanner(id);
      fetchBanner();
    } catch (err) {
      console.error(err);
    }
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

              setFormValues({
                tagline: "",
                heading: "",
                description: "",
              });

              setPreview("");
              setImageFile(null);
            }}
          >
            Create Banner
          </button>

          <button
            className={styles.deleteSelected}
            onClick={handleDeleteSelected}
          >
            <i className="bi bi-trash"></i>{" "}
            {allSelected ? "ALL" : `(${selected.length}/${data.length})`}
          </button>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />{" "}
                Select All
              </th>

              <th>Image</th>
              <th>Tagline</th>
              <th>Heading</th>
              <th>Active</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                  No Banner Found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item._id}>
                  <td>
                    <input
                      className={styles.checkbox}
                      type="checkbox"
                      checked={selected.includes(item._id)}
                      onChange={() => handleSelect(item._id)}
                    />
                  </td>

                  <td>
                    <img
                      src={
                        item?.image ||
                        "https://via.placeholder.com/80?text=No+Image"
                      }
                      alt=""
                    />
                  </td>

                  <td>{item?.headingData?.tagline || "No tagline"}</td>
                  <td>{item?.headingData?.heading || "No Heading"}</td>

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

            <CKEditor
              editor={ClassicEditor}
              data={formValues.description}
              config={{
                toolbar: [
                  "heading",
                  "|",
                  "bold",
                  "italic",
                  "fontColor",
                  "fontBackgroundColor",
                  "|",
                  "bulletedList",
                  "numberedList",
                  "|",
                  "link",
                  "undo",
                  "redo"
                ]
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setFormValues({
                  ...formValues,
                  description: data,
                });
              }}
            />

            <input type="file" onChange={handleImageChange} />

            {preview && (
              <img src={preview} alt="preview" className={styles.preview} />
            )}

            <div className={styles.modalActions}>
              <button onClick={() => setShowForm(false)}>Cancel</button>

              <button onClick={mode === "create" ? handleCreate : handleUpdate}>
                {mode === "create" ? "Create" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <td
                    dangerouslySetInnerHTML={{
                      __html: getData.headingData.description,
                    }}
                  ></td>
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