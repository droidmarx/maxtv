// js/authCheck.js
(async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/index.html";
    return;
  }

  const resp = await fetch("/api/verify", {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` }
  });

  const data = await resp.json();
  if (!data.valid) {
    localStorage.removeItem("token");
    window.location.href = "/index.html";
  }
})();
