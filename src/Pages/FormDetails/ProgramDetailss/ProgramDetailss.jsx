import React from "react";
import FormDetailsLeft from "../../../Component/ChildrenAll/FormDetailsLeft/FormDetailsLeft";
import styles from "./ProgramDetailss.module.scss";
import "../../../Main.scss"; 
import NextFormPara from "../../../Component/ChildrenAll/NextFormPara/NextFormPara";
import FillFormHeading from "../../../Component/FillFormHeading/FillFormHeading";

export default function ProgramDetailss() {
  return (
    <div className="container">
      
      <FillFormHeading/>

      <div className={styles.totalWrapper}>
        <div className="row g-0"> {/* remove bootstrap gutter */}
          
          <div className="col-4">
            <div className={styles.left}>
              <FormDetailsLeft activeStep={3} />
            </div>
          </div>

          <div className="col-8">
            <div className={styles.right}>
              <NextFormPara/>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}