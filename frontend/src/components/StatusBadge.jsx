export default function StatusBadge({ status }) {
  const styles = {
    RECEIVED: "bg-gray-200 text-gray-700",
    PROCESSING: "bg-yellow-100 text-yellow-700",
    READY: "bg-blue-100 text-blue-700",
    DELIVERED: "bg-green-100 text-green-700",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}