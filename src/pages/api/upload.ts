// @ts-nocheck
import axios from "axios";
import FormData from "form-data";
import { IncomingForm } from "formidable";
import fs from "fs";
export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Form parsing failed" });
    }

    console.log("FIELDS:", fields);
    console.log("FILES:", files);

    const file = files.proof?.[0]; // Access the first file in the array

    if (!file || !file.filepath) {
      console.error("Missing file or filepath");
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const stream = fs.createReadStream(file.filepath); // This line crashes if filepath is undefined

      const uploadForm = new FormData();
      uploadForm.append("files", stream, file.originalFilename!);

      const uploadRes = await axios.post(
        `${process.env.STRAPI_URL}/api/upload`,
        uploadForm,
        {
          headers: {
            ...uploadForm.getHeaders(),
            "x-api-secret": process.env.API_SECRET!,
          },
        }
      );

      return res.status(200).json(uploadRes.data);
    } catch (err) {
      console.error("Upload failed:", err);
      return res.status(500).json({ error: "Upload failed" });
    }
  });
}
