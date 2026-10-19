const { test, expect } = require('@playwright/test');

test.describe('Swagger Petstore API Automation Suite', () => {

  // Configure test.describe to run tests in serial mode to ensure proper order of execution
  test.describe.configure({ mode: 'serial' });
  
  // Global variable created for saving the ID of the pet created dynamically
  let generatedPetId; 
  const baseUrl = process.env.BASE_URL ?? 'https://petstore.swagger.io/v2/pet';

  // ==========================================
  // SECTION 1: ALL POSITIVE SCENARIOS
  // ==========================================
  test.describe('All Positive Scenarios', () => {

    test('TC-API-001 - Valid POST request untuk menambah pet baru', async ({ request }) => {

      const randomId = Math.floor(100000000 + Math.random() * 900000000);
      const response = await request.post(baseUrl, {
        data: {
            "id": randomId,
            "category": {
                "id": 0,
                "name": "Cat"
            },
            "name": "Big Miaw",
            "photoUrls": [
                "http://foo.bar.com/1"
            ],
            "tags": [
                {
                "id": 0,
                "name": "cat-pet-tag"
                }
            ],
            "status": "available"
        }
      });
      expect(response.status()).toBe(200);
      
      const responseBody = await response.json();
      expect(responseBody.name).toBe('Big Miaw');
      
      // save id from server used for delete scenario
      generatedPetId = responseBody.id;
    });

    test('TC-API-002 - Valid GET request untuk finds pet dengan status available', async ({ request }) => {
      const response = await request.get(`${baseUrl}/findByStatus?status=available`);
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);
    });

    test('TC-API-003 - Valid GET request untuk finds pet dengan status pending', async ({ request }) => {
      const response = await request.get(`${baseUrl}/findByStatus?status=pending`);
      expect(response.status()).toBe(200);
    });

    test('TC-API-004 - Valid GET request untuk finds pet dengan status sold', async ({ request }) => {
      const response = await request.get(`${baseUrl}/findByStatus?status=sold`);
      expect(response.status()).toBe(200);
    });

    test('TC-API-005 - Valid DELETE request untuk menghapus pet berdasarkan petId', async ({ request }) => {
      expect(generatedPetId).toBeDefined(); // makesure id from post is available
      
      const response = await request.delete(`${baseUrl}/${generatedPetId}`);
      expect(response.status()).toBe(200);
      
      const responseBody = await response.json();
      expect(responseBody.type).toBe('unknown');
      expect(responseBody.message).toBe(generatedPetId.toString());
    });

  });

  // ==========================================
  // SECTION 2: ALL NEGATIVE SCENARIOS
  // ==========================================
  test.describe('All Negative Scenarios', () => {

    test('TC-API-006 - Invalid POST request menambah pet baru dengan mengosongkan body request', async ({ request }) => {
      const response = await request.post(baseUrl, { data: {} });
      // actual result from postman is 200
      expect(response.status()).toBe(200); 
    });

    test('TC-API-007 - Invalid POST request menambah pet baru dengan mengosongkan field name', async ({ request }) => {
      const response = await request.post(baseUrl, {
        data: { "id": 12345, "status": "available" } // without name field
      });
      // actual result form postman is 200
      expect(response.status()).toBe(200);
    });

    test('TC-API-008 - Invalid POST request menambah pet baru dengan merubah id pet dengan teks (string)', async ({ request }) => {
      const response = await request.post(baseUrl, {
        data: { "id": "abc-test", "name": "Meong" }
      });
      expect(response.status()).toBe(500); // actual result from postman is 500, backend crash
    });

    test('TC-API-009 - Invalid POST request menambah pet baru dengan nilai status tidak valid', async ({ request }) => {
      const response = await request.post(baseUrl, {
        data: { "id": 0, "name": "Big Miaw Invalid", "status": "swimming" } // Wrong status
      });
      expect(response.status()).toBe(200); // actual result from postman is 200, data still created with invalid status
    });

    test('TC-API-010 - Valid GET request untuk finds pet dengan status tidak valid', async ({ request }) => {
      const response = await request.get(`${baseUrl}/findByStatus?status=nostatus-123`);
      expect(response.status()).toBe(200); 
      const responseBody = await response.json();
      // Actual result still provide 200 ok response with empty array
      expect(responseBody.length).toBe(0); 
    });

    test('TC-API-011 - Invalid DELETE request untuk menghapus pet dengan petId random', async ({ request }) => {
      const response = await request.delete(`${baseUrl}/123123123123`);
      expect(response.status()).toBe(404); // Not Found
    });

    test('TC-API-012 - Invalid DELETE request untuk menghapus pet format petId tidak valid', async ({ request }) => {
      const response = await request.delete(`${baseUrl}/abcd-pet`);
      expect(response.status()).toBe(404); // Actual result from postman, swagger return 404
    });

    test('TC-API-013 - Invalid DELETE request untuk menghapus pet dengan petId dikosongkan', async ({ request }) => {
      const response = await request.delete(`${baseUrl}/`);
      expect(response.status()).toBe(405); // Method Not Allowed because path changed to root endpoint
    });

    test('TC-API-014 - Invalid DELETE request dengan melakukan penghapusan ulang pada data yang sudah sukses dihapus', async ({ request }) => {
      expect(generatedPetId).toBeDefined();
      // retry delete with positive case
      const response = await request.delete(`${baseUrl}/${generatedPetId}`);
      expect(response.status()).toBe(404); // should no longer be found
    });

  });
});
