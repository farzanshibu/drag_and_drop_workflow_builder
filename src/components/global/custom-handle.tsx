import { Handle, type HandleProps } from "reactflow";

interface CustomHandleProps extends HandleProps {
  customStyle?: React.CSSProperties;
}

const CustomHandle = (props: CustomHandleProps) => {
  return (
    <Handle
      {...props}
      style={{
        width: 8,
        height: 16,
        borderRadius: 4,
        background: props.type === "source" ? "pink" : "lime",
        border: props.type === "source" ? "1px solid pink" : "1px solid lime",
        ...props.customStyle,
      }}
    />
  );
};

export default CustomHandle;
