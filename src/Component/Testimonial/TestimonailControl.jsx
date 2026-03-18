import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./TestimonailControl.module.scss";
import {
  getAllTest,
  createTest,
  updateTest,
  delSingleTest,
  delSelectiveTest,
  createHeading,
  updateHeading,
  createFile,
} from "../../apis/api";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function TestimonialControl() {
  const queryClient = useQueryClient();

  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [showHeadingModal, setShowHeadingModal] = useState(false);
  const [showGet, setShowGet] = useState(false);

  const [mode, setMode] = useState("create");
  const [cardId, setCardId] = useState(null);

  const [headingId, setHeadingId] = useState(null);

  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [getData, setGetData] = useState(null);

  const [headingData, setHeadingData] = useState({
    tagline: "",
    heading: "",
    description: "",
  });

  const [formValues, setFormValues] = useState({
    name: "",
    designation: "",
    description: "",
  });

  const { data = {}, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const res = await getAllTest();
      return res?.data || {};
    },
  });

  useEffect(() => {
    setCards(data.cards || []);

    if (data.heading) {
      setHeadingId(data.heading._id);

      setHeadingData({
        tagline: data.heading.tagline || "",
        heading: data.heading.heading || "",
        description: data.heading.description || "",
      });
    }
  }, [data]);

  const fetchData = () => {
    queryClient.invalidateQueries(["testimonials"]);
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
      alert("Select cards first");
      return;
    }

    if (!window.confirm("Delete Selected Cards?")) return;

    await delSelectiveTest({ ids: selected });

    setSelected([]);

    fetchData();
  };

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

      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);

    setPreview(URL.createObjectURL(file));
  };

  const handleCreate = async () => {
    if (!headingId) {
      alert("Create heading first");
      return;
    }

    let imageUrl = "";

    if (imageFile) {
      const fd = new FormData();
      fd.append("file", imageFile);

      const uploadRes = await createFile(fd);

      imageUrl = "http://localhost:8008" + uploadRes.data[0].path;
    }

    await createTest({
      headingId,
      image: imageUrl,
      name: formValues.name,
      designation: formValues.designation,
      description: formValues.description,
    });

    alert("Card Created");

    setShowForm(false);

    fetchData();
  };

  const handleUpdate = async () => {
    let imageUrl = preview;

    if (imageFile) {
      const fd = new FormData();
      fd.append("file", imageFile);

      const uploadRes = await createFile(fd);

      imageUrl = "http://localhost:8008" + uploadRes.data[0].path;
    }

    await updateTest(cardId, {
      headingId,
      image: imageUrl,
      name: formValues.name,
      designation: formValues.designation,
      description: formValues.description,
    });

    alert("Card Updated");

    setShowForm(false);

    fetchData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete Card?")) return;

    await delSingleTest(id);

    fetchData();
  };

  const handleEdit = (item) => {
    setMode("update");
    setShowForm(true);

    setCardId(item._id);

    setFormValues({
      name: item.name,
      designation: item.designation,
      description: item.description,
    });

    setPreview(item.image);
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
                name: "",
                designation: "",
                description: "",
              });

              setPreview("");
            }}
          >
            Create Card
          </button>

          <button
            className={styles.createBtn}
            onClick={() => setShowHeadingModal(true)}
          >
            Update Heading
          </button>

          <button
            className={styles.deleteSelected}
            onClick={handleDeleteSelected}
          >
            <i className="bi bi-trash"></i>{" "}
            {allSelected ? "ALL" : `(${selected.length}/${cards.length})`}
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
              <th>Name</th>
              <th>Designation</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {cards.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No Testimonials Found
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
                    <img src={item.image} alt="" width="80" />
                  </td>

                  <td>{item.name}</td>

                  <td>{item.designation}</td>

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
            <h4>{mode === "create" ? "Create Card" : "Edit Card"}</h4>

            <input
              type="text"
              placeholder="Name"
              value={formValues.name}
              onChange={(e) =>
                setFormValues({ ...formValues, name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Designation"
              value={formValues.designation}
              onChange={(e) =>
                setFormValues({ ...formValues, designation: e.target.value })
              }
            />

            <div className={styles.ck}>
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
            </div>

            <input type="file" onChange={handleImageChange} />

            {preview && <img src={preview} alt="" width="120" />}

            <div className={styles.modalActions}>
              <button onClick={() => setShowForm(false)}>Cancel</button>

              <button onClick={mode === "create" ? handleCreate : handleUpdate}>
                {mode === "create" ? "Create" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

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

            <textarea
              placeholder="Description"
              value={headingData.description}
              onChange={(e) =>
                setHeadingData({ ...headingData, description: e.target.value })
              }
            />

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

      {showGet && getData && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h4>View Card</h4>

            <img src={getData.image} alt="" width="120" />

            <p>
              <strong>Name:</strong> {getData.name}
            </p>

            <p>
              <strong>Designation:</strong> {getData.designation}
            </p>

            <p>
              <strong>Description:</strong> {getData.description}
            </p>

            <div className={styles.modalActions}>
              <button onClick={() => setShowGet(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
