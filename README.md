# model.tools MCP (`model-tools-mcp`)

Zero-auth utilities for autonomous agents when a workflow needs an instant email verification code, a key-value checkpoint across container restarts, an inbound webhook bin behind NAT, a delayed HTTP wakeup callback, or clean URL-to-Markdown extraction — with **no signup, no API key, and no OAuth**.

- **Remote Streamable HTTP Endpoint:** `https://mcp.model.tools/mcp`
- **REST API Twin:** `https://api.model.tools`
- **Agent Discovery (`llms.txt`):** `https://docs.model.tools/llms.txt`
- **Website:** `https://model.tools`

---

## Quick Connect

### 1. Remote Streamable HTTP (Recommended)

Add directly to Claude Desktop, Cursor, Windsurf, Cline, or any Streamable HTTP MCP client:

```json
{
  "mcpServers": {
    "model-tools": {
      "url": "https://mcp.model.tools/mcp"
    }
  }
}
```

### 2. Stdio Bridge (`npx`)

```json
{
  "mcpServers": {
    "model-tools": {
      "command": "npx",
      "args": ["-y", "github:maceip/model-tools-mcp"]
    }
  }
}
```

---

## Available Tools (10)

| Tool | Description |
| :--- | :--- |
| `get_email_verification_code` | Read `<inbox>@outbox.sh` (or HTTP inbox `<inbox>`) and extract the latest 6-digit OTP code, verification link, or magic link. Any inbox name works on demand with zero registration. |
| `save_agent_checkpoint` | Store or read a JSON/UTF-8 checkpoint at key `id` (`PUT`/`GET https://api.model.tools/api/v1/state/:id`) so multi-step runs survive container resets. |
| `schedule_agent_wakeup` | Queue a delayed HTTP `POST` callback to `callback_url` after `delay_sec` (`1`–`86400`s) to wake or resume a sleeping agent loop. |
| `receive_webhook_events` | Post or poll JSON webhook events at `hook_id` (`https://api.model.tools/api/v1/hook/:id`) when running inside a NATted or serverless sandbox. |
| `read_webpage_as_markdown` | Fetch any public `http(s)` webpage and return clean Markdown stripped of scripts and layout boilerplate. |
| `issue_task_receipt` | Issue a content-addressed task completion receipt (`r_...`) that downstream callers or peers can verify by URL. |
| `arm_tripwire_inbox` | Arm a watch on an inbox or state key that fires a JSON alert to `alert_url` the moment another party reads it. |
| `ask_agent_panel` | Submit a question to a 3-seat reference panel (`alpha`, `beta`, `gamma`) and receive individual responses plus a majority vote. |
| `handoff_dead_drop` | Store a read-once secret or token (`ttl_sec`) for peer-agent handoff; reading once burns the drop (`410 Gone` thereafter). |
| `arm_deadman_watchdog` | Arm a deadman timer (`deadline_sec`) that POSTs to `alert_url` if your agent stops pinging `/api/v1/watchdog/:id/ping`. |

---

## Plain HTTP / `curl` Examples

Every MCP tool has a 1:1 zero-auth REST endpoint on `https://api.model.tools`:

```bash
# 1. Poll an email inbox for the latest OTP / verification link
curl -s https://api.model.tools/api/v1/inbox/my-agent-run/latest_otp

# 2. Save and read a checkpoint
curl -s -X PUT https://api.model.tools/api/v1/state/run-42 \
  -H 'Content-Type: application/json' \
  -d '{"step":3,"cursor":"abc"}'
curl -s https://api.model.tools/api/v1/state/run-42

# 3. Inspect or post to a webhook bin
curl -s -X POST https://api.model.tools/api/v1/hook/build-7 \
  -H 'Content-Type: application/json' \
  -d '{"status":"ready"}'
curl -s https://api.model.tools/api/v1/hook/build-7

# 4. Schedule a wakeup callback
curl -s -X POST https://api.model.tools/api/v1/schedule \
  -H 'Content-Type: application/json' \
  -d '{"callbackUrl":"https://api.model.tools/api/v1/hook/wake-test","delaySec":30,"payload":{"resume":true}}'
```

## License

MIT
