"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold text-red-600">
        An error occurred: {error.message}
      </h1>
    </div>
  );
}
