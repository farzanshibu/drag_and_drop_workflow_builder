import type { SaveWorkflowData, WorkFlowData } from "@/types/types";
import prisma from "./prisma";

const getWorkflows = async (userId: string) => {
    try {
        const workflows = await prisma.workflow.findMany({
            where: {
                clerkid: userId,
            },
        });
        return workflows;
    } catch (error) {
        console.error("Error fetching workflows:", error);
        throw error;
    }
};

const getWorkflow = async (userId: string, workflowId: string) => {
    try {
        const workflows = await prisma.workflow.findUnique({
            where: {
                clerkid: userId,
                id: workflowId,
            },
        });
        return workflows;
    } catch (error) {
        console.error("Error fetching workflows:", error);
        throw error;
    }
};



const createWorkflow = async (data: WorkFlowData, userId: string) => {
    let newWorkflowData = {
        id: data.workflowId,
        name: data.workflowName,
        description: data.workflowDescription,
        clerkid: userId,
        last_updated: new Date().toISOString(),
    };
    try {
        const workflow = await prisma.workflow.create({
            data: newWorkflowData,
        });

        return workflow;
    } catch (error) {
        console.error("Error creating workflow:", error);
        throw error;
    }
};



const saveWorkflowData = async (data: SaveWorkflowData) => {
    try {
        const workflow = await prisma.workflow.update({
            where: {
                id: data.workflowId,
            },
            data: {
                nodes: data.nodes,
                edges: data.edges,
                nodeDataArr: data.nodeDataArr,
            },
        });

        return workflow;
    } catch (error) {
        console.error("Error updating workflow data:", error);
        throw error;
    }
};

const updateWorkflowName = async (id: string, name: string) => {
    try {
        const workflow = await prisma.workflow.update({
            where: {
                id: id,
            },
            data: {
                name: name,
            },
        });

        return workflow;
    } catch (error) {
        console.error("Error updating workflow name:", error);
        throw error;
    }
}

const updateWorkflowDescription = async (id: string, description: string) => {
    try {
        const workflow = await prisma.workflow.update({
            where: {
                id: id,
            },
            data: {
                description: description,
            },
        });

        return workflow;
    } catch (error) {
        console.error("Error updating workflow description:", error);
        throw error;
    }
}

const deleteWorkflow = async (id: string) => {
    try {
        const workflow = await prisma.workflow.delete({
            where: {
                id: id,
            },
        });

        return workflow;
    } catch (error) {
        console.error("Error deleting workflow:", error);
        throw error;
    }
};

export { createWorkflow, deleteWorkflow, getWorkflow, getWorkflows, saveWorkflowData, updateWorkflowDescription, updateWorkflowName };

