"use client";

import { useWorkflowStore } from "@/store/workflows";
import { useEffect } from "react";

const Hydration = () => {
  useEffect(() => {
    useWorkflowStore.persist.rehydrate();
  }, []);

  return null;
};

export default Hydration;
