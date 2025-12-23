import { assertEquals, assertExists } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import handler from "./index.ts"; // Zmieniony import
import { Context } from "@netlify/functions";

// Mock Context object
const mockContext: Context = {
  awsRequestId: "test-request-id",
  functionName: "calculate-human-design",
  functionVersion: "1.0",
  invokedFunctionArn: "arn:aws:lambda:us-east-1:123456789012:function:calculate-human-design",
  logGroupName: "/aws/lambda/calculate-human-design",
  logStreamName: "2025/08/05/[$LATEST]abcdef123456",
  memoryLimitInMB: "128",
  getRemainingTimeInMillis: () => 5000,
  done: () => {},
  fail: () => {},
  succeed: () => {},
  account: {
    id: "test-account-id"
  },
  site: {
    id: "test-site-id",
    name: "test-site-name"
  },
  deploy: {
    id: "test-deploy-id"
  },
  geo: {
    city: "Test City",
    country: {
      code: "TC",
      name: "Test Country"
    },
    subdivision: {
      code: "TS",
      name: "Test Subdivision"
    }
  },
  ip: "127.0.0.1",
  json: (data: any) => Promise.resolve(new Response(JSON.stringify(data))),
  next: () => Promise.resolve(new Response()),
  rewrite: (url: string) => Promise.resolve(new Response(null, { status: 302, headers: { Location: url } }))
};


Deno.test("Human Design Calculation - Valid Data", async () => {
  const request = new Request("http://localhost/api/calculate-human-design", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      birthDate: "1990-05-15",
      birthTime: "12:30",
      birthLocation: "New York, USA",
    }),
  });

  const response = await handler(request, mockContext);
  const data = await response.json();

  assertEquals(response.status, 200);
  assertEquals(response.headers.get("Content-Type"), "application/json");
  
  assertExists(data.type);
  assertExists(data.profile);
  assertExists(data.authority);
  
  assertEquals(data.type, "Generator");
  assertEquals(data.profile, "5/1");
});

Deno.test("Human Design Calculation - Missing Data", async () => {
  const request = new Request("http://localhost/api/calculate-human-design", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      birthDate: "1990-05-15",
      birthTime: "12:30",
      // Brakuje birthLocation
    }),
  });

  const response = await handler(request, mockContext);
  const data = await response.json();

  assertEquals(response.status, 400);
  assertExists(data.error);
  assertEquals(data.error, "Brakuje daty, godziny lub miejsca urodzenia.");
});
