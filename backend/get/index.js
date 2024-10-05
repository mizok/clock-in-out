const { google } = require("googleapis");
const sheets = google.sheets("v4");
const { GoogleAuth } = require("google-auth-library");

module.exports = async (req, res) => {
  // 設置 CORS 標頭，允許所有來源進行請求
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // 只允許 GET 請求來抓取數據
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const auth = new GoogleAuth({
    credentials: {
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"), // 替換換行符
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const client = await auth.getClient();
  const spreadsheetId = "1j_fradaMRDwE00hIHgNCJJRmtHiaVl7JaXvT1zBPr_s"; // 替換為你的試算表 ID
  const range = "紀錄!A:A"; // 替換為你的範圍（這裡是整個A欄）

  try {
    const response = await sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId,
      range,
    });

    // 抓取到的資料
    const rows = response.data.values;

    // 如果欄位是空的，返回相應的提示
    if (!rows || rows.length === 0) {
      res.status(200).json({ data: [], message: "No data found" });
    } else {
      res.status(200).json({ data: rows });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching data" });
  }
};
