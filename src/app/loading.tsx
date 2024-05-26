import Spinner from "@/components/global/spinner";

export default function Loading() {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Spinner />
    </div>
  );
}
