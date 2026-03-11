import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./WhyChooseUsControl.module.scss";
import "../../Main.scss";

import {
  getAllWhyChooseUs,
  createWhyChooseUs,
  updateWhyChooseUs,
  singleDeleteWhyChooseUs,
  selectiveDeleteWhyChooseUs,
  updateHeading,
  createFile
} from "../../apis/api";

export default function WhyChooseUsControl() {

  const queryClient = useQueryClient();

  const [selected,setSelected] = useState([]);

  const [showCardForm,setShowCardForm] = useState(false);
  const [showHeadingForm,setShowHeadingForm] = useState(false);

  const [mode,setMode] = useState("create");

  const [cardId,setCardId] = useState(null);
  const [headingId,setHeadingId] = useState(null);

  const [iconFile,setIconFile] = useState(null);
  const [preview,setPreview] = useState("");

  const [headingForm,setHeadingForm] = useState({
    tagline:"",
    heading:"",
    description:""
  });

  const [cardForm,setCardForm] = useState({
    title:"",
    description:"",
    color:""
  });

  // =========================
  // FETCH DATA
  // =========================

  const {data,isLoading} = useQuery({
    queryKey:["whyChooseUs"],
    queryFn: async ()=>{
      const res = await getAllWhyChooseUs();
      return res?.data?.data || {};
    }
  });

  const [cards,setCards] = useState([]);

  useEffect(()=>{

    if(data?.cards){

      setCards(data.cards);

    }

    if(data?.heading){

      setHeadingId(data.heading._id);

      setHeadingForm({
        tagline:data.heading.tagline || "",
        heading:data.heading.heading || "",
        description:data.heading.description || ""
      });

    }

  },[data]);

  const refresh = ()=>{
    queryClient.invalidateQueries(["whyChooseUs"]);
  }

  // =========================
  // SELECT
  // =========================

  const handleSelect = (id)=>{
    if(selected.includes(id)){
      setSelected(selected.filter(x=>x!==id));
    }else{
      setSelected([...selected,id]);
    }
  };

  const allSelected = selected.length === cards.length && cards.length>0;

  const handleSelectAll = ()=>{
    if(allSelected){
      setSelected([]);
    }else{
      setSelected(cards.map(x=>x._id));
    }
  };

  const handleDeleteSelected = async()=>{
    await selectiveDeleteWhyChooseUs({ids:selected});
    setSelected([]);
    refresh();
  };

  // =========================
  // HEADING INPUT
  // =========================

  const handleHeadingChange = (e)=>{
    setHeadingForm({
      ...headingForm,
      [e.target.name]:e.target.value
    });
  };

  const handleHeadingUpdate = async()=>{

    await updateHeading(headingId,headingForm);

    setShowHeadingForm(false);

    refresh();

  };

  // =========================
  // CARD INPUT
  // =========================

  const handleCardChange = (e)=>{
    setCardForm({
      ...cardForm,
      [e.target.name]:e.target.value
    });
  };

  const handleIconChange = (e)=>{
    const file = e.target.files[0];
    if(!file) return;

    setIconFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // =========================
  // CREATE CARD
  // =========================

  const handleCreateCard = async()=>{

    let iconUrl="";

    if(iconFile){

      const fd = new FormData();

      fd.append("file",iconFile);

      const uploadRes = await createFile(fd);

      iconUrl="http://localhost:8008"+uploadRes.data[0].path;

    }

    await createWhyChooseUs({
      headingId,
      icon:iconUrl,
      title:cardForm.title,
      description:cardForm.description,
      color:cardForm.color
    });

    setShowCardForm(false);

    refresh();

  };

  // =========================
  // UPDATE CARD
  // =========================

  const handleUpdateCard = async()=>{

    let iconUrl = preview;

    if(iconFile){

      const fd = new FormData();

      fd.append("file",iconFile);

      const uploadRes = await createFile(fd);

      iconUrl="http://localhost:8008"+uploadRes.data[0].path;

    }

    await updateWhyChooseUs(cardId,{
      headingId,
      icon:iconUrl,
      title:cardForm.title,
      description:cardForm.description,
      color:cardForm.color
    });

    setShowCardForm(false);

    refresh();

  };

  // =========================
  // DELETE CARD
  // =========================

  const handleDelete = async(id)=>{

    if(!window.confirm("Delete card?")) return;

    await singleDeleteWhyChooseUs(id);

    refresh();

  };

  // =========================
  // EDIT CARD
  // =========================

  const handleEdit = (item)=>{

    setMode("update");

    setShowCardForm(true);

    setCardId(item._id);

    setPreview(item.icon);

    setCardForm({
      title:item.title,
      description:item.description,
      color:item.color
    });

  };

  if(isLoading) return <p>Loading...</p>;

  return(

    <div className={styles.banner}>

      <div className={styles.bannerWrap}>

        <h3 className={styles.title}>Why Choose Us Control</h3>

        <div className={styles.topActions}>

          <button
            className={styles.createBtn}
            onClick={()=>setShowHeadingForm(true)}
          >
            Update Heading
          </button>

          <button
            className={styles.createBtn}
            onClick={()=>{

              setMode("create");

              setShowCardForm(true);

              setCardForm({
                title:"",
                description:"",
                color:""
              });

              setPreview("");

              setIconFile(null);

            }}
          >
            Create Card
          </button>

          <button
            className={styles.deleteSelected}
            onClick={handleDeleteSelected}
          >
            Delete Selected
          </button>

        </div>

      </div>

      {/* TABLE */}

      <div className={styles.tableWrap}>

        <table className={styles.table}>

          <thead>

            <tr>

              <th>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
                Select All
              </th>

              <th>Icon</th>

              <th>Title</th>

              <th>Color</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {cards.length===0 ? (

              <tr>
                <td colSpan="5">No Card Found</td>
              </tr>

            ) : (

              cards.map(item=>(
                <tr key={item._id}>

                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(item._id)}
                      onChange={()=>handleSelect(item._id)}
                    />
                  </td>

                  <td>
                    <img src={item.icon} alt="" width="40"/>
                  </td>

                  <td>{item.title}</td>

                  <td>
                    <span style={{background:item.color,padding:"5px 15px"}}>
                      {item.color}
                    </span>
                  </td>

                  <td className={styles.actions}>

                    <button onClick={()=>handleEdit(item)}>
                      <i className="bi bi-pencil-square"></i>
                    </button>

                    <button onClick={()=>handleDelete(item._id)}>
                      <i className="bi bi-trash"></i>
                    </button>

                  </td>

                </tr>
              ))

            )}

          </tbody>

        </table>

      </div>

      {/* HEADING MODAL */}

      {showHeadingForm && (

        <div className={styles.modal}>

          <div className={styles.modalContent}>

            <h4>Update Heading</h4>

            <input
              type="text"
              name="tagline"
              placeholder="Tagline"
              value={headingForm.tagline}
              onChange={handleHeadingChange}
            />

            <input
              type="text"
              name="heading"
              placeholder="Heading"
              value={headingForm.heading}
              onChange={handleHeadingChange}
            />

            <textarea
              name="description"
              placeholder="Description"
              value={headingForm.description}
              onChange={handleHeadingChange}
            />

            <div className={styles.modalActions}>

              <button onClick={()=>setShowHeadingForm(false)}>
                Cancel
              </button>

              <button onClick={handleHeadingUpdate}>
                Update
              </button>

            </div>

          </div>

        </div>

      )}

      {/* CARD MODAL */}

      {showCardForm && (

        <div className={styles.modal}>

          <div className={styles.modalContent}>

            <h4>{mode==="create"?"Create Card":"Update Card"}</h4>

            <input
              type="text"
              name="title"
              placeholder="Title"
              value={cardForm.title}
              onChange={handleCardChange}
            />

            <textarea
              name="description"
              placeholder="Description"
              value={cardForm.description}
              onChange={handleCardChange}
            />

            <input
              type="color"
              name="color"
              value={cardForm.color}
              onChange={handleCardChange}
            />

            <input type="file" onChange={handleIconChange}/>

            {preview && (
              <img
                src={preview}
                alt=""
                className={styles.preview}
              />
            )}

            <div className={styles.modalActions}>

              <button onClick={()=>setShowCardForm(false)}>
                Cancel
              </button>

              <button
                onClick={mode==="create"?handleCreateCard:handleUpdateCard}
              >
                {mode==="create"?"Create":"Update"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}