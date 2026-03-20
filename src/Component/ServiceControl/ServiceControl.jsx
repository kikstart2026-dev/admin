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

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function ServiceControl() {

  const queryClient = useQueryClient();

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

  const [headingData, setHeadingData] = useState({
    tagline: "",
    heading: ""
  });

  const [formValues, setFormValues] = useState({
    title: "",
    details: ""
  });

  const { data = {}, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await getAllService();
      return res || {};
    }
  });

  const services = data.data || [];

  useEffect(() => {
    if (services.length > 0 && headingId === null) {
      setHeadingId(services[0].headingData?._id);
      setHeadingData({
        tagline: services[0].headingData?.tagline || "",
        heading: services[0].headingData?.heading || ""
      });
    }
  }, [services]);

  const fetchData = () => {
    queryClient.invalidateQueries({ queryKey: ["services"] });
  };

  const allSelected =
    services.length > 0 && selected.length === services.length;

  const handleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSelectAll = () => {
    if (allSelected) setSelected([]);
    else setSelected(services.map((x) => x._id));
  };

  const handleDeleteSelected = async () => {

    if (selected.length === 0) {
      alert("Select services first");
      return;
    }

    if (!window.confirm("Delete Selected Services?")) return;

    await selectiveDeleteService({ ids: selected });

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

    if (!formValues.title || !imageFile) {
      alert("Title and Image are required");
      return;
    }

    let imageUrl = "";

    if (imageFile) {

      const fd = new FormData();
      fd.append("file", imageFile);

      const uploadRes = await createFile(fd);

      imageUrl = "http://localhost:8008" + uploadRes.data[0].path;
    }

    await createService({
      headingId,
      image: imageUrl,
      title: formValues.title,
      details: formValues.details
    });

    alert("Service Created");

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

    await updateService(serviceId, {
      headingId,
      image: imageUrl,
      title: formValues.title,
      details: formValues.details
    });

    alert("Service Updated");

    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete Service?")) return;

    await singleDeleteService(id);

    fetchData();
  };

  const handleHeadingSave = async () => {

    if (headingId) {
      await updateHeading(headingId, headingData);
    } else {
      const res = await createHeading(headingData);
      setHeadingId(res?.data?._id);
    }

    alert("Heading Saved");

    setShowHeadingModal(false);
    fetchData();
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

              setFormValues({ title: "", details: "" });

              setPreview("");
              setImageFile(null);
              setOldImage("");
            }}
          >
            Create Service
          </button>

          <button
            className={styles.createBtn}
            onClick={() => setShowHeadingModal(true)}
          >
            Update Heading
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
                : ` (${selected.length}/${services.length})`}
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

              <th>Image</th>
              <th>Title</th>
              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {services.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                  No Services Found
                </td>
              </tr>
            ) : (
              services.map((item) => (

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

                  <td className={styles.actions}>

                    <button
                      onClick={() => {

                        setMode("update");
                        setShowForm(true);

                        setServiceId(item._id);

                        setFormValues({
                          title: item.title,
                          details: item.details
                        });

                        setPreview(item.image);
                        setOldImage(item.image);
                      }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>

                    <button
                      onClick={() => {

                        setGetData(item);
                        setShowGet(true);

                      }}
                    >
                      <i className="bi bi-eye"></i>
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>

                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>


      {/* Create / Update Modal */}

      {showForm && (

        <div className={styles.modal}>

          <div className={styles.modalContent}>

            <h4>{mode === "create" ? "Create Service" : "Edit Service"}</h4>

            <input
              type="text"
              placeholder="Title"
              value={formValues.title}
              onChange={(e) =>
                setFormValues({ ...formValues, title: e.target.value })
              }
            />

            <div className={styles.ck}>
              <CKEditor
                editor={ClassicEditor}
                data={formValues.details}
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
                    details: data,
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
                setHeadingData({
                  ...headingData,
                  tagline: e.target.value
                })
              }
            />

            <input
              type="text"
              placeholder="Heading"
              value={headingData.heading}
              onChange={(e) =>
                setHeadingData({
                  ...headingData,
                  heading: e.target.value
                })
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

      {/* View Modal */}

      {showGet && getData && (

        <div className={styles.modal}>

          <div className={styles.modalContent}>

            <h4>View Service</h4>

            <img src={getData.image} alt="" width="120" />

            <p><strong>Title:</strong> {getData.title}</p>

            <p><strong>Details:</strong> {getData.details}</p>

            <div className={styles.modalActions}>
              <button onClick={() => setShowGet(false)}>Close</button>
            </div>

          </div>

        </div>

      )}

    </div>
  );
}
