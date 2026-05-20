export function getApiErrorMessage(error, fallback = "Something went wrong.") {
  const data = error?.data;

  if (!data) {
    return error?.message || fallback;
  }

  if (typeof data === "string") {
    return data;
  }

  if (typeof data.error === "string") {
    return data.error;
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  if (typeof data.detail === "string") {
    return data.detail;
  }

  if (typeof data === "object") {
    const messages = Object.entries(data).flatMap(([field, value]) => {
      if (Array.isArray(value)) {
        return value.map((msg) => `${field}: ${msg}`);
      }
      if (typeof value === "string") {
        return [`${field}: ${value}`];
      }
      return [];
    });

    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  return fallback;
}
