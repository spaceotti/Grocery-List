export const apiRequest = async <T,>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("Please reload the app");
  }

  return res.json();
};
