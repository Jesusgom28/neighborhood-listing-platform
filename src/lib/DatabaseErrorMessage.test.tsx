
import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import DatabaseErrorMessage from "../components/DatabaseErrorMessage";

test("database error message renders correctly", () => {
  // Render the component as HTML without starting a web server.
  const html = renderToStaticMarkup(<DatabaseErrorMessage />);

  // Verify the user sees the correct error message.
  assert.match(
    html,
    /Unable to load properties right now\. Please try again later\./,
  );

  // Verify assistive technology can identify the error.
  assert.match(html, /role="alert"/);
});
