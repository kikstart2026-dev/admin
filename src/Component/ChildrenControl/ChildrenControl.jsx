import React, {
  useMemo,
  useState,
} from "react";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import styles from "./ChildrenControl.module.scss";

import {
  getAllChild,
  deleteChild,
} from "../../apis/api";

export default function ChildrenControl() {
  const queryClient = useQueryClient();

  // ===========================
  // SEARCH
  // ===========================

  const [search, setSearch] =
    useState("");

  // ===========================
  // PAGINATION
  // ===========================

  const [page, setPage] =
    useState(1);

  const [limit, setLimit] =
    useState(10);

  // ===========================
  // SORT
  // ===========================

  const [sortBy, setSortBy] =
    useState("createdAt");

  const [order, setOrder] =
    useState("desc");

  // ===========================
  // FILTERS
  // ===========================

  const [foodHabit, setFoodHabit] =
    useState("");

  const [allergy, setAllergy] =
    useState("");

  const [
    prolongDisease,
    setProlongDisease,
  ] = useState("");

  const [minAge, setMinAge] =
    useState("");

  const [maxAge, setMaxAge] =
    useState("");

  const [coach, setCoach] =
    useState("");

  const [program, setProgram] =
    useState("");

  // ===========================
  // VIEW MODAL
  // ===========================

  const [
    selectedChild,
    setSelectedChild,
  ] = useState(null);

  // ===========================
  // GET ALL CHILDREN
  // ===========================

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "children",
      page,
      limit,
      search,
      sortBy,
      order,
      foodHabit,
      allergy,
      prolongDisease,
      minAge,
      maxAge,
      coach,
      program,
    ],

    queryFn: () =>
      getAllChild({
        page,
        limit,
        search,
        sortBy,
        order,
        foodHabit,
        allergy,
        prolongDisease,
        minAge,
        maxAge,
        coach,
        program,
      }),

    keepPreviousData: true,
  });

  // ===========================
  // DELETE CHILD
  // ===========================

  const deleteMutation =
    useMutation({
      mutationFn: deleteChild,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["children"],
        });
      },
    });

  // ===========================
  // CHILDREN LIST
  // ===========================

  const children = useMemo(() => {
    return data?.data || [];
  }, [data]);

  const totalChildren =
    data?.totalChildren || 0;

  const totalPages =
    data?.totalPages || 1;
  // ===========================
  // LOADING
  // ===========================

  if (isLoading) {
    return (
      <div className={styles.loaderWrapper}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  // ===========================
  // ERROR
  // ===========================

  if (isError) {
    return (
      <p className={styles.error}>
        Failed to load children.
      </p>
    );
  }

  // ===========================
  // DELETE HANDLER
  // ===========================

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this child?"
    );

    if (!confirmDelete) return;

    deleteMutation.mutate(id);
  };

  // ===========================
  // RESET FILTER
  // ===========================

  const resetFilters = () => {
    setSearch("");
    // setFoodHabit("");
    // setAllergy("");
    // setProlongDisease("");
    setMinAge("");
    setMaxAge("");
    // setCoach("");
    // setProgram("");
    setSortBy("createdAt");
    setOrder("desc");
    setPage(1);
  };

  return (
    <div className={styles.wrapper}>
      {/* ================= HEADER ================= */}

      <div className={styles.header}>
        <h2>Children Management</h2>

        <div className={styles.headerRight}>
          <div className={styles.searchWrapper}>
            <i className="bi bi-search"></i>

            <input
              type="text"
              placeholder="Search child..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className={styles.countBox}>
            Total Children :
            <span>{totalChildren}</span>
          </div>
        </div>
      </div>

      {/* ================= EXTRA FILTERS ================= */}

      <div className={styles.filterWrapper}>
        {/* PROLONG DISEASE */}

        {/* <input
          type="text"
          placeholder="Prolong Disease"
          value={prolongDisease}
          onChange={(e) => {
            setProlongDisease(e.target.value);
            setPage(1);
          }}
        /> */}

        {/* PROGRAM */}

        {/* <input
          type="text"
          placeholder="Program Id"
          value={program}
          onChange={(e) => {
            setProgram(e.target.value);
            setPage(1);
          }}
        /> */}

        {/* COACH */}

        {/* <input
          type="text"
          placeholder="Coach Id"
          value={coach}
          onChange={(e) => {
            setCoach(e.target.value);
            setPage(1);
          }}
        /> */}

        {/* LIMIT */}

        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={5}>5 Rows</option>
          <option value={10}>10 Rows</option>
          <option value={20}>20 Rows</option>
          <option value={50}>50 Rows</option>
        </select>

        {/* SORT */}

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
        >
          <option value="createdAt">
            Created Date
          </option>

          <option value="fullName">
            Full Name
          </option>

          <option value="age">
            Age
          </option>
        </select>

        {/* ORDER */}

        <select
          value={order}
          onChange={(e) => {
            setOrder(e.target.value);
            setPage(1);
          }}
        >
          <option value="desc">
            Descending
          </option>

          <option value="asc">
            Ascending
          </option>
        </select>
      </div>

      {/* ================= TABLE ================= */}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Child Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Location</th>
              <th>Food</th>
              <th>Allergy</th>
              <th>View</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {children.length > 0 ? (
              children.map((item) => (
                <tr key={item._id}>
                  {/* IMAGE */}

                  <td>
                    {item.profileImage ? (
                      <img
                        src={item.profileImage}
                        alt={item.fullName}
                        className={styles.childImage}
                      />
                    ) : (
                      <div className={styles.avatar}>
                        {item.fullName
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>
                    )}
                  </td>

                  {/* NAME */}

                  <td>{item.fullName}</td>

                  {/* EMAIL */}

                  <td>{item.email}</td>

                  {/* AGE */}

                  <td>{item.age}</td>

                  {/* LOCATION */}

                  <td>{item.location}</td>

                  {/* FOOD */}

                  <td>
                    {item.foodHabit || "N/A"}
                  </td>

                  {/* ALLERGY */}

                  <td>
                    {item.allergy ? (
                      <span className={styles.yes}>
                        Yes
                      </span>
                    ) : (
                      <span className={styles.no}>
                        No
                      </span>
                    )}
                  </td>

                  {/* PROGRAMS */}


                  {/* VIEW */}

                  <td>
                    <button
                      className={
                        styles.viewBtn
                      }
                      onClick={() =>
                        setSelectedChild(
                          item
                        )
                      }
                    >
                      <i className="bi bi-eye-fill"></i>
                    </button>
                  </td>

                  {/* DELETE */}

                  <td>
                    <button
                      className={
                        styles.deleteBtn
                      }
                      onClick={() =>
                        handleDelete(
                          item._id
                        )
                      }
                    >
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className={
                    styles.noData
                  }
                >
                  No Children Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* ================= PAGINATION ================= */}

      <div className={styles.pagination}>
        <button
          className={styles.pageBtn}
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          <i className="bi bi-chevron-left"></i>
          Previous
        </button>

        <span className={styles.pageInfo}>
          Page <strong>{page}</strong> of{" "}
          <strong>{totalPages}</strong>
        </span>

        <button
          className={styles.pageBtn}
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>

      {/* ================= VIEW MODAL ================= */}

      {selectedChild && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedChild(null)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}

            <div className={styles.modalHeader}>
              <h2>Child Details</h2>

              <button
                onClick={() => setSelectedChild(null)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* BODY */}

            <div className={styles.modalBody}>
              <div className={styles.imageWrapper}>
                {selectedChild.profileImage ? (
                  <img
                    src={selectedChild.profileImage || "/no-image.png"}
                    alt={selectedChild.fullName}
                    className={styles.childImage}
                  />
                ) : (
                  <div className={styles.modalAvatar}>
                    {selectedChild.fullName
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>
                )}
              </div>

              <div className={styles.userInfo}>
                <div className={styles.infoCard}>
                  <span>Full Name</span>
                  <p>{selectedChild.fullName}</p>
                </div>

                <div className={styles.infoCard}>
                  <span>Email</span>
                  <p>{selectedChild.email}</p>
                </div>

                <div className={styles.infoCard}>
                  <span>Age</span>
                  <p>{selectedChild.age}</p>
                </div>

                <div className={styles.infoCard}>
                  <span>Location</span>
                  <p>{selectedChild.location}</p>
                </div>

                <div className={styles.infoCard}>
                  <span>Food Habit</span>
                  <p>
                    {selectedChild.foodHabit || "N/A"}
                  </p>
                </div>
                <div className={styles.infoCard}>
                  <span>Allergy</span>

                  <p>
                    {selectedChild.allergy
                      ? "Yes"
                      : "No"}
                  </p>
                </div>


                {selectedChild.allergy && (
                  <div className={styles.infoCard}>
                    <span>
                      Allergy Details
                    </span>

                    <p>
                      {
                        selectedChild.allergyDetails ||
                        "N/A"
                      }
                    </p>
                  </div>
                )}


                <div className={styles.infoCard}>
                  <span>
                    Prolong Disease
                  </span>

                  <p>
                    {
                      selectedChild.prolongDisease ||
                      "N/A"
                    }
                  </p>
                </div>


                <div className={styles.infoCard}>
                  <span>
                    Pass Code
                  </span>

                  <p>
                    {
                      selectedChild.passCode ||
                      "N/A"
                    }
                  </p>
                </div>


                <div className={`${styles.infoCard} ${styles.createdCard}`}>
                  <span>Created Date</span>

                  <p>
                    {new Date(selectedChild.createdAt).toLocaleDateString()}
                  </p>
                </div>


                {/* PROGRAM ASSIGNMENTS */}

                <div className={styles.assignmentBox}>

                  <h3>Assigned Programs</h3>

                  <div className={styles.assignmentList}>

                    {selectedChild.programAssignments?.length > 0 ? (

                      selectedChild.programAssignments.map(
                        (assignment, index) => (

                          <div
                            key={index}
                            className={styles.assignmentCard}
                          >

                            <div>
                              <span>Program</span>

                              <p>
                                {assignment?.program?.title || "N/A"}
                              </p>
                            </div>

                            <div>
                              <span>Coach</span>

                              <p>
                                {assignment?.coach?.fullname || "N/A"}
                              </p>
                            </div>

                            <div>
                              <span>Assigned Date</span>

                              <p>
                                {assignment?.assignedAt
                                  ? new Date(
                                    assignment.assignedAt
                                  ).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </div>

                          </div>

                        )
                      )

                    ) : (

                      <p className={styles.noData}>
                        No Program Assigned
                      </p>

                    )}

                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
