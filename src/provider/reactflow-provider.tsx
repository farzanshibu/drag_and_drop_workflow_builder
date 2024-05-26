"use client";
import { ReactFlowProvider } from "reactflow";

type Props = {
  children: React.ReactNode;
};

export default function WorkFlowProvider({ children }: Props) {
  return <ReactFlowProvider>{children}</ReactFlowProvider>;
}
