const SHEET_URLS = [
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vR39W1cXr92a99T_RDr5abulfG66yPTqXQ21703PuuArM8V83yzvu5i0DTRyMpfboDwFS-pJFh1275d/pub?output=csv",
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vR39W1cXr92a99T_RDr5abulfG66yPTqXQ21703PuuArM8V83yzvu5i0DTRyMpfboDwFS-pJFh1275d/pub?output=csv"
];

async function fetchFaultData(url) {
  try {
    const response = await fetch(url);
    const csvText = await response.text();
    return csvToJson(csvText);
  } catch (error) {
    console.error("Error loading fault data:", error);
    alert("Error loading fault data, please check your Google Sheets settings.");
    return [];
  }
}

function csvToJson(csvText) {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",");

  headers[0] = "Fault Type";
  headers[1] = "Possible Cause";
  headers[2] = "Troubleshooting Steps";
  headers[3] = "Final Solution";

  return lines.slice(1).map(line => {
    const values = line.split(",");
    const obj = {};
    headers.forEach((header, i) => obj[header] = values[i]);
    return obj;
  });
}

async function displayFaultData() {
  const tableBody = document.getElementById("faultTableBody");
  let allFaults = [];

  for (const url of SHEET_URLS) {
    const faults = await fetchFaultData(url);
    allFaults = allFaults.concat(faults);
  }

  if (allFaults.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='4'>No fault data available.</td></tr>";
    return;
  }

  tableBody.innerHTML = allFaults.map(f => `
    <tr>
      <td>${f["Fault Type"]}</td>
      <td>${f["Possible Cause"]}</td>
      <td>${f["Troubleshooting Steps"]}</td>
      <td>${f["Final Solution"]}</td>
    </tr>
  `).join("");
}

window.onload = displayFaultData;
