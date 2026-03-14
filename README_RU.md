# Telegram Notifier Action ⚡

[![Testing](https://github.com/crasivo/telegram-action/actions/workflows/test.yml/badge.svg)](https://github.com/crasivo/telegram-action/actions)
![Version](https://img.shields.io/badge/version-1.1.0-blue)
![Node](https://img.shields.io/badge/node-24-green)

Легковесный и надежный GitHub Action для отправки текстовых сообщений и файлов в Telegram.
Разработан с упором на прозрачность логирования и простоту использования в ваших OpenSource проектах.

## 🚀 Быстрый старт

Пример настройки Workflow для отправки текстового сообщения через метод `sendMessage`:

```yaml
- name: Notify Telegram
  uses: crasivo/telegram-action@v1
  with:
      bot_token: ${{ secrets.TELEGRAM_TOKEN }}
      chat_id: ${{ secrets.TELEGRAM_CHAT_ID }}
      message_text: '✅ Сборка успешно завершена!'
```

Пример настройки Workflow для отправки текстового сообщения через метод `sendDocument`:

```yaml
- name: Send Report
  uses: crasivo/telegram-action@v1
  with:
      bot_token: ${{ secrets.TELEGRAM_TOKEN }}
      chat_id: ${{ secrets.TELEGRAM_CHAT_ID }}
      document: './build/report.pdf'
      document_caption: '📊 Отчет по сборке'
      reply_link_text: 'Открыть детали'
      reply_link_url: '[https://example.com](https://example.com)'
```

## 🔧 Параметры (Inputs)

| Параметр               | Описание                                                  | Обязателен | По умолчанию |
| :--------------------- | :-------------------------------------------------------- | :--------: | :----------- |
| `bot_token`            | Токен вашего бота от [@BotFather](https://t.me/botfather) |   **Да**   | -            |
| `chat_id`              | ID чата или @username канала                              |   **Да**   | -            |
| `message_text`         | Текст сообщения (или подпись к файлу)                     |    Нет     | -            |
| `document`             | Путь к локальному файлу для отправки                      |    Нет     | -            |
| `parse_mode`           | Форматирование: `HTML`, `Markdown` или `MarkdownV2`       |    Нет     | `HTML`       |
| `reply_link_text`      | Текст для кнопки-ссылки                                   |    Нет     | -            |
| `reply_link_url`       | URL для кнопки-ссылки                                     |    Нет     | -            |
| `disable_notification` | Отправляет сообщение без звука                            |    Нет     | `false`      |
| `protect_content`      | Запрет на пересылку и сохранение контента                 |    Нет     | `false`      |

Полный список параметров можно посмотреть в файле [action.yaml](action.yml).

---

## 🛡️ Безопасность

Пожалуйста, ознакомьтесь с нашей [Политикой безопасности](SECURITY_RU.md).
Всегда используйте GitHub Secrets для хранения ваших токенов!

## 📜 Лицензия

Данный проект распространяется по лицензии [MIT](https://en.wikipedia.org/wiki/MIT_License). Полный текст лицензии
доступен в файле [LICENSE](LICENSE).

---

<p align="center">Made with ❤️ for developers</p>
