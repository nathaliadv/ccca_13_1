# Clean Code e Clean Architecture - Class 1


In the class, the following use case were implemented:

**UC1 - Signup**
```
Actors: Passenger, Driver

* must check if the email already exists and throw an error if it already exists
* must generate the account_id (uuid)
* must validate name, email and CPF
* must generate account verification code
* must send an account verification email with a link containing the code (for now, we are using a console.log)

Read Model - GetAccount

Input: account_id

Output: all the informations about the account
```

For the following (class 2) it is necessary to implement the use cases below using TDD:

**UC2 - Request a ride**
```
Actor: Passenger

Input: passenger_id (account_id), from (lat, long), to (lat, long)

Output: ride_id

Rules:

* must check if the account_id has is_passenger true
* you must check that there is no longer a passenger ride with status 'requested', 'accepted', 'in_progress', if there is, an error will be thrown
* must generate the ride_id (uuid)
* must set status to "requested"
* must set date to the current date
```

**UC3 - Accept ride**
```
Actor: Driver

Input: ride_id, driver_id (account_id)

Output: void

Rules:

* must check if the account_id has is_driver true
* should check if the rice status is "requested", if not, throw an error
* must check if the driver already has another rice with status "accepted" or "in_progress", if it has throw an error
* must associate the driver_id in the rice
* must change status to "accepted"

Read Model - GetRide

Input: ride_id

Output: all the informations about the ride
```

This content is part of Clean Code and Clean Architecture course from Branas.io.

For more information access:
https://branas.io# ccca_13_1
