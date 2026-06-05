import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import styles from "./SubscriptionManagementPage.module.scss";

import SubscriptionManagement from "../../Component/SubscriptionManagement/SubscriptionManagement";

import {
  getAllPayments,
  getAllPlans,
  exportPaymentsCSV,
} from "../../apis/api";

export default function SubscriptionManagementPage() {
  const [activeSection, setActiveSection] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  // Single Sort Dropdown
  const [sortBy, setSortBy] =
    useState("newest");

  const [page, setPage] =
    useState(1);

  const limit = 10;

  const toggleSection = (section) => {
    if (activeSection === section) {
      setActiveSection("");
      return;
    }


    setActiveSection(section);
    setPage(1);


  };

  // UI sort -> Backend sort mapping
  let apiSortBy = "createdAt";
  let apiSortOrder = "desc";

  switch (sortBy) {
    case "oldest":
      apiSortBy = "createdAt";
      apiSortOrder = "asc";
      break;


    case "az":
      apiSortBy = "fullname";
      apiSortOrder = "asc";
      break;

    case "za":
      apiSortBy = "fullname";
      apiSortOrder = "desc";
      break;

    default:
      apiSortBy = "createdAt";
      apiSortOrder = "desc";


  }

  const {
    data: paymentData,
    isError: paymentError,
  } = useQuery({
    queryKey: [
      "all-payments",
      page,
      search,
      status,
      sortBy,
      activeSection,
    ],


    queryFn: () =>
      getAllPayments({
        page,
        limit,
        search,
        status,
        sortBy: apiSortBy,
        sortOrder: apiSortOrder,

        plan:
          activeSection === "basic"
            ? "BASIC"
            : activeSection ===
              "professional"
              ? "PROFESSIONAL"
              : activeSection ===
                "advanced"
                ? "ADVANCED"
                : "",
      }),


  });

  useQuery({
    queryKey: ["all-plans"],
    queryFn: getAllPlans,
  });

  if (paymentError) {
    return (<div className={styles.error}>
      Failed to load data </div>
    );
  }

  const payments =
    paymentData?.payments || [];

  const totalUsers =
    paymentData?.totalPayments || 0;


  const handleExportCSV = async () => {
    try {
      const blob =
        await exportPaymentsCSV();

      const url =
        window.URL.createObjectURL(
          new Blob([blob])
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        "subscriptions.csv"
      );

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        url
      );
    } catch (error) {
      console.error(
        "CSV Export Failed",
        error
      );
    }
  };

  return (<div className={styles.container}>
    {/* BASIC */} <div className={styles.section}>
      <div
        className={`${styles.sectionHeader} ${activeSection === "basic"
          ? styles.active
          : ""
          }`}
        onClick={() =>
          toggleSection("basic")
        }
      >
        BASIC Subscription Control </div>

      {activeSection === "basic" && (
        <SubscriptionManagement
          title="BASIC"
          data={payments}
          totalUsers={totalUsers}
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onExportCSV={handleExportCSV}
        />
      )}
    </div>

    {/* PROFESSIONAL */}
    <div className={styles.section}>
      <div
        className={`${styles.sectionHeader} ${activeSection ===
          "professional"
          ? styles.active
          : ""
          }`}
        onClick={() =>
          toggleSection(
            "professional"
          )
        }
      >
        PROFESSIONAL Subscription
        Control
      </div>

      {activeSection ===
        "professional" && (
          <SubscriptionManagement
            title="PROFESSIONAL"
            data={payments}
            totalUsers={totalUsers}
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        )}
    </div>

    {/* ADVANCED */}
    <div className={styles.section}>
      <div
        className={`${styles.sectionHeader} ${activeSection ===
          "advanced"
          ? styles.active
          : ""
          }`}
        onClick={() =>
          toggleSection("advanced")
        }
      >
        ADVANCED Subscription Control
      </div>

      {activeSection ===
        "advanced" && (
          <SubscriptionManagement
            title="ADVANCED"
            data={payments}
            totalUsers={totalUsers}
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        )}
    </div>
  </div>


  );
}
