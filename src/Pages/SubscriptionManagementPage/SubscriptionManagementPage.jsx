import React, { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import styles from "./SubscriptionManagementPage.module.scss";

import SubscriptionManagement from "../../Component/SubscriptionManagement/SubscriptionManagement";

import {
  getAllPayments,
  getAllPlans,
} from "../../apis/api";

export default function SubscriptionManagementPage() {

  const [activeSection, setActiveSection] =
    useState("");

  // TOGGLE
  const toggleSection = (section) => {

    setActiveSection(
      activeSection === section
        ? ""
        : section
    );
  };

  // =========================
  // GET PAYMENTS
  // =========================

  const {
    data: paymentData,
    isLoading: paymentLoading,
    isError: paymentError,
  } = useQuery({

    queryKey: ["all-payments"],

    queryFn: getAllPayments,
  });

  // =========================
  // GET PLANS
  // =========================

  const {
    data: planData,
    isLoading: planLoading,
    isError: planError,
  } = useQuery({

    queryKey: ["all-plans"],

    queryFn: getAllPlans,
  });

  // =========================
  // LOADING
  // =========================

  if (paymentLoading || planLoading) {

    return (
      <div className={styles.loading}>
        Loading...
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (paymentError || planError) {

    return (
      <div className={styles.error}>
        Failed to load data
      </div>
    );
  }

  // =========================
  // DATA
  // =========================

  const payments =
    paymentData?.payments || [];

  const plans =
    planData?.plans || [];

  // =========================
  // FILTER PAYMENTS
  // =========================

  const basicPayments =
    payments.filter(
      (item) =>
        item.description
          ?.toLowerCase()
          .includes("basic") &&
        item.status === "captured"
    );

  const professionalPayments =
    payments.filter(
      (item) =>
        item.description
          ?.toLowerCase()
          .includes("professional") &&
        item.status === "captured"
    );

  const advancedPayments =
    payments.filter(
      (item) =>
        item.description
          ?.toLowerCase()
          .includes("advanced") &&
        item.status === "captured"
    );

  // =========================
  // MATCH PLAN DURATION
  // =========================

  const getDuration = (
    data,
    planName
  ) => {

    const matchedPlan =
      plans.find(
        (plan) =>
          plan.planName === planName &&
          plan.amount === data.amount
      );

    return matchedPlan?.durationDays;
  };

  // =========================
  // FINAL DATA
  // =========================

  const finalBasic =
    basicPayments.map((item) => ({
      ...item,

      durationDays:
        getDuration(item, "BASIC"),
    }));

  const finalProfessional =
    professionalPayments.map(
      (item) => ({
        ...item,

        durationDays:
          getDuration(
            item,
            "PROFESSIONAL"
          ),
      })
    );

  const finalAdvanced =
    advancedPayments.map(
      (item) => ({
        ...item,

        durationDays:
          getDuration(
            item,
            "ADVANCED"
          ),
      })
    );

  return (
    <div className={styles.container}>

      {/* BASIC */}
      <div className={styles.section}>

        <div
          className={`${styles.sectionHeader} ${
            activeSection === "basic"
              ? styles.active
              : ""
          }`}
          onClick={() =>
            toggleSection("basic")
          }
        >
          <span>
            BASIC Subscription Control
          </span>

          <i
            className={`bi ${
              activeSection === "basic"
                ? "bi-chevron-up"
                : "bi-chevron-down"
            }`}
          ></i>
        </div>

        {activeSection === "basic" && (
          <div className={styles.sectionBody}>
            <SubscriptionManagement
              title="BASIC"
              data={finalBasic}
            />
          </div>
        )}
      </div>

      {/* PROFESSIONAL */}
      <div className={styles.section}>

        <div
          className={`${styles.sectionHeader} ${
            activeSection ===
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
          <span>
            PROFESSIONAL Subscription
            Control
          </span>

          <i
            className={`bi ${
              activeSection ===
              "professional"
                ? "bi-chevron-up"
                : "bi-chevron-down"
            }`}
          ></i>
        </div>

        {activeSection ===
          "professional" && (
          <div className={styles.sectionBody}>
            <SubscriptionManagement
              title="PROFESSIONAL"
              data={finalProfessional}
            />
          </div>
        )}
      </div>

      {/* ADVANCED */}
      <div className={styles.section}>

        <div
          className={`${styles.sectionHeader} ${
            activeSection ===
            "advanced"
              ? styles.active
              : ""
          }`}
          onClick={() =>
            toggleSection("advanced")
          }
        >
          <span>
            ADVANCED Subscription
            Control
          </span>

          <i
            className={`bi ${
              activeSection ===
              "advanced"
                ? "bi-chevron-up"
                : "bi-chevron-down"
            }`}
          ></i>
        </div>

        {activeSection ===
          "advanced" && (
          <div className={styles.sectionBody}>
            <SubscriptionManagement
              title="ADVANCED"
              data={finalAdvanced}
            />
          </div>
        )}
      </div>
    </div>
  );
}