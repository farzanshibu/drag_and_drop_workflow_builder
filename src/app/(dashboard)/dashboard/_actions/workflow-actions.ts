"use server"
import { createWorkflow, deleteWorkflow } from "@/prisma/functions";
import type { WorkFlowData } from "@/types/types";
import { auth } from "@clerk/nextjs/server";



export async function createWorkflowAction(data: WorkFlowData) {
    const { userId } = auth();
    if (!userId) {
        return {
            status: "error",
            error: "User not found",
            message: "User not found",
        };
    }
    try {
        const workflow = await createWorkflow(data, userId);
        // revalidatePath("/dashboard");
        return {
            status: "success",
            workflow: workflow,
            message: "Workflow created successfully",
        };
    }
    catch (error) {
        // revalidatePath("/dashboard");
        return {
            status: "error",
            error: error,
            message: "Failed to create workflow",
        };
    }
}

export async function deleteWorkflowAction(workflowId: string) {
    try {
        await deleteWorkflow(workflowId);
        // revalidatePath("/dashboard");
        return {
            status: "success",
            message: "Workflow deleted successfully",
        };
    } catch (error) {
        console.log(error);
        // revalidatePath("/dashboard");
        return {
            status: "error",
            error: error,
            message: "Failed to delete workflow",
        };
    }
}
