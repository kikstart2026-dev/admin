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

  createHomeBanner: "/home-banner/create",
  getAllHomeBanner: "/home-banner",
  getHomeBannerById: (id) => `/home-banner/${id}`,
  updateHomeBanner: (id) => `/home-banner/${id}`,
  singleDeleteHomeBanner: (id) => `/home-banner/${id}`,
  selectiveDeleteHomeBanner: "/home-banner/select/delete",
  multipleDeleteHomeBanner: "/home-banner/delete/all",


  // ✅ ACTIVE BANNER
toggleActiveBanner: (id) => `/home-banner/active/${id}`,

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
};
