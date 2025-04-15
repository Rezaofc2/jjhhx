const axios = require('axios');

function getDriveFileId(url) {
  const match = url.match(/\/d\/([^\/]+)/);
  return match ? match[1] : null;
}

async function gdrive(url) {
  const fileId = getDriveFileId(url);
  if (!fileId) throw new Error('Invalid Google Drive URL');

  const response = await axios({
    method: 'GET',
    url: `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=AIzaSyAA9ERw-9LZVEohRYtCWka_TQc6oXmvcVU`,
    responseType: 'arraybuffer'
  });

  return Buffer.from(response.data, 'binary');
}

module.exports = (app) => {
  app.get("/downloader/gdrive", async (req, res) => {
    try {
      const { url } = req.query;
      if (!url) {
        return res.status(400).json({ status: false, error: "Url is required" });
      }
      const result = await gdrive(url);
      res.status(200).json({status: true, result});
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
