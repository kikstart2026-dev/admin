import { axiosInstance } from "../Helper/Helper";
import { endpoints } from "./endpoints/endpoints";

export const signUp = async (payload) => {
    const res = await axiosInstance.post(endpoints.signUp, payload);
    return res.data;
};

export const login = async (payload) => {
    const res = await axiosInstance.post(endpoints.login, payload);
    return res.data;
};

export const forgotPass = async (payload) => {
    const res = await axiosInstance.post(endpoints.forgotPass, payload);
    return res.data;
};

export const reetPass = async (payload) => {
    const res = await axiosInstance.post(endpoints.reetPass, payload);
    return res.data;
};

export const verifyOtp = async (payload) => {
    const res = await axiosInstance.post(endpoints.verifyOtp, payload);
    return res.data;
};

export const resendOtp = async (payload) => {
    const res = await axiosInstance.post(endpoints.resendOtp, payload);
    return res.data;
};

export const logoutUser = async (payload) => {
    const res = await axiosInstance.post(endpoints.logout, payload);
    return res.data;
};

export const googleAuth = async (payload) => {
    const res = await axiosInstance.post(endpoints.googleAuth, payload);
    return res.data;
};



export const contactUs = async (payload) => {
    const res = await axiosInstance.post(endpoints.contactUs, payload);
    return res.data;
};

export const createEnq = async (payload) => {
    const res = await axiosInstance.post(endpoints.createEnq, payload);
    return res.data;
};


// heading------------------------>

// ✅ Create 
export const createHeading = async (payload) => {
    const res = await axiosInstance.post(endpoints.createHeading, payload);
    return res.data;
};

export const updateHeading = async (id, payload) => {
    const res = await axiosInstance.put(
        endpoints.updateHeading(id),
        payload
    );
    return res.data;
};




// allmedia create----------------->
export const createFile = async (payload) => {
    const res = await axiosInstance.post(
        endpoints.createFile,
        payload,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return res.data;
};

/* ================================
    Home Banner APIs
================================ */

// ✅ Create 
export const createHomeBanner = async (payload) => {
    const res = await axiosInstance.post(endpoints.createHomeBanner, payload);
    return res.data;
};

// ✅ Get All
export const getAllHomeBanner = async () => {
    const res = await axiosInstance.get(endpoints.getAllHomeBanner);
    return res.data;
};

// ✅ Get By ID
export const getHomeBannerById = async (id) => {
    const res = await axiosInstance.get(endpoints.getHomeBannerById(id));
    return res.data;
};

// ✅ Update 
export const updateHomeBanner = async (id, payload) => {
    const res = await axiosInstance.put(
        endpoints.updateHomeBanner(id), payload);
    return res.data;
};

// ✅ Delete Single
export const singleDeleteHomeBanner = async (id) => {
    const res = await axiosInstance.delete(endpoints.singleDeleteHomeBanner(id));
    return res.data;
};

// ✅ Delete Selective
export const selectiveDeleteHomeBanner = async (payload) => {
    const res = await axiosInstance.delete(endpoints.selectiveDeleteHomeBanner, {
        data: payload,
    });
    return res.data;
};

// ✅ Delete All
export const multipleDeleteHomeBanner = async () => {
    const res = await axiosInstance.delete(endpoints.multipleDeleteHomeBanner);
    return res.data;
};

// ✅ Toggle Active Banner
export const toggleActiveBanner = async (id) => {
    const res = await axiosInstance.put(
        endpoints.toggleActiveBanner(id)
    );
    return res.data;
};

/* ================================
    Why Choose Us APIs
================================ */

// ✅ Create
export const createWhyChooseUs = async (payload) => {
    const res = await axiosInstance.post(
        endpoints.createWhyChooseUs,
        payload
    );
    return res.data;
};

// ✅ Get All 
export const getAllWhyChooseUs = async (params) => {
  const res = await axiosInstance.get(endpoints.getAllWhyChooseUs, {
    params,   // ✅ THIS LINE IS THE FIX
  });
  return res.data;
};

// ✅ Get By ID
export const getWhyChooseUsById = async (id) => {
    const res = await axiosInstance.get(
        endpoints.getHomeBannerById(id)
    );
    return res.data;
};

// ✅ Update
export const updateWhyChooseUs = async (id, payload) => {
    const res = await axiosInstance.put(
        endpoints.updateWhyChooseUs(id),
        payload
    );
    return res.data;
};

// ✅ Selective Delete 
export const selectiveDeleteWhyChooseUs = async (payload) => {
    const res = await axiosInstance.delete(
        endpoints.selectiveDeleteWhyChooseUs,
        { data: payload }
    );
    return res.data;
};

// ✅ Single Delete
export const singleDeleteWhyChooseUs = async (id) => {
    const res = await axiosInstance.delete(
        endpoints.singleDeleteWhyChooseUs(id)
    );
    return res.data;
};

// ✅ Delete All
export const multipleDeleteWhyChooseUs = async () => {
    const res = await axiosInstance.delete(
        endpoints.multipleDeleteWhyChooseUs
    );
    return res.data;
};
/* ================================ Service APIs ================================ */
// ✅ Create Service
export const createService = async (payload) => {
    const res = await axiosInstance.post(endpoints.createService, payload);
    return res.data;
};
// ✅ Get All services - Ekhane limit 1000 kora hoyeche sob data anar jonno
export const getAllService = async (page = 1, limit = 1000) => {
    const url = `${endpoints.getAllService}?page=${page}&limit=${limit}`;
    const res = await axiosInstance.get(url);
    return res.data;
};
// ✅ Get sevice By ID
export const getServiceById = async (id) => {
    const res = await axiosInstance.get(endpoints.getServiceById(id));
    return res.data;
};
// ✅ Update service
export const updateService = async (id, payload) => {
    const res = await axiosInstance.put(endpoints.updateService(id), payload);
    return res.data;
};
// ✅ Delete Single
export const singleDeleteService = async (id) => {
    const res = await axiosInstance.delete(endpoints.singleDeleteService(id));
    return res.data;
};
// ✅ Delete Selective
export const selectiveDeleteService = async (payload) => {
    const res = await axiosInstance.delete(endpoints.selectiveDeleteService, {
        data: payload,
    });
    return res.data;
};
// ✅ Delete All
export const multipleDeleteService = async () => {
    const res = await axiosInstance.delete(endpoints.multipleDeleteService);
    return res.data;
};


/* ==================================================
   ABOUT SECTION APIs
====================================================== */

// CREATE
export const createAboutSection = async (payload) => {

  const res = await axiosInstance.post(
    endpoints.createAboutSection,
    payload
  );

  return res.data;
};


// GET ALL
export const getAllAboutSection = async () => {
  const res = await axiosInstance.get(endpoints.getAllAboutSection);
  return res.data;
};


// GET BY ID
export const getAboutUsById = async (id) => {

  const res = await axiosInstance.get(
    endpoints.getAboutSectionById(id)
  );

  return res.data;
};


// UPDATE
export const updateAboutSection = async (id, payload) => {

  const res = await axiosInstance.put(
    endpoints.updateAboutSection(id),
    payload
  );

  return res.data;
};


// DELETE SINGLE
export const singleDeleteAboutSection = async (id) => {

  const res = await axiosInstance.delete(
    endpoints.singleDeleteAboutSection(id)
  );

  return res.data;
};


// DELETE SELECTIVE
export const selectiveDeleteAboutSection = async (payload) => {

  const res = await axiosInstance.delete(
    endpoints.selectiveDeleteAboutSection,
    {
      data: payload
    }
  );

  return res.data;
};


// DELETE ALL
export const multipleDeleteAboutUsSection = async () => {

  const res = await axiosInstance.delete(
    endpoints.multipleDeleteAboutSection
  );

  return res.data;
};


// ACTIVE TOGGLE
export const toggleActiveAboutSection = async (id) => {

  const res = await axiosInstance.put(
    endpoints.toggleActiveAboutSection(id)
  );

  return res.data;
};
/* ================================ Testimonails APIs ================================ */

// ✅ Create Service
export const createTest = async (payload) => {
    const res = await axiosInstance.post(endpoints.createTest, payload);
    return res.data;
};

// ✅ Get All services
export const getAllTest = async () => {
    const res = await axiosInstance.get(endpoints.getAllTest);
    return res.data;
};

// ✅ Get sevice By ID
export const getTestById = async (id) => {
    const res = await axiosInstance.get(endpoints.getTestById(id));
    return res.data;
};

// ✅ Update service
export const updateTest = async (id, payload) => {
    const res = await axiosInstance.put(endpoints.updateTest(id), payload);
    return res.data;
};

// ✅ Delete Single
export const delSingleTest = async (id) => {
    const res = await axiosInstance.delete(endpoints.delSingleTest(id));
    return res.data;
};

// ✅ Delete Selective
export const delSelectiveTest = async (payload) => {
    const res = await axiosInstance.delete(endpoints.delSelectiveTest, {
        data: payload,
    });
    return res.data;
};

// ✅ Delete All
export const delAllTest = async () => {
    const res = await axiosInstance.delete(endpoints.delAllTest);
    return res.data;
};

/* ================================ FAQ APIs ================================ */


// ==========================
// ✅ CREATE FAQ
// ==========================
export const createFaq = async (payload) => {
  const res = await axiosInstance.post(endpoints.createFaq, payload);
  return res.data;
};

// ==========================
// ✅ GET ALL FAQs
// ==========================
export const getFaqs = async (page = 1, limit = 5, active = false) => {
  let url = `${endpoints.getFaqs}?page=${page}&limit=${limit}`;

  if (active) {
    url += `&active=true`;
  }

  const res = await axiosInstance.get(url);
  return res.data;
};

// ==========================
// ✅ GET SINGLE FAQ
// ==========================
export const getSingleFaq = async (id) => {
  const res = await axiosInstance.get(endpoints.getSingleFaq(id));
  return res.data;
};

// ==========================
// ✅ UPDATE FAQ
// ==========================
export const updateFaq = async (id, payload) => {
  const res = await axiosInstance.put(endpoints.updateFaq(id), payload);
  return res.data;
};

// ==========================
// ✅ TOGGLE ACTIVE FAQ 🔥
// ==========================
export const toggleActiveFaq = async (id) => {
  const res = await axiosInstance.patch(endpoints.toggleFaq(id));
  return res.data;
};

// ==========================
// ✅ DELETE SINGLE FAQ
// ==========================
export const deleteFaq = async (id) => {
  const res = await axiosInstance.delete(endpoints.deleteFaq(id));
  return res.data;
};

// ==========================
// ✅ SELECTIVE DELETE FAQ
// ==========================
export const selectiveDeleteFaq = async (payload) => {
  const res = await axiosInstance.post(
    endpoints.deleteSelectedFaq,
    payload
  );
  return res.data;
};

// ==========================
// ✅ DELETE ALL FAQ
// ==========================
export const deleteAllFaq = async () => {
  const res = await axiosInstance.delete(endpoints.deleteAllFaq);
  return res.data;
};

/* ================================ 
   Schools APIs 
================================ */


// ==========================
// ✅ CREATE SCHOOL
// ==========================
export const createSchool = async (payload) => {
  const res = await axiosInstance.post(
    endpoints.createSchool,
    payload
  );
  return res.data;
};


// ==========================
// ✅ GET ALL SCHOOLS
// ==========================
export const getSchools = async (page = 1, limit = 1000) => {
  const url = `${endpoints.getSchools}?page=${page}&limit=${limit}`;
  const res = await axiosInstance.get(url);
  return res.data; // ✅ FULL RESPONSE return করো
};

// ==========================
// ✅ GET SINGLE SCHOOL
// ==========================
export const getSingleSchool = async (id) => {
  const res = await axiosInstance.get(
    endpoints.getSchoolById(id)
  );
  return res.data;
};


// ==========================
// ✅ UPDATE SCHOOL
// ==========================
export const updateSchool = async (id, payload) => {
  const res = await axiosInstance.put(
    endpoints.updateSchool(id),
    payload
  );
  return res.data;
};


// ==========================
// ✅ DELETE SINGLE SCHOOL
// ==========================
export const deleteSchool = async (id) => {
  const res = await axiosInstance.delete(
    endpoints.deleteSchool(id)
  );
  return res.data;
};


// ==========================
// ✅ SELECTIVE DELETE SCHOOL
// ==========================
export const selectiveDeleteSchool = async (payload) => {
  const res = await axiosInstance.post(
    endpoints.deleteSelectedSchools,
    payload
  );
  return res.data;
};


// ==========================
// ✅ DELETE ALL SCHOOLS
// ==========================
export const deleteAllSchools = async () => {
  const res = await axiosInstance.delete(
    endpoints.deleteAllSchools
  );
  return res.data;
};



//Admin Auth--------------------------------->>

// ================= ADMIN AUTH =================

// 🔐 LOGIN
export const adminLogin = async (payload) => {
  const res = await axiosInstance.post(endpoints.adminLogin, payload);
  return res.data;
};

// 🔢 VERIFY OTP
export const adminVerifyOtp = async (payload) => {
  const res = await axiosInstance.post(endpoints.adminVerifyOtp, payload);
  return res.data;
};

// 🔁 RESEND OTP
export const adminResendOtp = async (payload) => {
  const res = await axiosInstance.post(endpoints.adminResendOtp, payload);
  return res.data;
};

// 🔑 FORGOT PASSWORD
export const adminForgotPass = async (payload) => {
  const res = await axiosInstance.post(endpoints.adminForgotPass, payload);
  return res.data;
};

// 🔄 RESET PASSWORD
export const adminResetPass = async (payload) => {
  const res = await axiosInstance.post(endpoints.adminResetPass, payload);
  return res.data;
};

// 🚪 LOGOUT
export const adminLogout = async (payload) => {
  const res = await axiosInstance.post(endpoints.adminLogout, payload);
  return res.data;
};

export const adminGoogleAuth = async (payload) => {
  const res = await axiosInstance.post(
    endpoints.adminGoogleAuth,
    payload
  );
  return res.data;
};



// // 👥 GET USERS
// export const getAllUsers = async () => {
//   const res = await axiosInstance.get(endpoints.getUsers);
//   return res.data;
// };

// // ❌ DELETE ALL
// export const deleteAllUsers = async () => {
//   const res = await axiosInstance.delete(endpoints.deleteAllUsers);
//   return res.data;
// };

// // ❌ DELETE MULTIPLE
// export const deleteMultipleUsers = async (userIds) => {
//   const res = await axiosInstance.delete(
//     endpoints.deleteMultipleUsers,
//     { data: { userIds } }
//   );
//   return res.data;
// };



// ================= USER MANAGEMENT =================

// ✅ CREATE
export const createSubAdmin = async (payload) => {
  const res = await axiosInstance.post(endpoints.createSubAdmin, payload);
  return res.data;
};

// // ✅ GET ALL
// export const getAllSubAdmins = async () => {
//   const res = await axiosInstance.get(endpoints.getAllSubAdmins);
//   return res.data;
// };


export const getAllSubAdmins = async (params) => {
  const res = await axiosInstance.get(endpoints.getAllSubAdmins, {
    params,   // ✅ THIS LINE IS THE FIX
  });
  return res.data;
};

// ✅ GET BY ID
export const getSubAdminById = async (id) => {
  const res = await axiosInstance.get(endpoints.getSubAdminById(id));
  return res.data;
};


// ✅ DELETE
export const deleteSubAdmin = async (id) => {
  const res = await axiosInstance.delete(
    endpoints.deleteSubAdmin(id)
  );
  return res.data;
};

// ✅ ASSIGN ROLE
export const assignDynamicRole = async (id, payload) => {
  const res = await axiosInstance.put(
    endpoints.assignDynamicRole(id),
    payload
  );
  return res.data;
};



// ================= PERMISSIONS =================

// 🔥 CREATE SINGLE PERMISSION
export const createPermission = async (payload) => {
  const res = await axiosInstance.post(
    endpoints.createPermission,
    payload
  );
  return res.data;
};

// 🔥 GET ALL PERMISSIONS
export const getAllPermissions = async () => {
  const res = await axiosInstance.get(
    endpoints.getAllPermissions
  );
  return res.data;
};

// 🔥 GET BY ROLE
export const getPermissionsByRole = async (dynamicRole) => {
  const res = await axiosInstance.get(
    endpoints.getPermissionsByRole(dynamicRole)
  );
  return res.data;
};

// 🔥 GET BY SINGLE
export const getSingle = async (payload ) => {
  const res = await axiosInstance.post(
    endpoints.getSingle, 
    payload
  );
  return res.data;
};

// 🔥 UPDATE PERMISSION
export const updatePermission = async (id, payload) => {
  const res = await axiosInstance.put(
    endpoints.updatePermission(id),
    payload
  );
  return res.data;
};

// 🔥 DELETE PERMISSION
export const deletePermission = async (id) => {
  const res = await axiosInstance.delete(
    endpoints.deletePermission(id)
  );
  return res.data;
};

// get modules
// export const getModules = async () => {
//   const res = await axiosInstance.get(endpoints.getModules);
//   return res.data;
// };


// 🔥 BULK SAVE PERMISSIONS (MAIN FEATURE)
export const savePermissions = async (payload) => {
  try {
    const res = await axiosInstance.post(
      endpoints.savePermissions,
      payload
    );
    return res.data;
  } catch (err) {
    console.log("SAVE API ERROR:", err?.response?.data || err);
    throw err;
  }
};

// ================ ROLE ================================
//CREATE
export const createRole = async (data) => {
    const res = await axiosInstance.post(endpoints.createRole, data);
    return res.data;
};

//GET
export const getAllRoles = async () => {
    const res = await axiosInstance.get(endpoints.getAllRoles);
    return res.data;
};




// ✅ GET ALL USERS
export const getAllUsers = async () => {
  const res = await axiosInstance.get(endpoints.getAllUsers);
  return res.data;
};

// ✅ DELETE USER
export const deleteUser = async (id) => {
  const res = await axiosInstance.delete(endpoints.deleteUser(id));
    return res.data;
};