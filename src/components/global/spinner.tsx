"use client";
import React, {FC} from "react";
import { motion } from "framer-motion";

const Spinner: FC = () => {
  return (
    <div className="flex justify-center items-center">
      <motion.div
        className="spinner"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{
          width: 24,
          height: 24,
          borderTop: "3px solid #ddd",
          borderRight: "3px solid transparent",
          borderRadius: "50%",
        }}
      ></motion.div>
    </div>
  );
};

export default Spinner;
