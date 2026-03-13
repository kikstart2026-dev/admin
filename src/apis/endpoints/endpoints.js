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

  updateHeading: (id) => `/${id}`,
  createHeading: "/create",


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

  
  // testimonials------------------------------------>>

  createTest: "admin/testimonal/create",
  getAllTest: "admin/testimonal/",
  getTestById: (id) => `admin/testimonal/${id}`,
  updateTest: (id) => `admin/testimonal/update/${id}`,
  delSingleTest: (id) => `admin/testimonal/delete/${id}`,
  delSelectiveTest: "admin/testimonal/delete-selected",
  delAllTest: "admin/testimonal/delete-all",
};
