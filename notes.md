{# Learning notes

## JWT Pizza code study and debugging

As part of `Deliverable ⓵ Development deployment: JWT Pizza`, start up the application and debug through the code until you understand how it works. During the learning process fill out the following required pieces of information in order to demonstrate that you have successfully completed the deliverable.

| User activity                                       | Frontend component | Backend endpoints | Database SQL |
| --------------------------------------------------- | ------------------ | ----------------- | ------------ |
| View home page                                      |   home.jsx         |     none          |      none    |
| Register new user<br/>(t@jwt.com, pw: test)         |   register.jsx     |  [POST] /api/auth |    INSERT INTO user (name, email, password) VALUES (?, ?, ?) <br> INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?)|
|                                                     |                    |                   |              |
|                                                     |                    |                   |              |
| Login new user<br/>(t@jwt.com, pw: test)            | login.tsx|[PUT] /api/auth | SELECT * FROM user WHERE email=? <br> INSERT INTO auth (token, userId) VALUES (?, ?)          |
| Order pizza                                         | menu.tsx | [GET] /api/order/menu <br> [POST] /api/order <br> [GET] /api/franchise | INSERT INTO dinerOrder (dinerId, franchiseId, storeId, date) VALUES (?, ?, ?, now()) <br> SELECT * FROM menu<br>SELECT id, name FROM franchise <br> SELECT id, name FROM store WHERE franchiseId=?|
| Verify pizza                                        |delivery.tsx |[POST] /api/order/verify|  (come back to this|
| View profile page                                   |dinerDashboard.tsx|   none                |        none      |
| View franchise<br/>(as diner)                       | franchiseDashboard.tsx|[GET]/api/franchise/4|  none         |
| Logout                                              |logout.tsx|[DELETE] /api/auth|DELETE FROM auth WHERE token=?|
| View About page                                     | about.tsx  | none |   none           |
| View History page                                   | history.tsx  | none  |  none         |
| Login as franchisee<br/>(f@jwt.com, pw: franchisee) |login.tsx| [PUT] /api/auth  |SELECT * FROM user WHERE email=? <br> INSERT INTO auth (token, userId) VALUES (?, ?)              |
| View franchise<br/>(as franchisee)                  |franchiseDashboard.tsx|[GET]/api/franchise/3|SELECT objectId FROM userRole WHERE role='franchisee' AND userId=?              |
| Create a store                                      |createStore.tsx |[POST] /api/franchise/1/store |SELECT id, name FROM user WHERE email=?<br>INSERT INTO franchise (name) VALUES (?)<br>INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?)|
| Close a store                                       |                    |                   |              |
| Login as admin<br/>(a@jwt.com, pw: admin)           |                    |                   |              |
| View Admin page                                     |                    |                   |              |
| Create a franchise for t@jwt.com                    |                    |                   |              |
| Close the franchise for t@jwt.com                   |                    |                   |              |
