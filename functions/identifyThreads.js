async function identifyThreads(emails, gmail) {
    try {
        const threads = [];
        const threadIds = [];

        for (const email of emails) {
            const threadId = email.threadId;

            // Check if the thread has already been processed
            if (threadIds.includes(threadId)) {
                continue;
            }

            const response = await gmail.users.threads.get({
                userId: 'me',
                id: threadId,
                format: 'full' // We can also use minimal, using full so that new features can be added.
            });

            const thread = response.data;
            const messages = thread.messages;

            //un-replied thread checking logic:
            let sentflag = 0;
            for (const msg of messages) {
                if (msg.labelIds.includes("SENT")) {
                    sentflag = 1;
                }
            }
            // Check if any of the messages in the thread were sent by you
            if (sentflag == 1) continue;
            //if not
            else threads.push(threadId);

            // console.log(messages[0].labelIds);
            threadIds.push(threadId);
        }
        return threads;

    } catch (error) {
        console.error('Error identifying threads:', error);
        return [];
    }
}

module.exports = identifyThreads;
