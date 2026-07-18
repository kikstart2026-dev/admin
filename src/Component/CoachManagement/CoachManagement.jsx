import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCoach,
  getAllCoaches,
  getCoachById,
  deleteCoach,
  exportCoachesCSV,
  assignProgramsToCoach,
  getAllService,
} from "../../apis/api";

import styles from "./CoachManagement.module.scss";

const CoachManagement = () => {
  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = useState(false);

  const [viewModal, setViewModal] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [assignLoading, setAssignLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 5;

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    location: "",
  });



  const [selectedCoachId, setSelectedCoachId] = useState("");

  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [openAssignId, setOpenAssignId] = useState(null);

  const {
    data: coachesData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [
      "coaches",
      page,
      search,
      sortBy,
      sortOrder,
    ],

    queryFn: () =>
      getAllCoaches({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      }),

    placeholderData: (previousData) => previousData,
  });

  const { data: servicesData } = useQuery({
    queryKey: ["services"],
    queryFn: () => getAllService(),
  });

  const services = servicesData?.data || [];

  const coaches = coachesData?.data || [];

  const totalPages = coachesData?.totalPages || 1;

  // ===========================
  // CREATE COACH
  // ===========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createCoach(form);

      queryClient.invalidateQueries({
        queryKey: ["coaches"],
      });

      setForm({
        fullname: "",
        email: "",
        phone: "",
        location: "",
      });

      setOpenModal(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // VIEW
  // ===========================

  const handleView = async (id) => {
    try {
      const res = await getCoachById(id);

      setSelectedCoach(res.data);

      setViewModal(true);
    } catch (err) {
      console.log(err);
    }
  };

  // ===========================
  // DELETE
  // ===========================

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);

      await deleteCoach(deleteId);

      queryClient.invalidateQueries({
        queryKey: ["coaches"],
      });

      setDeleteModal(false);
    } catch (err) {
      console.log(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAssign = async () => {
    try {
      setAssignLoading(true);

      await assignProgramsToCoach(selectedCoachId, {
        programIds: selectedPrograms,
      });

      queryClient.invalidateQueries({
        queryKey: ["coaches"],
      });

      setOpenAssignId(null);
      setSelectedPrograms([]);
      setSelectedCoachId("");

    } catch (err) {
      console.log(err);
    } finally {
      setAssignLoading(false);
    }
  };

  // ===========================
  // EXPORT CSV
  // ===========================

  const handleExportCSV = async () => {
    try {
      const blob = await exportCoachesCSV();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = "coaches.csv";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
    }
  };

  // ===========================
  // LOCK BODY
  // ===========================

  useEffect(() => {
    if (
      openModal ||
      viewModal ||
      deleteModal
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [
    openModal,
    viewModal,
    deleteModal,
  ]);


  return (
    <div className={styles.wrap}>

      {/* HEADER */}

      <div className={styles.header}>

        <h2>Coach Management</h2>

        <div className={styles.allBtn}>

          <button
            onClick={() => setOpenModal(true)}
            className={styles.addBtn}
          >
            + Add New Coach
          </button>

          <button
            onClick={handleExportCSV}
            className={styles.exportBtn}
          >
            <i className="bi bi-download"></i>
            Export CSV
          </button>

        </div>

      </div>

      {/* FILTER BAR */}

      <div className={styles.filterBar}>

        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by name, email, phone..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <select
          className={styles.filterSelect}
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {

            const [field, order] =
              e.target.value.split("-");

            setSortBy(field);
            setSortOrder(order);

          }}
        >

          <option value="createdAt-desc">
            Newest First
          </option>

          <option value="createdAt-asc">
            Oldest First
          </option>

          <option value="fullname-asc">
            Name A-Z
          </option>

          <option value="fullname-desc">
            Name Z-A
          </option>

          <option value="location-asc">
            Location A-Z
          </option>

          <option value="location-desc">
            Location Z-A
          </option>

        </select>

      </div>

      {/* TABLE */}

      <table className={styles.table}>

        <thead className={styles.thead}>

          <tr>

            <th>Coach</th>

            <th>Email</th>

            <th>Phone</th>

            <th>Location</th>

            <th>Assign</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {isLoading || isFetching ? (

            <tr>
              <td colSpan="5" align="center">
                Loading...
              </td>
            </tr>

          ) : coaches.length === 0 ? (

            <tr>
              <td colSpan="5" align="center">
                No Coach Found
              </td>
            </tr>

          ) : (

            coaches.map((coach) => (

              <React.Fragment key={coach._id}>

                <tr className={styles.row}>

                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.avatar}>
                        <i className={`bi bi-person-fill ${styles.person}`}></i>
                      </div>

                      {coach.fullname}
                    </div>
                  </td>

                  <td>{coach.email}</td>

                  <td>{coach.phone}</td>

                  <td>{coach.location}</td>

                 <td className={styles.assignColumn}>

  <div className={styles.assignWrapper}>

    <i
      className={`bi ${
        openAssignId === coach._id
          ? "bi-chevron-up"
          : "bi-chevron-down"
      } ${styles.assign}`}
      onClick={async () => {

        try {

          if (openAssignId === coach._id) {
            setOpenAssignId(null);
            return;
          }

          const res = await getCoachById(coach._id);

          setSelectedCoachId(coach._id);

          setSelectedPrograms(
            res.data.programs?.map((p) => p._id) || []
          );

          setOpenAssignId(coach._id);

        } catch (err) {
          console.log(err);
        }

      }}
    ></i>


    <span className={styles.programBadge}>
      {coach.programs?.length || 0} Assigned
    </span>


  </div>

</td>

                  

                  <td className={styles.actions}>

                    <i
                      className={`bi bi-eye ${styles.view}`}
                      onClick={() => handleView(coach._id)}
                    ></i>

                    <i
                      className={`bi bi-trash ${styles.delete}`}
                      onClick={() => handleDelete(coach._id)}
                    ></i>

                  </td>

                </tr>

                {openAssignId === coach._id && (
                  <tr>
                    <td colSpan="6">

                      <div className={styles.assignDropdown}>

                        {services.map((service) => (

                          <label
                            key={service._id}
                            className={styles.checkboxItem}
                          >
                            <input
                              type="checkbox"
                              checked={selectedPrograms.includes(service._id)}
                              onChange={(e) => {

                                if (e.target.checked) {

                                  setSelectedPrograms((prev) => [
                                    ...prev,
                                    service._id,
                                  ]);

                                } else {

                                  setSelectedPrograms((prev) =>
                                    prev.filter(
                                      (id) => id !== service._id
                                    )
                                  );

                                }

                              }}
                            />

                            {service.title}

                          </label>

                        ))}

                        <button
                          className={styles.submitBtn}
                          onClick={handleAssign}
                          disabled={assignLoading}
                        >
                          {assignLoading ? "Saving..." : "Save"}
                        </button>

                      </div>

                    </td>
                  </tr>
                )}

              </React.Fragment>

            ))

          )}

        </tbody>

      </table>

      {/* PAGINATION */}

      <nav className="mt-4">

        <ul
          className={`pagination justify-content-center ${styles.customPagination}`}
        >

          <li
            className={`page-item ${page === 1 ? "disabled" : ""}`}
          >

            <button
              className="page-link arrow"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              &lt;
            </button>

          </li>

          {Array.from(
            {
              length: totalPages,
            },
            (_, i) => i + 1
          ).map((num) => (

            <li
              key={num}
              className={`page-item ${page === num ? "active" : ""}`}
            >

              <button
                className={`page-link ${page === num ? "num" : ""}`}
                onClick={() => setPage(num)}
              >
                {num}
              </button>

            </li>

          ))}

          <li
            className={`page-item ${page === totalPages ? "disabled" : ""}`}
          >

            <button
              className="page-link arrow"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              &gt;
            </button>

          </li>

        </ul>

      </nav>

      {/* ================= CREATE COACH MODAL ================= */}

      {openModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>

            <h3 className={styles.modalTitle}>
              Create Coach
            </h3>

            <form
              className={styles.form}
              onSubmit={handleSubmit}
            >

              <input
                className={styles.input}
                placeholder="Full Name"
                value={form.fullname}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fullname: e.target.value,
                  })
                }
                required
              />

              <input
                className={styles.input}
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                required
              />

              <input
                className={styles.input}
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
                required
              />

              <input
                className={styles.input}
                placeholder="Location"
                value={form.location}
                onChange={(e) =>
                  setForm({
                    ...form,
                    location: e.target.value,
                  })
                }
                required
              />

              <div className={styles.modalActions}>

                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={styles.submitBtn}
                >
                  {loading
                    ? "Creating..."
                    : "Create Coach"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= VIEW MODAL ================= */}

      {viewModal && selectedCoach && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>

            <h3 className={styles.modalTitle}>
              Coach Details
            </h3>

            <div className={styles.modalInfo}>

              <p>
                <b>Name :</b>{" "}
                {selectedCoach.fullname}
              </p>

              <p>
                <b>Email :</b>{" "}
                {selectedCoach.email}
              </p>

              <p>
                <b>Phone :</b>{" "}
                {selectedCoach.phone || "-"}
              </p>

              <p>
                <b>Location :</b>{" "}
                {selectedCoach.location || "-"}
              </p>

              <p>
                <b>Role :</b>{" "}
                {selectedCoach.role}
              </p>

              <p>
                <b>Programs :</b>{" "}
                {selectedCoach.programs?.length
                  ? selectedCoach.programs
                    .map((program) => program.title)
                    .join(", ")
                  : "No Program Assigned"}
              </p>

              <p>
                <b>Created :</b>{" "}
                {new Date(
                  selectedCoach.createdAt
                ).toLocaleDateString()}
              </p>

            </div>

            <div className={styles.modalAaction2}>

              <button
                className={styles.cancelBtn2}
                onClick={() =>
                  setViewModal(false)
                }
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}

      {deleteModal && (
        <div className={styles.modalOverlay}>

          <div className={styles.deleteModal}>

            <div className={styles.deleteIcon}>
              <i className="bi bi-person-dash"></i>
            </div>

            <h3 className={styles.deleteTitle}>
              Are you sure you want to delete this coach?
            </h3>

            <div className={styles.deleteActions}>

              <button
                className={styles.cancelBtn}
                onClick={() =>
                  setDeleteModal(false)
                }
              >
                Cancel
              </button>

              <button
                className={styles.submitBtn}
                onClick={confirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading
                  ? "Deleting..."
                  : "Confirm"}
              </button>

            </div>

          </div>

        </div>
      )}



    </div>
  );
};

export default CoachManagement;