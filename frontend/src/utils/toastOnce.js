import toast from "react-hot-toast";

// Cache of shown toast IDs with expiry
const cache = new Map();
const DEFAULT_TTL_MS = 5000; // suppress duplicates for 5s

export function toastOnce(id, type, message, options = {}, ttlMs = DEFAULT_TTL_MS) {
  const now = Date.now();
  const lastShown = cache.get(id);
  if (lastShown && now - lastShown < ttlMs) return; // suppress duplicate

  cache.set(id, now);

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "loading":
      toast.loading(message, options);
      break;
    default:
      toast(message, options);
  }
}

export default toastOnce;
