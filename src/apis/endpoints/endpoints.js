export const endpoints = {
  //Signup,login,otp-verify,reset-pass,etc------------------>>

  signUp: "/signup",
  login: "/login",
  verifyOtp: "/verify-otp",
  resendOtp: "/resendotp",
  forgotPass: "/forgot-password",
  reetPass: "/reset-password",
  logout: "/logout",
  googleAuth: "/google",

  // Enquiry---------------------->>

  createEnq: "/createEnq",

  // Contact---------------------->>

  contactUs: "/contact",

  // Heading-------------------------->>

  updateHeading: (id) => `headings/${id}`,
  createHeading: "headings/create",

  createFile: "/media/create",

  // Home Banner------------------------------------>>

  createHomeBanner: "admin/home-banner/create",
  getAllHomeBanner: "admin/home-banner",
  getHomeBannerById: (id) => `admin/home-banner/${id}`,
  updateHomeBanner: (id) => `admin/home-banner/${id}`,
  singleDeleteHomeBanner: (id) => `admin/home-banner/${id}`,
  selectiveDeleteHomeBanner: "admin/home-banner/select/delete",
  multipleDeleteHomeBanner: "admin/home-banner/delete/all",

  // ✅ ACTIVE BANNER
  toggleActiveBanner: (id) => `admin/home-banner/active/${id}`,

  // Why Choose Us------------------------------------>>

  createWhyChooseUs: "admin/why-choose-us/create",
  getAllWhyChooseUs: "admin/why-choose-us",
  getWhyChooseUsById: (id) => `admin/why-choose-us/${id}`,
  updateWhyChooseUs: (id) => `admin/why-choose-us/${id}`,
  singleDeleteWhyChooseUs: (id) => `admin/why-choose-us/${id}`,
  selectiveDeleteWhyChooseUs: "admin/why-choose-us/select/delete",
  multipleDeleteWhyChooseUs: "admin/why-choose-us/delete/all",

  // service------------------------------------>>

  createService: "admin/service/create",
  getAllService: "admin/service/",
  getServiceById: (id) => `admin/service/${id}`,
  updateService: (id) => `admin/service/${id}`,
  singleDeleteService: (id) => `admin/service/${id}`,
  selectiveDeleteService: "admin/service/select/delete",
  multipleDeleteService: "admin/service/delete/all",

  // ABOUT SECTION

  createAboutSection: "admin/about-us/create",
  getAllAboutSection: "admin/about-us",
  getAboutSectionById: (id) => `admin/about-us/${id}`,
  updateAboutSection: (id) => `admin/about-us/${id}`,
  singleDeleteAboutSection: (id) => `admin/about-us/${id}`,
  selectiveDeleteAboutSection: "admin/about-us/select/delete",
  multipleDeleteAboutSection: "admin/about-us/delete/all",

  // ACTIVE TOGGLE
  toggleActiveAboutSection: (id) => `admin/about-us/active/${id}`,
  // testimonials------------------------------------>>

  createTest: "admin/testimonal/create",
  getAllTest: "admin/testimonal/",
  getTestById: (id) => `admin/testimonal/${id}`,
  updateTest: (id) => `admin/testimonal/update/${id}`,
  delSingleTest: (id) => `admin/testimonal/delete/${id}`,
  delSelectiveTest: "admin/testimonal/delete-selected",
  delAllTest: "admin/testimonal/delete-all",

  // FAQ------------------------------------>>

  createFaq: "/admin/faq/create",

  getFaqs: "/admin/faq",

  getSingleFaq: (id) => `/admin/faq/${id}`,

  updateFaq: (id) => `/admin/faq/${id}`,

  deleteFaq: (id) => `/admin/faq/${id}`,

  // 🔥 TOGGLE ACTIVE
  toggleFaq: (id) => `/admin/faq/toggle/${id}`,

  // 🔥 BULK DELETE
  deleteSelectedFaq: "/admin/faq/delete-selected",

  // 🔥 DELETE ALL
  deleteAllFaq: "/admin/faq/delete-all",

  // ================================
  // Schools Admin APIs
  // ================================

  //  GET ALL
  getSchools: "admin/schools/",

  //  GET BY ID
  getSchoolById: (id) => `admin/schools/${id}`,

  //  CREATE
  createSchool: "admin/schools/create",

  //  UPDATE
  updateSchool: (id) => `admin/schools/${id}`,

  //  DELETE BY ID
  deleteSchool: (id) => `admin/schools/${id}`,

  //  DELETE ALL
  deleteAllSchools: "admin/schools/",

  //  DELETE SELECTED
  deleteSelectedSchools: "admin/schools/delete-selected",

  // Admin Auth -------------------------------------->>>

  adminLogin: "admin/login",
  adminVerifyOtp: "admin/verify-otp",
  adminResendOtp: "admin/resend-otp",
  adminForgotPass: "admin/forgot-password",
  adminResetPass: "admin/reset-password",
  adminLogout: "admin/logout",
  adminGoogleAuth: "/admin/google",

  // protected
  getUsers: "admin/users",
  deleteAllUsers: "api/admin/users/delete-all",
  deleteMultipleUsers: "admin/users/delete-multiple",

  // USER MANAGEMENT ---------------------->>

  createSubAdmin: "admin/emp",
  getAllSubAdmins: "admin/emp",
  getSubAdminById: (id) => `admin/emp/${id}`,
  deleteSubAdmin: (id) => `admin/emp/${id}`,
  assignDynamicRole: (id) => `admin/emp/assign-role/${id}`,
  exportSubAdminsCSV: "admin/emp/export-csv",

  // ================================
  // PERMISSION MANAGEMENT
  // ================================

  createPermission: "/admin/permission",
  getAllPermissions: "/admin/permission",
  getSingle: "/admin/permission/single",
  // getModules: "admin/permission/modules",
  getPermissionsByRole: (dynamicRole) =>
    `/admin/permission/role/${dynamicRole}`,
  updatePermission: (id) => `/admin/permission/${id}`,
  deletePermission: (id) => `/admin/permission/${id}`,

  // 🔥 BULK SAVE (MAIN FEATURE)
  savePermissions: "/admin/permission/save",

  // ROLE MANAGEMENT ---------------------->>

  getAllRoles: "admin/roles",
  createRole: "admin/roles",
  updateRole: (id) => `admin/roles/${id}`,
  deleteRole: (id) => `admin/roles/${id}`,

  // ================================
  //  USERS
  // ================================
  getAllUsers: "admin/users/",
  deleteUser: (id) => `admin/users/${id}`,

  // PAYMENT ---------------------->
  payment: "/kikPayment",
  getAllPayments: "subscription-payment/all-payments",
  exportPaymentsCSV: "subscription-payment/export-CSV",


  // REVENUE
  getMonthlyPlanRevenue:
    "/subscription-payment/monthly-plan-revenue",

  // SUBSCRIPTION --------------------------------------->>

  getAllPlans: "/subscription/all",

  getSinglePlan: (id) => `/subscription/single/${id}`,



  createCoach: "admin/coach/create",
  getAllCoaches: "admin/coach",
  getCoachById: (id) => `admin/coach/${id}`,
  deleteCoach: (id) => `admin/coach/${id}`,
  exportCoachesCSV: "admin/coach/export",
  assignProgramsToCoach: (id) => `admin/coach/assign-programs/${id}`,

  // ================================
// CHILD MANAGEMENT
// ================================

getAllChild: "/children/getAllChild",

getChildById: (id) => `/children/getChildById/${id}`,

deleteChild: (id) => `/children/deleteChild/${id}`,

deleteAllChild: "/children/deleteAllChild",

updateChild: (id) => `/children/updateChild/${id}`,

createChild: "/children/createChild",
};


