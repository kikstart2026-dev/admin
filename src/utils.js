import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./utils.scss"

const config = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const handleError = (message) => {
  
    toast.error(
    <div className="toast-content">
      {/* <span>❌</span> */}
      <p className="error_P">{message}</p>
    </div>,
    {...config, className: "toast-error" }
    );
  
};

export const handleSuccess = (message) => {
  toast.success(
    <div className="toast-content">
      {/* <span>🎉</span> */}
      <p className="success_p">{message}</p>
    </div>,
    { ...config, className: "toast-success" }
  );
};


export const handleConfirm = (message, onConfirm) => {
  toast.warning(
    ({ closeToast }) => (
      <div className="toast-content">
      
        {/* <span>⚠️</span> */}

        <p className="confirm_p">{message}</p>

        <div className="confirm-actions">
          <button
            className="btn-confirm"
            onClick={async () => {
              await onConfirm();   
              closeToast();
            }}
          >
            Yes
          </button>

          <button className="btn-cancel" onClick={closeToast}>
            Cancel
          </button>
        </div>
      </div>
      
    ),
    { ...config, className: "toast-confirm" }

    // {
    //   position: "top-center",
    //   autoClose: false,   // ❗ must (user click না করা পর্যন্ত থাকবে)
    //   closeOnClick: false,
    //   draggable: false,
       
    // }
  );
};


// export const handleAuth = (message) => {
//   toast.success(
//     <div className="toast-content">
//       <span>🎉</span>
//       <p>{message}</p>
//     </div>,
//     { ...config, className: "toast-success" }
//   );
// };

export const ApiUrl = process.env.REACT_APP_BASE_URL;