
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.PLAYWRIGHT_TEST_EMAIL;
const password = process.env.PLAYWRIGHT_TEST_PASSWORD;

// Prevent this test setup from running against a hosted database.
if (!url || !["127.0.0.1", "localhost"].includes(new URL(url).hostname)) {
  throw new Error("CI setup requires a local Supabase URL.");
}

if (!serviceKey || !email || !password) {
  throw new Error("Missing CI setup environment variables.");
}

if (email !== "lab8-ci@example.com") {
  throw new Error("Unexpected CI test account email.");
}

const supabase = createClient(url, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Check whether the disposable test user already exists.
const { data: users, error: listError } =
  await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });

if (listError) throw listError;

let user = users.users.find((item) => item.email === email);

if (!user) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) throw error;
  user = data.user;

  console.log("Created CI authentication user.");
} else {
  console.log("CI authentication user already exists.");
}

// Create the fictional approved property after Auth has created
// the user and migration 003 has created its profile.
const { data: existing, error: findError } = await supabase
  .from("properties")
  .select("property_id")
  .eq("owner_id", user.id)
  .contains("address", { street: "123 CI Test Street" })
  .limit(1);

if (findError) throw findError;

if (existing.length === 0) {
  const { error } = await supabase.from("properties").insert({
    owner_id: user.id,
    address: {
      street: "123 CI Test Street",
      city: "Los Angeles",
      state: "CA",
    },
    price: 450000,
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 1500,
    amenities: ["Parking", "Air Conditioning"],
    zip_code: "90039",
    is_approved: true,
  });

  if (error) throw error;

  console.log("Created approved CI test property.");
} else {
  console.log("CI test property already exists.");
}

console.log("CI test fixtures are ready.");
