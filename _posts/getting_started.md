{{{
    "title"    : "Getting started with ten20live",
    "tags"     : [ "ten20", "ten20live", "Phonelocator", "GPS", "trackers" ],
    "category" : "documentation",
    "date"     : "06-18-2014"
}}}

#What is ten20?
ten20live is a platform for tracking the location of people and things using GPS tracking devices and mobile apps.

#How do I use ten20 to track my Android mobile phone?
Join our [Google+ community and install the Phonelocator for ten20 beta](https://plus.google.com/u/0/communities/108779431073194538267)

After installing the app and signing up, you can [sign in to the ten20 webapp](/console) to see the location of your phone.

#How do I use ten20 to track my GPS tracking device?
If your tracking device uses a [supported protocol](/docs/category/protocols), you can point it to our server 176.58.124.210 port 1337.
How this is done depends on the particular device you are using. The device will usually come with some instructions that may help.

Some general tips:
* Use a SIM card that supports data
* Turn the SIM card PIN code off using a mobile phone before inserting it into the tracking device.
* Make sure you use the correct apn, username and password for your SIM card. - Check with your network operator / carrier if in doubt.

After pointing the device to our server:
* Sign up for the ten20 live [from the homepage](/).
* Sign into the [console](/console)
* Click "Add tracker".
* Type in the trackers IMEI or Serial number. This is the number that uniquely identifies the tracker, it's format depends on the particular device being used.
* Type in a name for the tracker
* Click "Add".

Our open [source location adapter](https://github.com/ten20/ten20location.io) supports all protocols on the same port, 1337.

#I have a question
[Ask on reddit](http://www.reddit.com/r/ten20/)
