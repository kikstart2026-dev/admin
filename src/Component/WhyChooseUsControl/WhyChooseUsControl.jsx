import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./WhyChooseUsControl.module.scss";

import {
  getAllWhyChooseUs,
  createWhyChooseUs,
  updateWhyChooseUs,
  singleDeleteWhyChooseUs,
  selectiveDeleteWhyChooseUs,
  createHeading,
  updateHeading,
  createFile
} from "../../apis/api";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { handleSuccess, handleError } from "../../utils";

export default function WhyChooseUsControl() {

  const queryClient = useQueryClient();

  const [selected, setSelected] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showHeadingModal, setShowHeadingModal] = useState(false);
  const [showGet, setShowGet] = useState(false);

  const [mode, setMode] = useState("create");
  const [cardId, setCardId] = useState(null);

  const [headingId, setHeadingId] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [oldImage, setOldImage] = useState("");

  const [getData, setGetData] = useState(null);

  const [headingData, setHeadingData] = useState({
    tagline: "",
    heading: "",
    description: ""
  });

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    color: ""
  });

  const [page, setPage] = useState(1);

  const { data = {}, isLoading } = useQuery({
    queryKey: ["whyChooseUs", page],
    queryFn: () =>
      getAllWhyChooseUs({
        page,
        limit: 8,
      }),
  });

  const modules = {
    toolbar: [
      // FONT + SIZE
      [{ font: [] }, { size: [] }],

      // HEADINGS
      [{ header: [1, 2, 3, false] }],

      // TEXT STYLE
      ["bold", "italic", "underline", "strike"],

      // COLOR
      [{ color: [] }, { background: [] }],

      // LIST + ALIGN
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],

      // LINK
      ["link"],

      // CLEAN
      ["clean"],
    ],
  };

  const cards = data?.data?.cards || [];
  const totalPages = data.totalPages || 1;

  const heading = data?.data?.heading || null;
  const headingIdFromData = heading?._id || null;

  const fetchData = () => {
    queryClient.invalidateQueries(["whyChooseUs", page]);
  };

  const allSelected = selected.length === cards.length && cards.length > 0;

  const handleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSelectAll = () => {
    if (allSelected) setSelected([]);
    else setSelected(cards.map((x) => x._id));
  };

  const handleDeleteSelected = async () => {

    if (selected.length === 0) {
      handleError("Select cards first");
      return;
    }

    if (!window.confirm("Delete Selected Cards?")) return;

    await selectiveDeleteWhyChooseUs({ ids: selected });

    setSelected([]);

    fetchData();
  };

  const handleHeadingSave = async () => {

    if (headingId) {
      await updateHeading(headingId, headingData);
      handleSuccess("Heading Updated");
    } else {
      const res = await createHeading(headingData);
      setHeadingId(res?.data?._id);
      handleSuccess("Heading Created");
    }

    fetchData();
  };

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleCreate = async () => {

    if (!headingId) {
      handleError("Create heading first");
      return;
    }

    // ✅ ADD HERE
    if (!formValues.title || !formValues.color || !imageFile) {
      handleError("Title, Color and Icon are required");
      return;
    }

    let imageUrl = "";

    if (imageFile) {
      const fd = new FormData();
      fd.append("file", imageFile);

      const uploadRes = await createFile(fd);

      imageUrl = "http://localhost:8008" + uploadRes.data[0].path;
    }

    await createWhyChooseUs({
      headingId,
      icon: imageUrl,
      title: formValues.title,
      description: formValues.description,
      color: formValues.color
    });

    handleSuccess("Card Created");

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

    await updateWhyChooseUs(cardId, {
      headingId,
      icon: imageUrl,
      title: formValues.title,
      description: formValues.description,
      color: formValues.color
    });

    handleSuccess("Card Updated");

    setShowForm(false);

    fetchData();
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete Card?")) return;

    await singleDeleteWhyChooseUs(id);

    fetchData();
  };

  const handleEdit = (item) => {

    setMode("update");
    setShowForm(true);

    setCardId(item._id);

    setFormValues({
      title: item.title,
      description: item.description,
      color: item.color
    });

    setPreview(item.icon);
    setOldImage(item.icon);
    setImageFile(null);
  };

  const handleGet = (item) => {

    setGetData(item);

    setShowGet(true);
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
                title: "",
                description: "",
                color: ""
              });

              setPreview("");
            }}
          >
            Create Card
          </button>

          <button
            className={styles.createBtn}
            onClick={() => {
              if (heading) {
                setHeadingData({
                  tagline: heading.tagline || "",
                  heading: heading.heading || "",
                  description: heading.description || ""
                });
                setHeadingId(heading._id);
              }
              setShowHeadingModal(true);
            }}
          >
            {heading ? "Update Heading" : "Create Heading"}
          </button>

          <button
            className={styles.deleteSelected} // About style delete
            onClick={handleDeleteSelected}
          >
            <i className="bi bi-trash"></i>
            {selected.length === 0
              ? ""
              : allSelected
                ? " ALL"
                : ` (${selected.length}/${cards.length})`}
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
                /> Select All
              </th>

              <th>Icon</th>
              <th>Title</th>
              <th>Color</th>
              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {cards.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                  No Cards Found
                </td>
              </tr>
            ) : (
              cards.map((item) => (

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
                    <img src={item.icon} alt="" width="80" />
                  </td>

                  <td>{item.title}</td>

                  <td>
                    <div
                      style={{
                        background: item.color,
                        padding: "6px 14px",
                        borderRadius: "6px"
                      }}
                    >
                      {item.color}
                    </div>
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

      <nav className="mt-4">
        <ul className={`pagination justify-content-center ${styles.customPagination}`}>

          {/* LEFT ARROW */}
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button
              className="page-link arrow"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              &lt;
            </button>
          </li>

          {/* PAGE NUMBERS */}
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

          {/* RIGHT ARROW */}
          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
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

      {/* Create / Update Modal */}

      {showForm && (

        <div className={styles.modal}>

          <div className={styles.modalContent}>

            <h4>{mode === "create" ? "Create Card" : "Edit Card"}</h4>

            <input
              type="text"
              placeholder="Title"
              value={formValues.title}
              onChange={(e) =>
                setFormValues({ ...formValues, title: e.target.value })
              }
            />

            <div className={styles.ck}>
              <ReactQuill
                theme="snow"
                value={formValues.description}
                onChange={(value) =>
                  setFormValues({
                    ...formValues,
                    description: value,
                  })
                }
                modules={modules}
              />
            </div>

            <input
              type="text"
              placeholder="Color"
              value={formValues.color}
              onChange={(e) =>
                setFormValues({ ...formValues, color: e.target.value })
              }
            />

            <input type="file" onChange={handleImageChange} />

            {preview && <img src={preview} alt="" width="100" />}

            <div className={styles.modalActions}>

              <button onClick={() => setShowForm(false)}>Cancel</button>

              <button onClick={mode === "create" ? handleCreate : handleUpdate}>
                {mode === "create" ? "Create" : "Update"}
              </button>

            </div>

          </div>

        </div>

      )}

      {/* Heading Modal */}

      {showHeadingModal && (

        <div className={styles.modal}>

          <div className={styles.modalContent}>

            <h4>Update Heading</h4>

            <input
              type="text"
              placeholder="Tagline"
              value={headingData.tagline}
              onChange={(e) =>
                setHeadingData({ ...headingData, tagline: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Heading"
              value={headingData.heading}
              onChange={(e) =>
                setHeadingData({ ...headingData, heading: e.target.value })
              }
            />

            <div className={styles.ck}>
              <ReactQuill
                theme="snow"
                value={headingData.description}
                onChange={(value) =>
                  setHeadingData({
                    ...headingData,
                    description: value,
                  })
                }
              />
            </div>

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

      {/* View Modal */}

      {showGet && getData && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>

            <h4>View Card</h4>

            <table>
              <tbody>

                <tr>
                  <th>Icon</th>
                  <td>
                    <img src={getData.icon} alt="" />
                  </td>
                </tr>

                <tr>
                  <th>Title</th>
                  <td>{getData.title}</td>
                </tr>

                <tr>
                  <th>Description</th>
                  <td dangerouslySetInnerHTML={{ __html: getData.description }}></td>
                </tr>

                <tr>
                  <th>Color</th>
                  <td>
                    <div
                      className={styles.colorBox}
                      style={{ background: getData.color }}
                    >
                      {getData.color}
                    </div>
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
