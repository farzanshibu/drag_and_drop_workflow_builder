"use client";

import { motion } from "framer-motion";

type Props = {};

export default function AnimatedContainer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="flex flex-col items-center gap-3 p-4 max-w-7xl mx-auto relative z-10 pt-0 backdrop-blur-sm rounded-md shadow-md bg-white/[0.12]"
    >
      <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
        The drag and drop workflow builder is a powerful tool that allows you to
        create custom workflows by simply dragging and dropping elements.
      </p>
    </motion.div>
  );
}
