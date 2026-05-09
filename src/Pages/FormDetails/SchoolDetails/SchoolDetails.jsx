import React from "react";
import FormDetailsLeft from "../../../Component/ChildrenAll/FormDetailsLeft/FormDetailsLeft";
import styles from "./SchoolDetails.module.scss";
import "../../../Main.scss"; 
import SchoolDetailsForm from "../../../Component/ChildrenAll/SchoolDetailsForm/SchoolDetailsForm";
import FillFormHeading from "../../../Component/FillFormHeading/FillFormHeading";


export default function SchoolDetails() {
  return (
    <div className="container">
      
      <FillFormHeading/>
       

      <div className={styles.totalWrapper}>
        <div className= "row g-0">
          
          <div className= "col-4">
            <div className={styles.left}>
              <FormDetailsLeft activeStep={1} />
            </div>
          </div>

          <div className="col-8">
            <div className={styles.right}> <SchoolDetailsForm/> </div>
          </div>

        </div>
      </div>
    </div>
  );
}
      
