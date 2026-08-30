import { expect, type APIRequestContext } from "@playwright/test";
import { API_URL, MAILPIT_URL } from "../playwright.config";
import { randomUUID } from "crypto";

export async function getVerificationLink(
  request: APIRequestContext,
  email: string,
): Promise<string> {
  await expect
    .poll(async () => {
      const res = await request.get(
        `${MAILPIT_URL}/api/v1/search?query=to:${email}`,
      );
      const body = await res.json();
      return body.messages.length;
    })
    .toBeGreaterThan(0);

  const res = await request.get(
    `${MAILPIT_URL}/api/v1/search?query=to:${email}`,
  );
  const { messages } = await res.json();
  const id = messages[0].ID;

  const message = await request.get(`${MAILPIT_URL}/api/v1/message/${id}`);
  const { HTML } = await message.json();
  const link = HTML.match(/http:\/\/localhost:3001\/verify\?token=[a-f0-9]+/);
  expect(link).not.toBeNull();
  return link![0];
}

export async function createVerifiedUser(
  request: APIRequestContext,
): Promise<{ email: string; password: string }> {
  const email = `user-${randomUUID()}@example.test`;
  const password = "password";

  await request.post(`${API_URL}/auth/signup/start`, {
    data: { email },
    failOnStatusCode: true,
  });

  const link = await getVerificationLink(request, email);
  const token = new URL(link).searchParams.get("token");
  expect(token).not.toBeNull();

  await request.post(`${API_URL}/auth/signup/complete`, {
    data: { token, password, confirmPassword: password },
    failOnStatusCode: true,
  });

  return { email, password };
}
