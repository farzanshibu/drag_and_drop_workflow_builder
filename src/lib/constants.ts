export const NodesTypes = [
    {
        id: 1, type: 'INPUT', elements: [
            { id: 1, name: 'File', description: 'Reads a file from the file system', input: null, output: 'Dataset', type: "input-file", data: {} },
            { id: 2, name: 'Example Data', description: 'Some example data for Playing around the data blocks', input: null, output: 'Dataset', type: "input-example", data: {} },
        ],
    },
    {
        id: 2, type: 'TRANSFORM', elements: [
            { id: 3, name: 'Filter', description: 'Group a data set based on a given column name', input: "Dataset", output: 'Dataset', type: "transform-filter", data: {} },
            { id: 4, name: 'Merge', description: 'Merge two data Sets based on the given column names', input: "Dataset", output: 'Dataset', type: "transform-merge", data: {} },
            { id: 5, name: 'Group', description: 'Groups a data set based on a given column name', input: "Dataset", output: 'Dataset', type: "transform-group", data: {} },
            { id: 6, name: 'Slice', description: 'Slice a data set based on indics', input: "Dataset", output: 'Dataset', type: "transform-slice", data: {} },
            { id: 7, name: 'Rename Columns', description: 'Renames multiple columns', input: "Dataset", output: 'Dataset', type: "transform-rename", data: {} },
            { id: 8, name: 'Sort', description: 'Sort data based on a given columns', input: "Dataset", output: 'Dataset', type: "transform-sort", data: {} },
        ],
    },
    {
        id: 3, type: 'VISUALIZATION', elements: [
            { id: 9, name: 'Baschart', description: 'Display a bar chart of given x and y columns name', input: 'Dataset', output: null, type: "visualization-barchart", data: {} },
            {
                id: 10, name: 'Linechart', description: 'Display a line Chart of a given column name', input: 'Dataset', output: null, type: "visualization-histogram", data: {}
            },
            { id: 11, name: 'Scatterplot', description: 'Display a scatterplot of given x and y column names', input: 'Dataset', output: null, type: "visualization-scatterplot", data: {} },
        ],
    },
    {
        id: 4, type: 'MISC', elements: [
            { id: 11, name: 'Stat', description: 'Gives min,max,avg,means and count', input: 'Dataset', output: null, type: "misc-stat", data: {} },
            { id: 12, name: 'Markdown', description: 'Lets you write some markdown', input: null, output: null, type: "misc-markdown", data: {} },
            { id: 13, name: 'Export', description: 'Lets you export data as csv,json', input: 'Dataset', output: null, type: "misc-export", data: {} },
        ],
    },

]

