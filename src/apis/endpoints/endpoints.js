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

  createWhyChooseUs: "/why-choose-us/create",
  getAllWhyChooseUs: "/why-choose-us",
  getWhyChooseUsById: (id) => `/why-choose-us/${id}`,
  updateWhyChooseUs: (id) => `/why-choose-us/${id}`,
  singleDeleteWhyChooseUs: (id) => `/why-choose-us/${id}`,
  selectiveDeleteWhyChooseUs: "/why-choose-us/select/delete",
  multipleDeleteWhyChooseUs: "/why-choose-us/delete/all",

  // service------------------------------------>>

  createService: "/service/create",
  getAllService: "/service/",
  getServiceById: (id) => `/service/${id}`,
  updateService: (id) => `/service/${id}`,
  singleDeleteService: (id) => `/service/${id}`,
  selectiveDeleteService: "/service/select/delete",
  multipleDeleteService: "/service/delete/all",

  // About Section------------------------------------>>

createAboutSection: "admin/about/create",

getAllAboutSection: "admin/about",

getAboutSectionById: (id) => `admin/about/${id}`,

updateAboutSection: (id) => `admin/about/${id}`,

singleDeleteAboutSection: (id) => `admin/about/${id}`,

selectiveDeleteAboutSection: "admin/about/select/delete",

multipleDeleteAboutSection: "admin/about/delete/all",
  // testimonials------------------------------------>>

  createTest: "admin/testimonal/create",
  getAllTest: "admin/testimonal/",
  getTestById: (id) => `admin/testimonal/${id}`,
  updateTest: (id) => `admin/testimonal/update/${id}`,
  delSingleTest: (id) => `admin/testimonal/delete/${id}`,
  delSelectiveTest: "admin/testimonal/delete-selected",
  delAllTest: "admin/testimonal/delete-all",
};
