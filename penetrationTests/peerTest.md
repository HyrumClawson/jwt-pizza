## Self Attack 
| **Item** | **Result** |
|:--------|:-----------|
| Date      | April 15th 2025 |
|Target   | pizza.hyrumcpizza.click |
| Classification    | Injection |
| Severity  | 1 |
| Description  | Targeted the updateUser endpoint with sql statements that deleted user's emails and passwords |
| Images/more Description  | Unfortunately I was so busy trying to figure out what happened that I wasn't able to get screenshots of it. But here are the details of what happened. Essentially after sending a curl to the updateUser endpoint, I tried logging out my two users who were logged in. Yet they wouldn't log out, they would simply wait on the logging out screen. When I inspected the page I was told that logging out was unauthorized for the two users. So then when I tried logging in the users from a different webpage I was met with an "unknown user" message for both the two users. Even when I attempted to login the admin I was met with an unknown user message. I had to re-register both users, and only after re-registering them was I able to log them out. Before hand one of the user's id was 7 (cause he was the 7th user I assume) but after injecting the sql command and re-registering everyone he had a user id of 3. So I'm assuming that the sql injection worked. Or something else happened and I don't know what that was. Either way I worked for hours trying to get that sql injection to actually exploit that vulnerable endpoint. |
| Corrections  | Even if my sql injection attack didn't work, a smarter and more capable hacker could indeed exploit that endpoint. So we're going to make sure and sanitize the database query for the update User endpoint|

## Peer Attack: I wasn't able to find a partner so I was told by the TAs I could perform an attack against the class web service
| **Item** | **Result** |
|:--------|:-----------|
| Date      | April 15th 2025 |
|Target   | pizza.byucsstudent.click |
| Classification    | Injection |
| Severity  | 4 |
| Description  | Targeted the updateUser endpoint with sql statements, but was not able to have an effect |
| Images/more Description  |        <img width="530" alt="Screenshot 2025-04-15 at 6 02 33 PM" src="https://github.com/user-attachments/assets/ccd563c4-99cb-4c5b-a3de-bde1dc44531a" />  <img width="943" alt="Screenshot 2025-04-15 at 5 55 44 PM" src="https://github.com/user-attachments/assets/eec01374-d725-45bb-a1b9-868dde8371b7" />
          |
| Corrections  | It would appear that a sanitation process has already been implemented on their end of things. Which is fantastic |

