import type { Edge, Node } from "reactflow";

export type Datatype = {
    edgesIDs: string[];
    isConnected: boolean;
}


export type WorkFlow = {
    id: string;
    name: string;
    description: string;
    clerkid: string;
    last_updated: string;
    nodes: Node[];
    edges: Edge[];
    nodeDataArr: NodeData[];
}

export type WorkFlowData = {
    workflowId: string;
    workflowName: string;
    workflowDescription: string;
};

export type AddBlockProps = {
    id: number;
    name: string;
    description: string;
    input: null | string;
    output: null | string;
    type: string;
    data: {};
};

export type StatData = {
    sum: number;
    mean: number;
    min: number;
    max: number;
    median: number;
    mode: number;
    variance: number;
    stdDev: number;
}

export type FieldTypes = {
    inputSelectedFile?: File | undefined;
    exampleSelectedOption?: string | undefined;
    transformSelectedOption?: string | undefined;
    transformSelectedCondition?: string | undefined;
    transformSelectedGroup?: string | undefined;
    transformIndexStart?: number | undefined;
    transformIndexEnd?: number | undefined;
    transformSortConditions?: string | undefined;
    transformColumnName?: string | undefined;
    transformColumnName2?: string | undefined;
    chartColumnName?: string | undefined;
    chartColumnName2?: string | undefined;
    miscSelectedColumn?: string | undefined;
    miscStatData?: StatData | undefined;
    micsMarkupShow?: boolean | undefined;
};

export type NodeData = {
    id: string;
    data_target: any | undefined;
    data_source: any | undefined;
    field?: FieldTypes;

};

export type SaveWorkflowData = {
    workflowId: string;
    nodes: string;
    edges: string;
    nodeDataArr: string;
}
