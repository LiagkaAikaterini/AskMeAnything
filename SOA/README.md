# SOA Architecture

## In this architecture, we are using three main services:
 
* Statistics : Responsible for retrieving statistics regarding the data of AskMeAnything, like the number of questions per keyword or per day.
* User-Interaction : Responsible for all the business functionality needed when a user is interacting with others on the site, which in our case
means asking and answering questions.
* Manage-Users : Responsible for user authentication and data: This service  manages user registration, Sign In/Sign Up and access tokens.
It provides services to the other two services, by verifying the access token of a user when a request is send and by returning information 
about a specific user, when needed.

## In addition, we are using two lower level services: 

* Data-layer : This is a lower level service, used by User-Interaction and Statistics services, in order for them to access their shared database,
which keeps all data regarding questions, answers and keywords. This service is essentially an API for the database, allowing the access of
the database of the higher level services through an HTTPS interface.
* Data-layer-users : Much like the above service, this lower level service has the same purpose, but is used by the Manage-Users service, provideing
access to the database containing the user data. 

## Finally, the basic element of a Software Oriented Architecture is the ESB:

* Enterprise Service Bus: The enterprise service bus is the middleware, through which the three higher level services (User-Interaction,
Manage-Users, Statistcs) can exchange services, in an organized and strict manner. It provides a service management, service discovery and service
execution interface. Using the first, a service can offer its functionality to the outside world, through the service bus, and it can also register (and unregister) in order to use the service bus and provide its services. Using the second,
one can get a list of all available services that can be provided through the service bus. Using the third, a service can request a functionallity, after it has discovered it from the service discovery of the esb, that is provided by another service.

## For more detailed explanation someone can look at the project documentation the following diagrams:
* Component Diagram : SOA
* Sequence Diagram : SOA (ESB)
* Deployment Diagram : SOA