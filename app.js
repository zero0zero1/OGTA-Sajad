const sheetLinks = {
  technical: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR39W1cXr92a99T_RDr5abulfG66yPTqXQ21703PuuArM8V83yzvu5i0DTRyMpfboDwFS-pJFh1275d/pub?output=csv",
  ont: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLzwW5RjsdOqTKM8Iy28GT3xfrbFQyH_pHadurzijKyJD8LAN6OsFf7m_pi1gr_PCegcQTALsWw_rT/pub?output=csv",
  dc: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQPiO867GG99zr8U6dvZpNqy8kPJKvuLXY66EczQsFoWPNudIhVfNNLLKK5xXtZfD3UaW6MXnEBCsBR/pub?output=csv"
};

let allData = [];

async function fetchCSV(sheetKey) {
  const response = await fetch(sheetLinks[sheetKey]);
  const text = await response.text();
  return csvToJson(text);
}

function csvToJson(csvText) {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map(line => {
    const values = line.split(",");
    return {
      fault: values[0],
      cause: values[1],
      steps: values[2],
      solution: values[3],
    };
  });
}

function renderTable(data) {
  const tbody = document.getElementById("faultTableBody");
  tbody.innerHTML = data.map(row => `
    <tr>
      <td>${row.fault}</td>
      <td>${row.cause}</td>
      <td>${row.steps}</td>
      <td>${row.solution}</td>
    </tr>
  `).join("");
}

async function updateSheetView(sheetKey) {
  allData = await fetchCSV(sheetKey);
  renderTable(allData);
}

document.getElementById("sheetSelector").addEventListener("change", (e) => {
  updateSheetView(e.target.value);
});

document.getElementById("searchInput").addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = allData.filter(row =>
    Object.values(row).some(val => val.toLowerCase().includes(term))
  );
  renderTable(filtered);
});

updateSheetView("technical");
