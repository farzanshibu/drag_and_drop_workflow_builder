"use client";
import { motion } from "framer-motion";
import { FC } from "react";

const Spinner: FC = () => {
  return (
    <div className="flex justify-center items-center h-screen w-screen ">
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
