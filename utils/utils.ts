import { ExternalToast, toast } from "sonner";

export async function handleError(error: unknown, options?: ExternalToast) {
  let errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred";

  toast.error(errorMessage, {
    duration: 5000,
    ...options,
  });
}

export async function handleSuccess(message: string, options?: ExternalToast) {
  toast.success(message, {
    duration: 5000,
    ...options,
  });
}
