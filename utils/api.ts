const API_URL = process.env.NEXT_PUBLIC_API_URL;

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "API error");
  }
  return res.json();
};

export const fetchBuses = async () => {
  const res = await fetch(`${API_URL}/api/buses`, { cache: "no-store" });
  return handleResponse(res);
};

export const fetchBusById = async (id: string) => {
  const res = await fetch(`${API_URL}/api/buses/${id}`, { cache: "no-store" });
  return handleResponse(res);
};

export const addBus = async (busData: any) => {
  const res = await fetch(`${API_URL}/api/buses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(busData),
  });
  return handleResponse(res);
};

export const updateBus = async (id: string, busData: any) => {
  const res = await fetch(`${API_URL}/api/buses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(busData),
  });
  return handleResponse(res);
};

export const deleteBus = async (id: string) => {
  const res = await fetch(`${API_URL}/api/buses/${id}`, { method: "DELETE" });
  return handleResponse(res);
};
