import Loader from "./loader";

export default function LoaderOverLay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Loader />
    </div>
  );
}
