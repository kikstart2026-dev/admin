import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./ChildrenDetailsForm.module.scss";
import styles2 from "../SchoolDetailsForm/SchoolDetailsForm.module.scss";

import Button from "../../Buttons/Button";

import { handleError, handleSuccess } from "../../../utils";

import { createChild } from "../../../apis/api";

export default function ChildrenDetailsForm() {

  const navigate = useNavigate();

  const [allergy, setAllergy] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const locationRef = useRef(null);
  const fileRef = useRef(null);
  const dropdownRef = useRef(null);

  /* ---------------- Location ---------------- */

  const handleGetLocation = () => {

    if (!navigator.geolocation) {
      handleError("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        const { latitude, longitude } = position.coords;

        try {

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data = await response.json();

          locationRef.current.value =
            data.display_name || `${latitude}, ${longitude}`;

        } catch {

          locationRef.current.value =
            `${latitude}, ${longitude}`;

        }
      },

      () => handleError("Unable to retrieve location")
    );
  };

  /* ---------------- Upload ---------------- */

  const handleUpload = () => {
    fileRef.current.click();
  };

  /* ---------------- Outside Click Close ---------------- */

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  /* ---------------- Submit ---------------- */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const formData = new FormData(e.target);

      // API DATA
      const data = new FormData();

      data.append("fullName", formData.get("name"));
      data.append("location", formData.get("location"));
      data.append("age", formData.get("age"));
      data.append("foodHabit", formData.get("foodHabit"));
      data.append("allergy", allergy);
      data.append(
        "allergyDetails",
        formData.get("allergyDetails")
      );
      data.append(
        "prolongDisease",
        formData.get("disease")
      );

      // IMAGE
      if (formData.get("image")) {
        data.append("profileImage", formData.get("image"));
      }

      // API CALL
      const res = await createChild(data);

      console.log("CREATE CHILD => ", res);

      if (res.success) {

        handleSuccess("Child created successfully");

        navigate("/Schooldetails");

      } else {

        handleError(res.message || "Something went wrong");

      }

    } catch (error) {

      console.log(error);

      handleError(
        error?.response?.data?.message ||
        "Failed to create child"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className={styles.childrenForm}>

      <div className={styles.formBox}>

        <div className={styles.head}>
          <h2>Children Details</h2>
          <p>Lorem ipsum dolor sit amet consectetur</p>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >

          {/* Name */}
          <div className={styles.inputWrapper}>
            <input
              name="name"
              className={styles.inp}
              type="text"
              placeholder=" "
              required
            />
            <label className={styles.lbl}>
              Full Name
            </label>
          </div>

          {/* Location */}
          <div className={`${styles.inputWrapper} ${styles.locationWrapper}`}>

            <input
              ref={locationRef}
              name="location"
              className={`${styles.inp} ${styles.spInp}`}
              type="text"
              placeholder=" "
              required
            />

            <label className={styles.lbl}>
              Location
            </label>

            <button
              type="button"
              className={styles.locationBtn}
              onClick={handleGetLocation}
            >
              <i className="fa-solid fa-location-crosshairs"></i>
            </button>

          </div>

          {/* Age */}
          <div className={styles.inputWrapper}>
            <input
              name="age"
              className={styles.inp}
              type="number"
              placeholder=" "
              required
            />
            <label className={styles.lbl}>
              Age
            </label>
          </div>

          {/* Food Habit */}
          <div className={styles.inputWrapper}>
            <input
              name="foodHabit"
              className={styles.inp}
              type="text"
              placeholder=" "
            />
            <label className={styles.lbl}>
              Food Habit
            </label>
          </div>

          {/* Allergy */}
          <div
            className={styles.inputWrapper}
            ref={dropdownRef}
          >

            <div className={`dropdown ${styles.customDropdown}`}>

              <button
                className={`${styles.dropdownBtn} ${allergy ? styles.active : ""
                  }`}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
              >
                {allergy || ""}
              </button>

              <ul
                className={`dropdown-menu ${isOpen ? "show" : ""
                  }`}
              >

                <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      setAllergy("Yes");
                      setIsOpen(false);
                    }}
                  >
                    Yes
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      setAllergy("No");
                      setIsOpen(false);
                    }}
                  >
                    No
                  </button>
                </li>

              </ul>

            </div>

            <label
              className={`${styles.lbl} ${allergy ? styles.lblActive : ""
                }`}
            >
              Have Any Type Of Allergy?
            </label>

          </div>

          {/* Allergy Details */}
          <div className={styles.inputWrapper}>
            <input
              name="allergyDetails"
              className={styles.inp}
              type="text"
              placeholder=" "
            />
            <label className={styles.lbl}>
              Allergy Details
            </label>
          </div>

          {/* Disease */}
          <div className={styles.inputWrapper}>
            <input
              name="disease"
              className={styles.inp}
              type="text"
              placeholder=" "
            />
            <label className={styles.lbl}>
              Any Prolong Disease
            </label>
          </div>

          {/* Upload */}
          <div className={styles.uploadWrapper}>

            <span className={styles.uploadText}>
              Upload image Within size of 5MB
            </span>

            <button
              type="button"
              className={styles.uploadBtn}
              onClick={handleUpload}
            >
              UPLOAD
            </button>

            <input
              type="file"
              name="image"
              ref={fileRef}
              hidden
            />

          </div>

          {/* Button */}
          <div className={styles2.btns}>

            <Button
              className={styles.nextBtn}
              type="submit"
              text={loading ? "LOADING..." : "NEXT"}
              variant="primary"
            />

          </div>

        </form>

      </div>

    </div>
  );
}