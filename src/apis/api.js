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
export const getAllWhyChooseUs = async () => {
    const res = await axiosInstance.get(endpoints.getAllWhyChooseUs);
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
// ✅ Get All services
export const getAllService = async () => {
    const res = await axiosInstance.get(endpoints.getAllService);
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
