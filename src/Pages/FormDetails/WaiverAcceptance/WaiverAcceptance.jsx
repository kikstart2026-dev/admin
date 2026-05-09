import React from "react";
import FormDetailsLeft from "../../../Component/ChildrenAll/FormDetailsLeft/FormDetailsLeft";
import styles from "./WaiverAcceptance.module.scss";
import "../../../Main.scss"; 
import FormParas from "../../../Component/ChildrenAll/FormPara/FormParas";
import FillFormHeading from "../../../Component/FillFormHeading/FillFormHeading";

export default function WaiverAcceptance() {
  return (
    <div className="container">
      
      <FillFormHeading/>

      <div className={styles.totalWrapper}>
        <div className="row g-0"> 
          
          <div className="col-4">
            <div className={styles.left}>
              <FormDetailsLeft activeStep={2} />
            </div>
          </div>

          <div className="col-8">
            <div className={styles.right}>
              <FormParas/>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}