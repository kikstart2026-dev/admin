import React from 'react'
import './NextFormPara.scss'
import CmnHeading from '../../CmnHeading/CmnHeading'
import Button from '../../Buttons/Button'
import { useNavigate } from 'react-router-dom'

export default function NextFormPara({ name, duration }) {
    const navigate = useNavigate();
    return (
        <div>

            <div className="para-head">
                <h3>Program Details</h3>
                <p>Lorem ipsum dolor sit amet consectetur</p>
            </div>

            <div className="program-info">
                <div className="program-left">
                    <span className="label">Program Name:</span>
                    <span className="value">{name || "Program Name 01"}</span>
                </div>

                <div className="program-right">
                    <span className="label">Program Duration:</span>
                    <span className="value">{duration || "2 Hours"}</span>
                </div>
            </div>

            <div className="mid">
                <h3>Details</h3>

                <CmnHeading
                    details={
                        <>
                            <p className="para">
                                Quam in non velit malesuada arcu eget id. Id ut turpis tempor semper et in nunc aliquet. Orci cras faucibus aliquam eget orci egestas. Ut congue ut amet commodo eget. Nam eu duis imperdiet morbi orci ac tellus aenean. A pharetra at sodales praesent commodo nibh. At ac lacus morbi consectetur nisi. Vel pharetra viverra hendrerit odio eu amet elementum quam dui. Tincidunt sit ac ac interdum.
                            </p>
                            <p className="para">
                                Velit auctor eros egestas nunc suspendisse amet fermentum lectus. Sed tellus nulla elit proin. Sit nibh urna elit amet netus nam convallis. Diam id auctor fermentum aliquam aliquet elit in suspendisse pellentesque. Quam fusce nec enim turpis nisl. Ac nec dictumst aliquet vivamus vel orci.
                            </p>
                        </>
                    }
                    align="left"
                />
            </div>

            <div className="btns">

                <div className="btn-b">
                    <Button 
                    text="back" 
                    variant="dark"
                    onClick={() => navigate("/WaiverAcceptance")}  
                     />
                </div>

                <div className="btn-r">
                    <Button 
                    text="next" 
                    variant="primary"
                    onClick={() => navigate("/enrolment-package")}  
                     />
                </div>

            </div>

        </div>
    )
}