const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

//
const identifyThreads = require('./functions/identifyThreads');
const extractSenderEmails = require('./functions/extractSenderEmails');
const sendReplyToThreads = require('./functions/sendReplyToThreads');
//

// const jwtDecode = require('jwt-decode');
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.compose', 'https://mail.google.com/'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
let tk = "";
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);

        tk = google.auth.fromJSON(credentials);
        return tk;
    } catch (err) {
        return null;
    }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */


// #######################################################################################################################
// -----------------------------------------------------------------------------------------------------------------------
//APP CODE STARTS FROM HERE
// -----------------------------------------------------------------------------------------------------------------------

async function gmailAutoResponder(auth) {
    //gmail API authorization
    const gmail = google.gmail({ version: 'v1', auth });

    // extracting users email-id
    const reqEmail = await gmail.users.getProfile({
        userId: 'me',
    });
    const userEmail = reqEmail.data.emailAddress;

    //checking users gmail inbox
    const res = await gmail.users.messages.list({
        userId: 'me',
        labelIds: ['INBOX']
    });
    const emails = res.data.messages;
    // console.log(emails);

    // -----------------------------------------------------------------------------------------------------------------------
    //STEP 1 : EXTRACTING UN-REPLIED THREADS (EMAILS & FULL NAMES, WHICH WILL BE NEEDED DURING MESSAGE SENDING)
    // -----------------------------------------------------------------------------------------------------------------------
    const unRepliedThreads = await identifyThreads(emails, gmail);

    //this will give a string array containing both name and email id
    const senderIds = await extractSenderEmails(unRepliedThreads, gmail); //['Nikhil Chatterjee <belawanarwal@gmail.com>']

    //seperating email and name [{'Nikhil Chatterjee',  '<belawanarwal@gmail.com>'}, {} ]
    const toDetails = senderIds.map((str) => {
        const nameStartIndex = str.indexOf('');
        const nameEndIndex = str.indexOf(' <');
        const emailStartIndex = nameEndIndex + 1;

        const name = str.substring(nameStartIndex, nameEndIndex);
        const email = str.substring(emailStartIndex, str.length);

        return { name, email };
    });

    console.log(toDetails);
    // console.log("unreplied threads:", unRpTd);

    //user specific value
    const replyContent = "Right now, I am giving the project demo";
    let labelName = "openInApp";


    // -----------------------------------------------------------------------------------------------------------------------
    // STEP 2 & 3 SENDING REPLY & ADDING LABELS &  MOVING.
    // -----------------------------------------------------------------------------------------------------------------------
    if (toDetails.length != 0) {
        await sendReplyToThreads(unRepliedThreads, userEmail, toDetails, replyContent, labelName, gmail);
    }

    // -----------------------------------------------------------------------------------------------------------------------
    //STEP 4 : AUTOMATIC CALL IN RANDOM INTERVAL (b/w 45 to 120)
    // -----------------------------------------------------------------------------------------------------------------------
    const randomInterval = Math.floor(Math.random() * (120 - 45 + 1) + 45) * 1000; // Random interval in milliseconds
    setTimeout(async () => {
        await gmailAutoResponder(auth);
    }, randomInterval);

}

authorize().then(gmailAutoResponder).catch(console.error);
