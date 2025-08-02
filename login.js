import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const LOG_URL = 'http://20.244.56.144/evaluation-service/logs';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzYWJhcmlvZmZjbEBnbWFpbC5jb20iLCJleHAiOjE3NTQxMTg1NTIsImlhdCI6MTc1NDExNzY1MiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjZlN2RiOWJkLTgxOGUtNDBkYi05MGE3LThmYjM4NDU1NzI2OSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InNhYmFyaXNoIG0iLCJzdWIiOiJhMjY2NTMwMC0yNmI3LTRjMGUtODU3OS02MmNmZWM3OWY0NzIifSwiZW1haWwiOiJzYWJhcmlvZmZjbEBnbWFpbC5jb20iLCJuYW1lIjoic2FiYXJpc2ggbSIsInJvbGxObyI6IjkyMTMyMjEzMTY3IiwiYWNjZXNzQ29kZSI6InJCUGZTUyIsImNsaWVudElEIjoiYTI2NjUzMDAtMjZiNy00YzBlLTg1NzktNjJjZmVjNzlmNDcyIiwiY2xpZW50U2VjcmV0IjoiVURuSFFWQXNzdVZFa0FaZiJ9.voUIb7p8aLfmR1bK5MBHUwkntVek1-Wfz40BVqoRMME';
export async function Log(stack, level, pkg, message) {
  try {
    const res = await fetch(LOG_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Unknown error');
    }

    console.log('Log sent:', data);
    return data;
  } catch (err) {
    console.error('Failed to send log:', err.message || err);
    return { status:'Failed to send log', error: err.message || err };
  }
}

export default Log;
