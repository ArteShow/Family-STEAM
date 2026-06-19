# API Test Report

## Test Method

The backend routes were reviewed against the service entrypoints and gateway mappings after the repair pass. The service modules were also compiled successfully.

## Results

| Endpoint | Method | Expected Result | Status |
| --- | --- | --- | --- |
| `/api/v1/auth/register` | POST | Create a user | Verified in gateway and auth service route wiring |
| `/api/v1/auth/user-register` | POST | Create a user through the user-facing form | Verified in gateway and auth service route wiring |
| `/api/v1/auth/login` | POST | Return JWT token | Verified in gateway and auth service route wiring |
| `/api/v1/auth/verify` | POST | Validate user identity | Verified in gateway and auth service route wiring |
| `/api/v1/file/upload` | POST | Upload file as admin | Verified in gateway route wiring |
| `/api/v1/file/download` | GET | Download file | Verified in gateway route wiring |
| `/api/v1/file/delete` | DELETE | Delete file as admin | Verified in gateway route wiring |
| `/api/v1/file/list` | GET | List files | Verified in gateway route wiring |
| `/api/v1/client/create` | POST | Create client | Verified in gateway route wiring |
| `/api/v1/client/delete` | DELETE | Delete client as admin | Verified in gateway route wiring |
| `/api/v1/client/get` | GET | Get client as admin | Verified in gateway route wiring |
| `/api/v1/client/update` | PUT | Update client as admin | Verified in gateway route wiring |
| `/api/v1/client/list` | GET | List clients as admin | Verified in gateway route wiring |
| `/api/v1/calendar/create` | POST | Create calendar event as admin | Verified in gateway route wiring |
| `/api/v1/calendar/delete` | DELETE | Delete calendar event as admin | Verified in gateway route wiring |
| `/api/v1/calendar/update-images` | PUT | Update calendar images as admin | Verified in gateway route wiring |
| `/api/v1/calendar/update` | PUT | Update calendar event as admin | Verified in gateway route wiring |
| `/api/v1/calendar/get` | GET | Get calendar event | Verified in gateway route wiring |
| `/api/v1/calendar/getAll` | GET | List calendar events | Verified in gateway route wiring |
| `/api/v1/ticket/create` | POST | Create ticket with user JWT | Verified in gateway route wiring |
| `/api/v1/ticket/getByEmail` | GET | Admin ticket lookup | Verified in gateway route wiring |
| `/api/v1/ticket/getByUser` | GET | Get tickets for logged-in user | Verified in gateway route wiring |
| `/api/v1/ticket/close` | POST | Close ticket with user JWT | Verified in gateway route wiring |
| `/api/v1/ticket/getAll` | GET | List all tickets as admin | Verified in gateway route wiring |
| `/api/v1/ticket/respond` | POST | Respond to ticket as admin | Verified in gateway route wiring |
| `/api/v1/ticket/delete` | DELETE | Delete ticket as admin | Verified in gateway route wiring |
| `/api/v1/message/adminSend` | POST | Send admin message | Verified in gateway route wiring |
| `/api/v1/message/adminInbox` | GET | View admin inbox | Verified in gateway route wiring |
| `/api/v1/message/adminThread` | GET | View admin thread | Verified in gateway route wiring |
| `/api/v1/message/adminDelete` | DELETE | Delete admin message | Verified in gateway route wiring |
| `/api/v1/message/userReply` | POST | User reply message | Verified in gateway route wiring |
| `/api/v1/message/userInbox` | GET | User inbox | Verified in gateway route wiring |
| `/api/v1/message/userThread` | GET | User thread | Verified in gateway route wiring |
| `/api/v1/message/markRead` | POST | Mark message read | Verified in gateway route wiring |
| `/api/v1/newsletter/subscribe` | POST | Subscribe to newsletter | Verified in gateway route wiring |
| `/api/v1/newsletter/unsubscribe` | POST | Unsubscribe from newsletter | Verified in gateway route wiring |
| `/api/v1/newsletter/subscribers` | GET | List subscribers as admin | Verified in gateway route wiring |
| `/api/v1/newsletter/send` | POST | Send newsletter as admin | Verified in gateway route wiring |
| `/api/v1/newsletter/campaigns` | GET | List campaigns as admin | Verified in gateway route wiring |
| `/api/v1/review/create` | POST | Create review with user JWT | Verified in gateway route wiring |
| `/api/v1/review/adminCreate` | POST | Create review as admin | Verified in gateway route wiring |
| `/api/v1/review/getByCalendar` | GET | List reviews for a calendar item | Verified in gateway route wiring |
| `/api/v1/review/delete` | DELETE | Delete review as admin | Verified in gateway route wiring |
| `/api/v1/review/checkEligible` | GET | Check if user can review | Verified in gateway route wiring |

## Notes

- The route map is now consistent between the API gateway and the service entrypoints.
- Live HTTP execution should be performed after the Docker stack is running and healthy.
