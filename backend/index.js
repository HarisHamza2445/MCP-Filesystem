const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const baseDir = path.join(__dirname, 'uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, baseDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

app.post('/upload', upload.any(), (req, res) => {
  res.send({ message: 'Folder uploaded successfully' });
});

app.post('/create', async (req, res) => {
  const { filename, content } = req.body;
  const filePath = path.join(baseDir, filename);
  try {
    await fs.outputFile(filePath, content);
    res.send({ message: 'File created' });
  } catch (err) {
    res.status(500).send({ error: 'Error creating file' });
  }
});

app.post('/edit', async (req, res) => {
  const { filename, content } = req.body;
  const filePath = path.join(baseDir, filename);
  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).send({ error: 'File not found' });
    }
    await fs.writeFile(filePath, content);
    res.send({ message: 'File edited' });
  } catch (err) {
    res.status(500).send({ error: 'Error editing file' });
  }
});

app.post('/delete', async (req, res) => {
  const { filename } = req.body;
  const filePath = path.join(baseDir, filename);
  try {
    await fs.remove(filePath);
    res.send({ message: 'File deleted' });
  } catch (err) {
    res.status(500).send({ error: 'Error deleting file' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
