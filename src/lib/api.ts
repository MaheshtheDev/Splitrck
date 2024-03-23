const API = {
  getUser,
  getStats,
  getMonthlyExpenses
};

export default API;

async function getStats(userId: string) {
  const response = await fetch("/api/expenses/stats?userId=" + userId, {
    method: "GET",
  });

  if (response.ok) {
    const data = await response.json();
    return [data, null];
  }

  return [null, "Error fetching stats"];
}

async function getUser() {
  const response = await fetch("/api/user", {
    method: "GET",
  });

  if (response.ok) {
    const data = await response.json();
    return [data.user, null];
  }

  return [null, "Error fetching user"];
}

async function getMonthlyExpenses(userId: string, date: Date) {
  const response = await fetch(
    `/api/expenses/monthly?userId=${userId}&date=${date.toISOString()}`,
    {
      method: "GET",
    }
  );

  if (response.ok) {
    const data = await response.json();
    return [data, null];
  }

  return [null, "Error fetching expenses"];
}
