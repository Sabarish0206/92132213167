import { Url } from '../models/Url.js';
import Log from '../../login.js';

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";


const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateShortCode() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  const uniqueNum = timestamp + random;

  let shortCode = '';
  let num = uniqueNum;

  while (num > 0) {
    shortCode = characters[num % characters.length] + shortCode;
    num = Math.floor(num / characters.length);
  }

  return shortCode || Math.random().toString(36).substring(2, 8);
}

// POST /shorten - Create short URL
export async function shortenUrl(req, res) {
  const { longUrl } = req.body;

  if (!longUrl) {
    await Log('Missing longUrl', 'error', 'shortenUrl', 'No longUrl provided');
    return res.status(400).json({ error: 'longUrl is required' });
  }

  try {
    const existing = await Url.findOne({ longUrl });
    if (existing) {
      return res.json({ shortUrl: `${BASE_URL}/${existing.shortCode}` });
    }

    let shortCode;
    let exists = true;

    // Ensure uniqueness of the short code
    while (exists) {
      shortCode = generateShortCode();
      exists = await Url.findOne({ shortCode });
    }

    const newUrl = new Url({ longUrl, shortCode });
    await newUrl.save();

    await Log('URL Shortened', 'info', 'shortenUrl', `Shortened: ${shortCode}`);

    res.status(201).json({ shortUrl: `${BASE_URL}/${shortCode}` });
  } catch (err) {
    await Log(err.stack, 'error', 'shortenUrl', err.message);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function redirectUrl(req, res) {
  const { shortCode } = req.params;
  try {
    const urlDoc = await Url.findOne({ shortCode });

    if (!urlDoc) {
      await Log('Short code not found', 'warn', 'redirectUrl', shortCode);
      return res.status(404).json({ error: 'Short URL not found' });
    }

    res.redirect(urlDoc.longUrl);
  } catch (err) {
    await Log(err.stack, 'error', 'redirectUrl', err.message);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getAllShortUrls(req, res) {
  try {
    const allUrls = await Url.find().select('-__v');
    res.json(allUrls);
  } catch (err) {
    await Log(err.stack, 'error', 'getAllShortUrls', err.message);
    res.status(500).json({ error: 'Server error' });
  }
}
