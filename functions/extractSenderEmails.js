async function extractSenderEmails(threads, gmail) {
    try {
        const senderEmails = [];

        for (const threadId of threads) {
            const response = await gmail.users.threads.get({
                userId: 'me',
                id: threadId,
                format: 'full'
            });
            // console.log(response);
            const thread = response.data;
            const messages = thread.messages;

            for (const message of messages) {
                const headers = message.payload.headers;

                //finding logic:
                const fromHeader = headers.find(header => header.name === 'From');
                if (fromHeader) {
                    const senderEmail = fromHeader.value;
                    senderEmails.push(senderEmail);
                }
            }
        }
        return senderEmails;

    } catch (error) {
        console.error('Error extracting sender emails:', error);
        return [];
    }
}

module.exports = extractSenderEmails;
