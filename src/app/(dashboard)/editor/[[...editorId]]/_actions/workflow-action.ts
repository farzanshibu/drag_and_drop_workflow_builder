"use server";
import { auth } from "@clerk/nextjs/server";

import { getWorkflows, saveWorkflowData, updateWorkflowDescription, updateWorkflowName } from "../../../../../prisma/functions";

export async function updateWorkflowNameAction(workflowId: string, workflowName: string) {
    const { userId } = auth();
    if (!userId) {
        return {
            status: "error",
            error: "User not found",
            message: "User not found",
        };
    }
    try {
        const oldWorkflow = await getWorkflows(userId);
        const workflow = oldWorkflow.find((wf) => wf.id === workflowId);
        if (!workflow) {
            return {
                status: "error",
                error: "Workflow not found",
                message: "Workflow not found",
            };
        }

        const updatedWorkflow = await updateWorkflowName(workflowId, workflowName);


        return {
            status: "success",
            workflow: updatedWorkflow,
            message: "Workflow name updated successfully",
        };
    }
    catch (error) {

        return {
            status: "error",
            error: error,
            message: "Failed to update workflow",
        };
    }
}

export async function updateWorkflowDescriptionAction(workflowId: string, workflowDescription: string) {
    const { userId } = auth();
    if (!userId) {
        return {
            status: "error",
            error: "User not found",
            message: "User not found",
        };
    }
    try {
        const oldWorkflow = await getWorkflows(userId);
        const workflow = oldWorkflow.find((wf) => wf.id === workflowId);
        if (!workflow) {
            return {
                status: "error",
                error: "Workflow not found",
                message: "Workflow not found",
            };
        }

        const updatedWorkflow = await updateWorkflowDescription(workflowId, workflowDescription);
        return {
            status: "success",
            workflow: updatedWorkflow,
            message: "Workflow name updated successfully",
        };
    }
    catch (error) {

        return {
            status: "error",
            error: error,
            message: "Failed to update workflow",
        };
    }
}


export async function saveWorkflowAction(
    workflowId: string,
    { nodes, edges, nodeDataArr }: { nodes: string; edges: string; nodeDataArr: string }
) {
    const { userId } = auth();
    if (!userId) {
        return {
            status: "error",
            error: "User not found",
            message: "User not found",
        };
    }

    try {
        const oldWorkflow = await getWorkflows(userId);
        const workflow = oldWorkflow.find((wf) => wf.id === workflowId);
        if (!workflow) {
            return {
                status: "error",
                error: "Workflow not found",
                message: "Workflow not found",
            };
        }

        const data = {
            workflowId: workflowId,
            nodes: nodes,
            edges: edges,
            nodeDataArr: nodeDataArr,
        };

        const updatedWorkflow = await saveWorkflowData(data);


        return {
            status: "success",
            workflow: updatedWorkflow,
            message: "Workflow saved successfully",
        };
    } catch (error) {

        return {
            status: "error",
            error: error,
            message: "Failed to save workflow",
        };
    }
}