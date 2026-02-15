---
name: 🐛 Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
---

**Describe the bug**

A clear and concise description of what the bug is.

**Your Workflow Snippet**

```yaml
- uses: crasivo/telegram-action@v1
  with:
  bot_token: ${{ secrets.TELEGRAM_TOKEN }}
  chat_id: ${{ secrets.CHAT_ID }}
  message_text: 'Test message'
```

**Action Logs**

Please provide the logs from the GitHub Action run.

> Tip: Look for "--- Outgoing Telegram Request ---" in your logs.

**Expected behavior**

What should have happened?

## **Environment:**

- Action Version: [e.g. v1.1.0]
- Parse Mode: [e.g. HTML, MarkdownV2]
