# Node.js Gmail Autoresponder App

This is a Node.js-based application that allows you to automate email responses while you're on vacation. It utilizes the Gmail API to check for new emails, send replies, add labels, and move emails to specific labels. The app runs as a background process and repeats the sequence of actions at random intervals between 45 to 120 seconds.

## Features

- **Email Check**: The app checks for new emails in a given Gmail mailbox using the Gmail API. It authenticates the user with their Gmail account to access the mailbox.

- **Unreplied Email Identification**: The app identifies email threads that have no prior replies by the user. It filters out threads where the user has already sent a reply.

- **Reply to Emails**: The app sends replies to the identified email threads. It crafts a reply email with customizable content and sends it to the original sender.

- **Labeling and Moving Emails**: After sending the reply, the app adds a label to the email thread and moves it to the labeled category in Gmail. If the label doesn't exist, the app creates it using the Gmail API.

- **Random Interval Execution**: The app repeats the sequence of checking emails, sending replies, and labeling/moving emails at random intervals between 45 to 120 seconds. This randomness adds a natural delay to the automated responses.

## Prerequisites

Before running the Node.js app, make sure you have the following:

- Node.js installed on your machine.
- A Gmail account to access the mailbox.
- Enable the Gmail API and obtain the necessary credentials (client ID, client secret, and refresh token) by creating a project on the Google Cloud Platform.

## Installation and Usage

1. Clone the repository to your local machine.
2. Install the dependencies by running `npm install` in the project directory.
3. Place your `credentials.json` file (obtained from the Google Cloud Platform) in the project directory.
4. Run the app using `node .` or `node index.js`.
5. The app will prompt you to authorize the Gmail API access. Follow the instructions to grant permission.
6. The app will start checking for new emails and automatically respond to unreplied threads.
7. Customize the reply content, label name, and intervals as per your requirements.

## Configuration

- **Reply Content**: Modify the `replyContent` variable in the `sendReplyToThreads` function to customize the content of the reply email.

- **Label Name**: Change the `labelName` variable in the `sendReplyToThreads` function to set the label name for tagging the emails.

- **Random Interval Range**: Adjust the interval range in the `gmailAutoResponder` function by modifying the values in the `Math.random()` calculation to fit your desired range.

## Error Handling

The app includes error handling to handle various scenarios such as authentication failures, API errors, and email sending issues. Any errors encountered during the execution are logged to the console for easy troubleshooting. Make sure to review the error messages and handle them accordingly.

## Conclusion

The Node.js Gmail Autoresponder app provides a convenient way to automate email responses during your vacation or absence. By leveraging the Gmail API, the app checks for new emails, sends personalized replies, and organizes the mailbox with labeled threads. The random interval execution adds a human-like delay, ensuring that the automated responses feel more natural. Feel free to customize the app as per your requirements and enjoy your stress-free vacation while staying connected with your email correspondents.

**Note**: Remember to keep your `token.json` and `credentials.json` files secure and avoid committing them to a public Git repository. Properly configure your `.gitignore` file to exclude these sensitive files from version control.

For detailed instructions and code implementation, refer to index.js and functions folder.

---
