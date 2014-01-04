#Ten20 API


### Location
The staging version of the API is running at http://ten20live.com:3001

### Authentication

### Collections

#### /trackers

The trackers collection contains objects that represent GPS tracking devices.

A tracker object always has a ```userId``` variable - a reference to the user that owns the tracker


By convention, tracker objects contain:

##### Last message object
The last message object (lastMessage) contains the last message sent by the tracking device. The contents of lastMessage is tracker protocol specific but typically it will contain a longitude latitude.

##### Settings object
The settings object contains tracker specific settings


#### /recent_messages

The recent_messages collection contains objects that represent recent messages sent by the trackers that have not yet been combined into a trip. The contents of a message object are tracker protocol specific but typically contain a latitude and longitude.

A recent_message object always has:
 * ```_id``` - the object id
 * ```userId``` - a reference to the user that owns the message
 * ```trackerId``` - a reference to the tracker that owns the message


Recent messages can be fetched on a per tracker basis to avoid the client having to work out which message is associated with which tracker e.g.

    /recent_messages?trackerId=52c5e10e6c7a4aa52000029c

where ```52c5e10e6c7a4aa52000029c``` is a valid tracker id.

#### /trips

A trip object always has the following variables:
 * ```_id``` - the object id
 * ```userId``` - a reference to the user that owns the trip
 * ```trackerId``` - a reference to the tracker that owns the trip
 * ```startTime``` - the time when the trip started
 * ```endTime``` - the time when the trip ended
 * ```messages``` - an array of tracker protocol specific messages, that typically contains latitdue, longitude and timesamps. The content of the message objects is the same as the messages in the recent_messages collection.

The trips collection contains trips formed by combining recent messages.

The durations of future trips are configured using the ```tripDuration``` variable in the tracker object assocaited with the trip. Trip durations are described using an integer in ms e.g. 10800000 represents 3 hours. If the ```tripDuration``` is not specified in the tracker object, trips will default to 6 hours in duration.

Trips can be fetched on a per tracker basis to avoid the client having to work out which trip is associated with which tracker e.g.

    /trips?trackerId=52c5e10e6c7a4aa52000029c

where ```52c5e10e6c7a4aa52000029c``` is a valid tracker id.


