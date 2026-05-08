import React from "react";
import "../../../Main.scss";
import styles from "./FormDetailsLeft.module.scss";

import childIcon from "../../../assets/images/child.png";
import schoolIcon from "../../../assets/images/school.png";
import waiverIcon from "../../../assets/images/waiver.png";
import programIcon from "../../../assets/images/program.png";

const StepSidebar = ({ activeStep = 0 }) => {

  const steps = [
    { id: 0, title: "Children Details", icon: childIcon },
    { id: 1, title: "School Details", icon: schoolIcon },
    { id: 2, title: "Waiver Acceptance", icon: waiverIcon },
    { id: 3, title: "Program Details", icon: programIcon },
  ];

  return (
    <div className={`container ${styles.sidebar}`}>
      {steps.map((step, index) => {

        const isCompleted = index < activeStep;
        const isActive = index === activeStep;

        return (
          <div key={step.id} className="row align-items-start">

            {/* TITLE */}
            <div className="col-8">
             <div className={`
                ${styles.title}
                ${isActive ? styles.activeTitle : ""}
                ${isCompleted ? styles.completedTitle : ""}
              `}>
              {step.title}
            </div>
            </div>

            {/* ICON */}
            <div className="col-4 d-flex flex-column align-items-center">

              <div
                className={`
                  ${styles.iconCircle}
                  ${isCompleted ? styles.completed : ""}
                  ${isActive ? styles.subActive : ""}
                `}
              >
                <img src={step.icon} alt={step.title} />
              </div>

              {index !== steps.length - 1 && (
                <div
                  className={`
                    ${styles.line}
                    ${index < activeStep ? styles.lineActive : ""}
                  `}
                ></div>
              )}

            </div>

          </div>
        );
      })}
    </div>
  );
};

export default StepSidebar;