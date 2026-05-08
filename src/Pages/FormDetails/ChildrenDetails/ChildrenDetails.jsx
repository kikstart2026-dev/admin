import React from "react";
import FormDetailsLeft from "../../../Component/ChildrenAll/FormDetailsLeft/FormDetailsLeft";
import styles from "./ChildrenDetails.module.scss";
import "../../../Main.scss"; 
import ChildrenDetailsForm from "../../../Component/ChildrenAll/ChildrenDetailsForm/ChildrenDetailsForm";
import FillFormHeading from "../../../Component/FillFormHeading/FillFormHeading";

export default function ChildrenDetails() {
  return (
    <div className="container">
      
      <FillFormHeading/>

      <div className={styles.totalWrapper}>
        <div className="row g-0"> 
          
          <div className="col-4">
            <div className={styles.left}>
              <FormDetailsLeft activeStep={0} />
            </div>
          </div>

          <div className="col-8">
            <div className={styles.right}>
              <ChildrenDetailsForm />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}