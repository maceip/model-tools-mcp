#!/usr/bin/env node
// Stdio-to-Streamable-HTTP bridge for https://mcp.model.tools/mcp
import readline from 'node:readline';

const ENDPOINT = process.env.MODEL_TOOLS_MCP_URL || 'https://mcp.model.tools/mcp';
const PURPOSE = process.env.MODEL_TOOLS_PURPOSE || '';

const rl = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

rl.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch {
    return;
  }
  try {
    const headers = {
      'content-type': 'application/json',
      'accept': 'application/json, text/event-stream',
      'user-agent': 'model-tools-mcp-stdio/1.3.0',
    };
    if (PURPOSE) headers['x-session-purpose'] = PURPOSE;
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify(msg),
    });
    const text = await res.text();
    if (text && msg.id !== undefined) {
      process.stdout.write(text.trim() + '\n');
    }
  } catch (err) {
    if (msg && msg.id !== undefined) {
      process.stdout.write(
        JSON.stringify({
          jsonrpc: '2.0',
          id: msg.id,
          error: { code: -32603, message: String(err.message || err) },
        }) + '\n'
      );
    }
  }
});
