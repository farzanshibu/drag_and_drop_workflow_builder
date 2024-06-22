import type { WorkFlow } from "@/types/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ObjectStats(target: any) {
  if (target === undefined || target.length === 0) return "No Data";
  const rowCount = target.length;
  const colCount = Object.keys(target[0] || {}).length; // Assuming all rows have the same columns
  return `Row: ${rowCount} || Column: ${colCount}`;
}

export function splitEdgeToNodes(edgeIds: string[], currentNodeId: string) {
  if (!Array.isArray(edgeIds) || edgeIds.length === 0) {
    return null; // edgeIds must be a valid array with at least one element
  }

  let sourceIds: string[] = [];
  let targetIds: string[] = [];

  edgeIds.forEach((edge) => {
    if (edge.includes(currentNodeId)) {
      const [sourceId, targetId] = edge.split('@');
      if (sourceId && targetId) {
        sourceIds.push(sourceId);
        targetIds.push(targetId);
      }
    }
  });

  if (sourceIds.length === 0 || targetIds.length === 0) {
    return null; // No matching edge found
  }

  return {
    sourceId: sourceIds[0],
    sourceIdB: sourceIds.length > 1 ? sourceIds[1] : null,
    targetId: targetIds[0],
    targetIdB: targetIds.length > 1 ? targetIds[1] : null,
  };
}

export const parseWorkflows = (workflows: any): WorkFlow[] => {
  if (!workflows) {
    return [];
  }

  // If workflows is already an array, map over it
  if (Array.isArray(workflows)) {
    return workflows.map((workflow) => ({
      ...workflow,
      nodes: parseJsonField(workflow.nodes),
      edges: parseJsonField(workflow.edges),
      nodeDataArr: parseJsonField(workflow.nodeDataArr),
    }));
  }

  // If workflows is an object (possibly from localStorage), convert it to an array
  if (typeof workflows === 'object' && workflows !== null) {
    return Object.values(workflows).map((workflow: any) => ({
      ...workflow,
      nodes: parseJsonField(workflow.nodes),
      edges: parseJsonField(workflow.edges),
      nodeDataArr: parseJsonField(workflow.nodeDataArr),
    }));
  }

  // If workflows is neither an array nor an object, return an empty array
  console.error('Unexpected workflows data structure:', workflows);
  return [];
};

const parseJsonField = (field: string | null | undefined): any[] => {
  if (!field) return [];
  try {
    return JSON.parse(field);
  } catch (error) {
    console.error('Error parsing JSON field:', error);
    return [];
  }
};

