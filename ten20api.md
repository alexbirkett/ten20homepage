#Ten20 API


### Location
The staging version of the API is running at http://ten20live.com:3001

### Authentication

#### Credential object
The credential must currenly consist of an ```email``` and ```password```, e.g.:
    
    {
        email: 'test@ten20.com',
        password: 'passwordone'
    }


although future support for a credential considsing of ```username``` and ```password``` in addition to ```email``` and ```password``` will be added.


#### Sessions
Sessions are cookie based. 

#### Signup
Signup is achieved using the HTTP POST verb to send a credential object, which can optionally also contain other data, to the ```/signup``` endpoint.

POSTing to the ```/signup``` endpoint does *NOT* automatically sign in the user.

#### Signin
Signin is achieved using the HTTP POST verb to send a credential object to the ```/signin``` endpoint.

#### Signout
Signout is achieved by sending an HTTP get request to ```/signout```


#### Example using [request](https://github.com/mikeal/request)

    module.exports = function (url, request) {
        return {
            signUp: function (credential, callback) {
                request.post({url: url + '/signup', json: credential}, function (error, response, body) {
                    callback(error, response, body);
                });
            },
            signIn: function (credential, callback) {
                request.post({url: url + '/signin', json: credential}, function (error, response, body) {
                    callback(error, response, body);
                });
            },
            signOut: function(callback) {
                request.get(url + '/signout', function (error, response, body) {
                    callback(error, response, body);
                });
            },
            getUserInfo: function(callback) {
                request.get(url + '/user/info', function (error, response, body) {
                    callback(error, response, JSON.parse(body));
                });
            }
        }
    };


## Collections

### Collection endpoints

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

#### Interacting with collections via HTTP(s)

##### Adding objects to collections
Objects are added using the HTTP POST verb

An single JSON object or and array of objects can be POSTed to the collection endpoint.

##### Retrieving objects from collections

Objects are retrieved using the HTTP GET verb.

A GET request to the collection endpoint will retrieve an array of objects associated with logged in user. The objects will be contains in a variable called ```items```

A specific object can be requested by specifying its id, e.g sending a GET to.

```trackers/52c5e10e6c7a4aa52000029c``` will retrieve the tracker with id ```52c5e10e6c7a4aa52000029c```

##### Updating objects

Objects can be replaced using the HTTP PUT verb, e.g. sending a PUT to ```trackers/52c5e10e6c7a4aa52000029c``` 
will overwrite the object with the specified in the request body

Objects can be ammended using the [HTTP PATCH](http://tools.ietf.org/html/rfc5789) verb, e.g. sending a PATCH to ```trackers/52c5e10e6c7a4aa52000029c``` 
will overwrite only the JSON fields specified in the http request body. Fields not specified in the request body will not be modified.

##### Deleting objects

Objects can be deleted using the HTTP DELETE verb, e.g. sending a DELETE to ```trackers/52c5e10e6c7a4aa52000029c``` will delete the contents of the ```52c5e10e6c7a4aa52000029c``` object.

Sending DELETE to the collection endpoint without specifying an id will result in the entire collection being deleted.

