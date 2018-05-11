#This script reads in a random item from the db.json database and formats it for json tweet request

import json
import random
#https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-statuses-update
#Lines to change: created_at
db = open("../backend/db.json")
db_json = json.loads("".join(db.readlines()))
db.close()

random_item = db_json["items"][random.randrange(0,len(db_json["items"]))]

#if more fields are needed, refactor with arrays to map fields in general:
#["message","event_url",...] => ["status", "attachment_url", ...]
msg,url = random_item["message"],""
if "event_url" in random_item:
    url = random_item["event_url"]
    
json_tweet = """
{
    "status" : "%s",
    "attachment_url" : "%s"
}
""" % (msg,url)

out = open("twitter_request.txt","w")
out.write(json_tweet)
out.close()
