const { google } = require("googleapis");
const sheets = google.sheets("v4");
const { GoogleAuth } = require("google-auth-library");

module.exports = async (req, res) => {
  // 設置 CORS 標頭，允許所有來源進行請求
  res.setHeader("Access-Control-Allow-Origin", "*"); // 允許所有域名
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed" });
  }

  const { name } = req.body;
  const auth = new GoogleAuth({
    credentials: {
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"), // 替換換行符
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const client = await auth.getClient();
  const spreadsheetId = "1j_fradaMRDwE00hIHgNCJJRmtHiaVl7JaXvT1zBPr_s"; // 替換為你的試算表 ID
  const range = "紀錄!A2:A"; // 替換為你的試算表範圍

  const now = new Date().toISOString();
  const request = {
    auth: client,
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    resource: {
      values: [[name, now]],
    },
  };

  try {
    await sheets.spreadsheets.values.append(request);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};
