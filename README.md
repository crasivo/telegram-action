# Telegram Notifier Action ⚡

[![Testing](https://github.com/crasivo/telegram-action/actions/workflows/test.yml/badge.svg)](https://github.com/crasivo/telegram-action/actions)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-20-green)

A lightweight and reliable GitHub Action for sending text messages and files to Telegram.
Built with a focus on logging transparency and ease of use for your OpenSource projects.

## 🚀 Quick Start

Example of a Workflow setup for sending a text message using the `sendMessage` method:

```yaml
- name: Notify Telegram
  uses: crasivo/telegram-action@v1
  with:
      bot_token: ${{ secrets.TELEGRAM_TOKEN }}
      chat_id: ${{ secrets.TELEGRAM_CHAT_ID }}
      message_text: '✅ Build completed successfully!'
```

Example of a Workflow setup for sending a file using the `sendDocument` method:

```yaml
- name: Send Report
  uses: crasivo/telegram-action@v1
  with:
      bot_token: ${{ secrets.TELEGRAM_TOKEN }}
      chat_id: ${{ secrets.TELEGRAM_CHAT_ID }}
      document: './build/report.pdf'
      document_caption: '📊 Build Report'
      reply_link_text: 'View Details'
      reply_link_url: 'https://example.com'
```

## 🔧 Parameters (Inputs)

| Parameter              | Description                                              | Required | Default |
| :--------------------- | :------------------------------------------------------- | :------: | :------ |
| `bot_token`            | Your bot token from [@BotFather](https://t.me/botfather) | **Yes**  | -       |
| `chat_id`              | Target chat ID or channel @username                      | **Yes**  | -       |
| `message_text`         | Message text (or caption for files)                      |    No    | -       |
| `document`             | Path to a local file to send                             |    No    | -       |
| `parse_mode`           | Formatting: `HTML`, `Markdown`, or `MarkdownV2`          |    No    | `HTML`  |
| `reply_link_text`      | Label for the inline URL button                          |    No    | -       |
| `reply_link_url`       | URL for the inline button                                |    No    | -       |
| `disable_notification` | Sends the message silently                               |    No    | `false` |
| `protect_content`      | Prevents forwarding and saving of content                |    No    | `false` |

You can find the full list of parameters in the [action.yml](action.yml) file.

---

## 🛡️ Security

Please refer to our [Security Policy](SECURITY.md).
Always use GitHub Secrets to store your tokens!

## 📜 License

This project is licensed under the [MIT License](https://en.wikipedia.org/wiki/MIT_License). The full license text is available in
the [LICENSE](LICENSE) file.

---

<p align="center">Made with ❤️ for developers</p>
