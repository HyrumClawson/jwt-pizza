import { test, expect } from 'playwright-test-coverage';

test('home page', async ({ page }) => {
  //someday prolly will need to change this to actual website
  await page.goto('http://localhost:5173');

  expect(await page.title()).toBe('JWT Pizza');
});



test('purchase with login', async ({ page }) => {
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
      { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: 'LotaPizza',
        stores: [
          { id: 4, name: 'Lehi' },
          { id: 5, name: 'Springville' },
          { id: 6, name: 'American Fork' },
        ],
      },
      { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
      { id: 4, name: 'topSpot', stores: [] },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'd@jwt.com', password: 'a' };
    const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/order', async (route) => {
    const orderReq = {
      items: [
        { menuId: 1, description: 'Veggie', price: 0.0038 },
        { menuId: 2, description: 'Pepperoni', price: 0.0042 },
      ],
      storeId: '4',
      franchiseId: 2,
    };
    const orderRes = {
      order: {
        items: [
          { menuId: 1, description: 'Veggie', price: 0.0038 },
          { menuId: 2, description: 'Pepperoni', price: 0.0042 },
        ],
        storeId: '4',
        franchiseId: 2,
        id: 23,
      },
      jwt: 'eyJpYXQ',
    };
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes });
  });

  await page.goto('http://localhost:5173');

  // Go to order page
  await page.getByRole('button', { name: 'Order now' }).click();

  // Create order
  await expect(page.locator('h2')).toContainText('Awesome is a click away');
  await page.getByRole('combobox').selectOption('4');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await expect(page.locator('form')).toContainText('Selected pizzas: 2');
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Login
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  // Pay
  await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
  await expect(page.locator('tbody')).toContainText('Veggie');
  await expect(page.locator('tbody')).toContainText('Pepperoni');
  await expect(page.locator('tfoot')).toContainText('0.008 ₿');
  await page.getByRole('button', { name: 'Pay now' }).click();

  // Check balance
  await expect(page.getByText('0.008')).toBeVisible();
});






test('Register and Logout', async ({ page }) => {

  //intercepting the post for auth 
  await page.route('*/**/api/auth', async (route) => {
    const request = route.request();
    if (request.method() === 'POST') {
      const loginReq = {
        "name": "Hyrum",
        "email": "hyrum@mail",
        "password": "123"
      };
      const loginRes = {
        "user": {
          "name": "Hyrum",
          "email": "hyrum@mail",
          "roles": [
            {
              "role": "diner"
            }
          ],
          "id": 17
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSHlydW0iLCJlbWFpbCI6Imh5cnVtQG1haWwiLCJyb2xlcyI6W3sicm9sZSI6ImRpbmVyIn1dLCJpZCI6MTcsImlhdCI6MTczOTUwNTgyNX0.jx0WNNhhDsM8A4HFSOUakHbNHhL5FtQpqE3b6tae6T0"
      };
      expect(route.request().method()).toBe('POST');
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });

    }
    else{
      const logoutRes = {
        "message": "logout successful"
      }
      expect(route.request().method()).toBe('DELETE');
      await route.fulfill({json: logoutRes})
    }
    
  });

  await page.route('*/**/api/order', async (route) => {
    const orderRes = {
      "dinerId": 21,
      "orders": [],
      "page": 1
    }
    expect(route.request().method()).toBe('GET');
    await route.fulfill({json: orderRes});
  })





  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('Hyrum');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('hyrum@mail');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('123');
  await page.getByRole('button', { name: 'Register' }).click();
  await page.getByRole('link', { name: 'H', exact: true }).click({
    button: 'right'
  });
  await expect(page.getByLabel('Global')).toContainText('H');
  await page.getByRole('link', { name: 'H', exact: true }).click();
  await page.getByText('Hyrum', { exact: true }).click({
    button: 'right'
  });
  await expect(page.getByRole('main')).toContainText('Hyrum');
  await page.getByRole('link', { name: 'Logout' }).click();
});









test('login franchisee and create then close store', async ({ page }) => {

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = {
      "email": "f@jwt.com",
      "password": "franchisee"
    };
    const loginRes = {
      "user": {
        "id": 3,
        "name": "pizza franchisee",
        "email": "f@jwt.com",
        "roles": [
          {
            "role": "diner"
          },
          {
            "objectId": 1,
            "role": "franchisee"
          },
          {
            "objectId": 2,
            "role": "franchisee"
          },
          {
            "objectId": 9,
            "role": "franchisee"
          }
        ]
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6InBpenphIGZyYW5jaGlzZWUiLCJlbWFpbCI6ImZAand0LmNvbSIsInJvbGVzIjpbeyJyb2xlIjoiZGluZXIifSx7Im9iamVjdElkIjoxLCJyb2xlIjoiZnJhbmNoaXNlZSJ9LHsib2JqZWN0SWQiOjIsInJvbGUiOiJmcmFuY2hpc2VlIn0seyJvYmplY3RJZCI6OSwicm9sZSI6ImZyYW5jaGlzZWUifV0sImlhdCI6MTczOTUxOTMyMH0.tviecIFBIJ9sO4m2fkawdmHBQojGH3QpaX5JSEbuBDM"
    };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });


  await page.route('*/**/api/franchise/3', async (route) => {
    let firstCall = true;
    //const request = route.request();

    // if(firstCall){
    //   const storesRes = [
    //     {
    //       "id": 1,
    //       "name": "pizzaPocket",
    //       "admins": [
    //         {
    //           "id": 3,
    //           "name": "pizza franchisee",
    //           "email": "f@jwt.com"
    //         }
    //       ],
    //       "stores": [
    //         {
    //           "id": 1,
    //           "name": "SLC",
    //           "totalRevenue": 0
    //         }
    //       ]
    //     },
    //     {
    //       "id": 9,
    //       "name": "yummers",
    //       "admins": [
    //         {
    //           "id": 3,
    //           "name": "pizza franchisee",
    //           "email": "f@jwt.com"
    //         }
    //       ],
    //       "stores": []
    //     },
    //     {
    //       "id": 2,
    //       "name": "YummyPizza",
    //       "admins": [
    //         {
    //           "id": 3,
    //           "name": "pizza franchisee",
    //           "email": "f@jwt.com"
    //         }
    //       ],
    //       "stores": []
    //     }
    //   ];
    //   expect(route.request().method()).toBe('GET');
    //   await route.fulfill({ json: storesRes });
    //   firstCall = false;
    // }
    // else{
      const storesRes = [
        {
          "id": 1,
          "name": "pizzaPocket",
          "admins": [
            {
              "id": 3,
              "name": "pizza franchisee",
              "email": "f@jwt.com"
            }
          ],
          "stores": [
            {
              "id": 1,
              "name": "SLC",
              "totalRevenue": 0
            },
            {
              "id": 20,
              "name": "TestStore",
              "totalRevenue": 0
            }
          ]
        },
        {
          "id": 9,
          "name": "yummers",
          "admins": [
            {
              "id": 3,
              "name": "pizza franchisee",
              "email": "f@jwt.com"
            }
          ],
          "stores": []
        },
        {
          "id": 2,
          "name": "YummyPizza",
          "admins": [
            {
              "id": 3,
              "name": "pizza franchisee",
              "email": "f@jwt.com"
            }
          ],
          "stores": []
        }
      ];
      expect(route.request().method()).toBe('GET');
      await route.fulfill({ json: storesRes });
  //}

  });

  await page.route('*/**/api/franchise/1/store', async (route) => {
    const newStoreReq = {
      "id": "",
      "name": "TestStore"
    };
    const newStoreRes = {
      "id": 20,
      "franchiseId": 1,
      "name": "TestStore"
    };
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(newStoreReq);
    await route.fulfill({ json: newStoreRes });
  });


  await page.route('*/**/api/franchise/1/store/20', async (route) => {
    const newStoreRes = {
      "message": "store deleted"
    };
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: newStoreRes });
  });



  await page.goto('http://localhost:5173/');
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await page.getByRole('link', { name: 'login', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('button', { name: 'Create store' })).toBeVisible();
  await page.getByRole('button', { name: 'Create store' }).click();
  await page.getByRole('textbox', { name: 'store name' }).click();
  await page.getByRole('textbox', { name: 'store name' }).fill('TestStore');
  await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
  await page.getByRole('button', { name: 'Create' }).click();
  //this next line should work...
  await expect(page.getByText('pizzaPocketEverything you')).toBeVisible();
  await expect(page.getByRole('row', { name: 'TestStore 0 ₿ Close' }).getByRole('button')).toBeVisible();
  await expect(page.getByRole('row', { name: 'TestStore 0 ₿ Close' }).getByRole('button')).toBeVisible();
  await page.getByRole('row', { name: 'TestStore 0 ₿ Close' }).getByRole('button').click();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
});








test('login as admin and open new franchise then close it', async ({ page }) => {
  
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('button', { name: 'Add Franchise' })).toBeVisible();
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).fill('Happy');
  await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
  await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('f@jwt.com');
  await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('row', { name: 'Happy pizza franchisee Close' }).getByRole('button')).toBeVisible();
  await page.getByRole('row', { name: 'Happy pizza franchisee Close' }).getByRole('button').click();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
});































// test('login as admin and open new franchise', async ({ page }) => {

//   // await page.route('*/**/api/auth', async (route) => {
//   //   const loginReq = { email: 'd@jwt.com', password: 'a' };
//   //   const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
//   //   expect(route.request().method()).toBe('PUT');
//   //   expect(route.request().postDataJSON()).toMatchObject(loginReq);
//   //   await route.fulfill({ json: loginRes });
//   // });

//   await page.route('*/**/api/auth', async (route) => {
//     const loginReq = {email: 'a@jwt.com', password: 'admin'};
//     const loginRes = 
//       {
//         "user": {
//           "id": 1,
//           "name": "常用名字",
//           "email": "a@jwt.com",
//           "roles": [
//             {
//               "role": "admin"
//             }
//           ]
//         },
//         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IuW4uOeUqOWQjeWtlyIsImVtYWlsIjoiYUBqd3QuY29tIiwicm9sZXMiOlt7InJvbGUiOiJhZG1pbiJ9XSwiaWF0IjoxNzM5NDkzMjc5fQ.rrHSyC3RtWAzk4q78AAFLAMSshd9wZqZQOHMbsHF7BU"
//       };

//     expect(route.request().method()).toBe('PUT');
//     expect(route.request().postDataJSON()).toMatchObject(loginReq);
//     await route.fulfill({ json: loginRes });
  
//   });












//   // await page.route('*/**/api/franchise', async (route) => {
//   //   const franchiseReq = {
//   //     "stores": [],
//   //     "id": 2,
//   //     "name": "YummyPizza",
//   //     "admins": [
//   //         {
//   //             "email": "f@jwt.com",
//   //             "id": 3,
//   //             "name": "pizza franchisee"
//   //         }
//   //     ]
//   //   };
//   //   const franchiseRes = [
//   //     {
//   //       "id": 1,
//   //       "name": "pizzaPocket",
//   //       "admins": [
//   //         {
//   //           "id": 3,
//   //           "name": "pizza franchisee",
//   //           "email": "f@jwt.com"
//   //         }
//   //       ],
//   //       "stores": [
//   //         {
//   //           "id": 1,
//   //           "name": "SLC",
//   //           "totalRevenue": 0
//   //         }
//   //       ]
//   //     },
//   //     {
//   //       "id": 2,
//   //       "name": "YummyPizza",
//   //       "admins": [
//   //         {
//   //           "id": 3,
//   //           "name": "pizza franchisee",
//   //           "email": "f@jwt.com"
//   //         }
//   //       ],
//   //       "stores": []
//   //     }
//   //   ];
//   //   expect(route.request().method()).toBe('POST');
//   //   expect(route.request().postDataJSON()).toMatchObject(franchiseReq);
//   //   await route.fulfill({ json: franchiseRes });

//   // });




 
  



// //Mock for Franchise aspect 
//   // await page.route('*/**/api/franchise', async (route) => {
//   //   const franchiseReq = {"stores":[],"id":"","name":"YummyPizza","admins":[{"email":"f@jwt.com"}]};
//   //   //{"stores":[],"id":"","name":"yummers","admins":[{"email":"f@jwt.com"}]}
//   //   const franchiseRes = 
//         // [
//         //   {
//         //     "id": 1,
//         //     "name": "pizzaPocket",
//         //     "admins": [
//         //       {
//         //         "id": 3,
//         //         "name": "pizza franchisee",
//         //         "email": "f@jwt.com"
//         //       }
//         //     ],
//         //     "stores": [
//         //       {
//         //         "id": 1,
//         //         "name": "SLC",
//         //         "totalRevenue": 0
//         //       }
//         //     ]
//         //   },
//         //   {
//         //     "id": 2,
//         //     "name": "YummyPizza",
//         //     "admins": [
//         //       {
//         //         "id": 3,
//         //         "name": "pizza franchisee",
//         //         "email": "f@jwt.com"
//         //       }
//         //     ],
//         //     "stores": []
//         //   }
//         // ];

//   //   expect(route.request().method()).toBe('POST');
//   //  // expect(route.request().postDataJSON()).toMatchObject(franchiseReq);
//   //   await route.fulfill({ json: franchiseRes });
  
//   // });


//   //go to page
//   await page.goto('http://localhost:5173/');

//   //login 
//   await page.getByRole('link', { name: 'Login' }).click();
//   await page.getByRole('textbox', { name: 'Email address' }).click();
//   await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
//   await page.getByRole('textbox', { name: 'Password' }).click();
//   await page.getByRole('textbox', { name: 'Password' }).fill('admin');
//   await page.getByRole('button', { name: 'Login' }).click();

//   //on admin page 
//   await expect(page.locator('#navbar-dark')).toContainText('Admin');
//   await page.getByRole('link', { name: 'Admin' }).click();

//   //adding franchise 
//   await page.getByRole('button', { name: 'Add Franchise' }).click();
//   await page.getByRole('textbox', { name: 'franchise name' }).click();
//   await page.getByRole('textbox', { name: 'franchise name' }).fill('YummyPizza');
//   await page.locator('div').filter({ hasText: 'Create franchiseWant to' }).nth(2).click();
//   await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
//   await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('f@jwt.com');
//   await page.locator('div').filter({ hasText: 'Create franchiseWant to' }).nth(2).click();
//   await page.getByRole('button', { name: 'Create' }).click();
// });








// await page.route('*/**/api/franchise', async (route) => {
//   const franchiseRes = [
//     {
//       "id": 1,
//       "name": "pizzaPocket",
//       "admins": [
//         {
//           "id": 3,
//           "name": "pizza franchisee",
//           "email": "f@jwt.com"
//         }
//       ],
//       "stores": [
//         {
//           "id": 1,
//           "name": "SLC",
//           "totalRevenue": 0
//         }
//       ]
//     },
//     {
//       "id": 2,
//       "name": "YummyPizza",
//       "admins": [
//         {
//           "id": 3,
//           "name": "pizza franchisee",
//           "email": "f@jwt.com"
//         }
//       ],
//       "stores": []
//     }
//   ];
//   expect(route.request().method()).toBe('GET');
//   await route.fulfill({ json: franchiseRes });
// });
