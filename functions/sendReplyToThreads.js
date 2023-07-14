const addLabelToEmail = require('./addLabelToEmail');

async function sendReplyToThreads(threads, userEmail, toDetails, replyContent, labelName, gmail) {
    try {
        let i = 0;
        for (const threadId of threads) {
            const replyMessage = {
                userId: 'me',
                resource: {
                    threadId: threadId,
                    raw: Buffer.from(
                        `From: "OpenInApp" <${userEmail}>\r\n` +
                        `To: ${toDetails[i].name} ${toDetails[i].email}\r\n` +
                        `Subject: Re: Just testing, nothing serious.\r\n` +
                        `\r\n` +
                        `${replyContent}`
                    ).toString('base64'),
                },
            };

            await gmail.users.messages.send(replyMessage);
            console.log("Sinding Reply..");
            console.log('Reply sent for thread:', threadId);

            await addLabelToEmail(threadId, labelName, gmail);

            i++;
        }
    } catch (error) {
        console.error('Error sending replies:', error);
    }
}


module.exports = sendReplyToThreads;