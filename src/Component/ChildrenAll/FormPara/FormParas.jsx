import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import styles from './FormParas.module.scss'
import CmnHeading from "../../CmnHeading/CmnHeading";
import Button from "../../Buttons/Button";
import { handleError } from "../../../utils";

export default function FormParas() {
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);

    const handleNext = () => {
        if (!checked) {
            handleError("Please accept the waiver conditions first.");
            return;
        }
        navigate("/ProgramDetailss");
    };

    return (
        <div>
            <div className={styles["para-head"]}>
                <h3>Waiver Acceptance</h3>
                <p>Lorem ipsum dolor sit amet consectetur</p>
            </div>

            <div className={styles.paras}>
                <CmnHeading
                    details={
                        <>
                            <p className={styles.para}>
                                Quam in non velit malesuada arcu eget id. Id ut turpis tempor semper et in nunc aliquet. Orci cras faucibus aliquam eget orci egestas. Ut congue ut amet commodo eget. Nam eu duis imperdiet morbi orci ac tellus aenean. A pharetra at sodales praesent commodo nibh. At ac lacus morbi consectetur nisi. Vel pharetra viverra hendrerit odio eu amet elementum quam dui. Tincidunt sit ac ac interdum.
                            </p>
                            <p className={styles.para}>
                                Velit auctor eros egestas nunc suspendisse amet fermentum lectus. Sed tellus nulla elit proin. Sit nibh urna elit amet netus nam convallis. Diam id auctor fermentum aliquam aliquet elit in suspendisse pellentesque. Quam fusce nec enim turpis nisl. Ac nec dictumst aliquet vivamus vel orci. Iaculis aenean accumsan tortor in et id ullamcorper aenean enim. At gravida nibh ornare commodo luctus gravida pretium fermentum volutpat. Eget integer sed nunc sit. <br />Lorem faucibus egestas tortor id nibh hendrerit massa tortor mi. Scelerisque nunc quis risus nunc in. Vitae at purus sit nec suspendisse donec enim senectus scelerisque. In sed risus nisl posuere molestie. Vel massa augue in fermentum.
                            </p>
                        </>
                    }
                    align="left"
                />
            </div>

            <div className={styles["waiver-wrapper"]}>
                <label className={styles["checkbox-container"]}>
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => setChecked(e.target.checked)}
                    />
                    <span className={styles["custom-checkbox"]}></span>
                    <span className={styles["label-text"]}>
                        Accept the conditions of the waiver
                    </span>
                </label>
            </div>

            <div className={styles.btns}>
                <div className={styles["btn-b"]}>
                    <Button 
                        text="back" 
                        variant="dark"
                        onClick={() => navigate("/Schooldetails")}
                    />
                </div>

                <div className={styles["btn-r"]}>
                    <Button 
                        text="next" 
                        variant="primary"
                        onClick={handleNext}
                    />
                </div>
            </div>
        </div>
    )
}