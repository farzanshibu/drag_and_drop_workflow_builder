import { getWorkflows } from "@/prisma/functions";
import { auth } from "@clerk/nextjs/server";

export async function fetchWorkflows() {
    const { userId } = auth();
    if (userId === null) throw new Error('Missing userId');
    const res = await getWorkflows(userId);
    return res;
}