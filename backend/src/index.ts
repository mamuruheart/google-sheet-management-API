import express, { Request, Response } from 'express';
import { google } from 'googleapis';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Environment variables
const googleServiceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const spreadsheetId = process.env.SPREADSHEET_ID;
const googlePrivateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!googleServiceAccountEmail || !spreadsheetId || !googlePrivateKey) {
  console.error('Missing necessary environment variables.');
  process.exit(1); // Exit if any required variable is missing
}

// Authenticate with Google Sheets API
const auth = new google.auth.JWT(
  googleServiceAccountEmail,
  undefined,
  googlePrivateKey,
  ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth });

const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:5173', // Frontend origin
}));
app.use(express.json()); // Parse JSON bodies

// ✅ Function to write data into Google Sheet
const writeToSpreadsheet = async (formData: any) => {
  try {
    // Validate formData
    const { no, name,date } = formData;
    if (!name || !no || !date) {
      throw new Error('Missing required fields: name, email, or message');
    }

    const values = [
      [no, name, date] // Customize fields here
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A1', // Starting range
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });
    
    return response.data;
  } catch (err) {
    console.error('Error writing to Google Sheet:', err);
    throw err;
  }
};

// ✅ API endpoint
app.post('/writeSheet', async (req: Request, res: Response) => {
  try {
    const formData = req.body; // expects direct data, not nested in 'params'
    const result = await writeToSpreadsheet(formData);
    res.json({ success: true, result });
  } catch (error: any) {
    console.error('Failed to write to spreadsheet:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to write to spreadsheet' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
