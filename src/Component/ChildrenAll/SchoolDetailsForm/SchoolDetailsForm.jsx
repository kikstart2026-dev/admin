import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles2 from "./SchoolDetailsForm.module.scss";
import styles from "../ChildrenDetailsForm/ChildrenDetailsForm.module.scss";
import Button from "../../Buttons/Button";
import { handleError } from "../../../utils";
import { createSchoolDetails } from "../../../apis/api"; // ✅ FIXED

export default function SchoolDetailsForm() {

    const navigate = useNavigate();
    const locationRef = useRef(null);

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
                    locationRef.current.value = `${latitude}, ${longitude}`;
                }
            },
            () => handleError("Unable to retrieve location")
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const data = {
            schoolName: formData.get("name"),
            schoolLocation: formData.get("location"),
        };

        try {

            const res = await createSchoolDetails(data); // ✅ FIXED

            if (res?.success) {
                navigate("/WaiverAcceptance");
            }

        } catch (error) {
            handleError(
                error?.response?.data?.message || "Something went wrong"
            );
        }
    };

    return (
        <div className={styles.childrenForm}>
            <div className={styles.formBox}>

                <div className={styles.head}>
                    <h2>School Details</h2>
                    <p>Lorem ipsum dolor sit amet consectetur</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>

                    {/* School Name */}
                    <div className={styles.inputWrapper}>
                        <input
                            name="name"
                            className={styles.inp}
                            type="text"
                            placeholder=" "
                            required
                        />
                        <label className={styles.lbl}>School Name</label>
                    </div>

                    {/* School Location */}
                    <div className={`${styles.inputWrapper} ${styles.locationWrapper}`}>
                        <input
                            ref={locationRef}
                            name="location"
                            className={`${styles.inp} ${styles.spInp}`}
                            type="text"
                            placeholder=" "
                        />
                        <label className={styles.lbl}>School Location</label>

                        <button
                            type="button"
                            className={styles.locationBtn}
                            onClick={handleGetLocation}
                        >
                            <i className="fa-solid fa-location-crosshairs"></i>
                        </button>
                    </div>

                    <div className={`${styles2.btns}`}>

                        <Button
                            className={`${styles.nextBtn} ${styles2.blackbtn}`}
                            type="button"
                            text="BACK"
                            variant="dark"
                            onClick={() => navigate("/children-details")}
                        />

                        <Button
                            className={`${styles.nextBtn} ${styles2.redbtn}`}
                            type="submit"
                            text="NEXT"
                            variant="primary"
                        />

                    </div>

                </form>

            </div>
        </div>
    );
}