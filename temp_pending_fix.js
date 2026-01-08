app.get("/api/pending", (req, res) => {
  const records = JSON.parse(fs.readFileSync("records.json", "utf8"))
    .filter(r => r.userType === "doctor-cert" && !r.verified);

  res.json({ pending: records });
});
