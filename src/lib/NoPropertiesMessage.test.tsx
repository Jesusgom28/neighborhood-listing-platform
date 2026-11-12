
import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import NoPropertiesMessage from "../components/NoPropertiesMessage";

test("no-results message appears when rendered", () => {
  const html = renderToStaticMarkup(<NoPropertiesMessage />);

  assert.match(
    html,
    /No properties match your search\. Try changing your filters\./,
  );
});
