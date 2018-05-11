import httplib2
import os

from apiclient import discovery
import oauth2client
from oauth2client import client
from oauth2client import tools

try:
    import argparse
    flags = argparse.ArgumentParser(parents=[tools.argparser]).parse_args()
except ImportError:
    flags = None


SCOPES = 'https://mail.google.com/'
CLIENT_SECRET_FILE = 'client_secret.json'
APPLICATION_NAME = 'Gmail API Quickstart'


def get_credentials():
    """Gets valid user credentials from storage.

    If nothing has been stored, or if the stored credentials are invalid,
    the OAuth2 flow is completed to obtain the new credentials.

    Returns:
        Credentials, the obtained credential.
    """
    home_dir = os.path.expanduser('~')
    credential_dir = os.path.join(home_dir, '.credentials')
    if not os.path.exists(credential_dir):
        os.makedirs(credential_dir)
    credential_path = os.path.join(credential_dir,
                                   'gmail-quickstart.json')

    store = oauth2client.file.Storage(credential_path)
    credentials = store.get()
    if not credentials or credentials.invalid:
        flow = client.flow_from_clientsecrets(CLIENT_SECRET_FILE, SCOPES)
        flow.user_agent = APPLICATION_NAME
        if flags:
            credentials = tools.run_flow(flow, store, flags)
        else:  # Needed only for compatability with Python 2.6
            credentials = tools.run(flow, store)
        print('Storing credentials to ' + credential_path)
    return credentials


import base64
from email.mime.audio import MIMEAudio
from email.mime.base import MIMEBase
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import mimetypes
from httplib2 import Http

from apiclient import errors

from apiclient.discovery import build

credentials = get_credentials()
service = build('gmail', 'v1', http=credentials.authorize(Http()))

# Dont touch stuff above this

import json
import requests


def scrapeDatabase(database):

    # takes the data from the JSON and assigns it a variable
    title = database['items'][-1]["title"]
    msg = database['items'][-1]["message"]
    date = database['items'][-1]["end_date"]
    evt_url = database['items'][-1]["event_url"]

    return [title, msg, date, evt_url]


def writeHTML(data, file):
    html = file.read()
    # finds the placeholders (**   **) and replaces them with the appropriate data
    html = html.replace("**title**", data[0])
    html = html.replace("**message**", data[1])
    html = html.replace("**date**", data[2])
    html = html.replace("**url**", data[3])

    return html


def SendMessage(service, message):
    """Send an email message.

    Args:
      service: Authorized Gmail API service instance.
      user_id: User's email address. The special value "me"
      can be used to indicate the authenticated user.
      message: Message to be sent.

    Returns:
      Sent Message.
    """
    try:
        message = (service.users().messages().send(
            userId="me", body=message).execute())
        print('Message Id: %s' % message['id'])
        return message
    except(errors.HttpError, error):
        print('An error occurred: %s' % error)


def CreateMessage(sender, to, subject, message_text):
    """Create a message for an email.

    Args:
      sender: Email address of the sender.
      to: Email address of the receiver.
      subject: The subject of the email message.
      message_text: The text of the email message.

    Returns:
      An object containing a base64 encoded email object.
    """
    message = MIMEText(message_text, 'html')
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject
    return {'raw': base64.urlsafe_b64encode(message.as_string().encode()).decode()}


# people who should receive this email
recipients = ["**REDACTED**"]

# get JSON from github in usable format
r = requests.get(
    'https://raw.githubusercontent.com/nickeloz/fbmelhack18/master/backend/db.json')
database = r.json()

# take the useful information from the latest event
data = scrapeDatabase(database)

# open the HTML template and put the data into it
file = open("/Users/corhug112/Documents/myhackathon/index.html", 'r')
newFile = writeHTML(data, file)

# create and then send the email
for i in recipients:
    print(i)
    finalMessage = CreateMessage('**REDACTED**', i, data[0], newFile)
    send = SendMessage(service, finalMessage)
