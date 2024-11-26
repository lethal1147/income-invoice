import React from "react";

export default function ErrorCard({
  onClose,
  errorText = "Something went wrong.",
}: {
  onClose: () => void;
  errorText: string;
}) {
  return (
    <div className="bg-red-50 rounded-md flex justify-between items-center text-red-600 border border-red-300 p-3">
      <p>{errorText}</p>
      <p
        onClick={onClose}
        className="hover:text-red-600 font-bold cursor-pointer transition"
      >
        X
      </p>
    </div>
  );
}
