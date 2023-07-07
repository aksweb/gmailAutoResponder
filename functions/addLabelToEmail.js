async function addLabelToEmail(threadId, labelName, gmail) {
    try {
        // Check if the label already exists
        const labelsResponse = await gmail.users.labels.list({ userId: 'me' });
        const labels = labelsResponse.data.labels;
        const label = labels.find(label => label.name === labelName);

        let labelId;
        if (label) {
            // If the label exists, retrieve its ID
            labelId = label.id;
        } else {
            // If the label doesn't exist, create it
            const newLabel = await gmail.users.labels.create({
                userId: 'me',
                resource: { name: labelName }
            });
            labelId = newLabel.data.id;
        }

        // Add the label to the email (thread)
        await gmail.users.threads.modify({
            userId: 'me',
            id: threadId,
            resource: { addLabelIds: [labelId] }
        });

        console.log('Label added and email moved successfully!');
    } catch (error) {
        console.error('Error adding label and moving email:', error);
    }
}
module.exports = addLabelToEmail;
