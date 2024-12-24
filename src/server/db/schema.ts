import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  numeric,
  jsonb,
  boolean
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `drive_in_theater_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  password: text("password"),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 })
});

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

//----------------------------------------

export const movies = createTable("movie", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  duration: integer("duration"),
  genre: varchar("genre", { length: 255 }),
  starring: jsonb("starring"),
  image: varchar("image", { length: 255 }),
  video: varchar("video", { length: 255 }),
  price: numeric("price", { precision: 10, scale: 2 })
});

export const showings = createTable("showing", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  movie_id: varchar("movie_id", { length: 255 })
    .notNull()
    .references(() => movies.id),
  start_time: timestamp("start_time", {
    mode: "date",
    withTimezone: true
  }).notNull(),
  location: varchar("location", { length: 255 }),
  spaces_available: integer("spaces_available").default(0),
  is_active: boolean("is_active").default(true)
});

export const tickets = createTable("ticket", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  showing_id: varchar("showing_id", { length: 255 })
    .notNull()
    .references(() => showings.id),
  user_id: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  purchase_timestamp: timestamp("purchase_timestamp", {
    mode: "date",
    withTimezone: true
  }).default(sql`CURRENT_TIMESTAMP`)
});

export const loyalty_points = createTable("loyalty_point", {
  user_id: varchar("user_id", { length: 255 })
    .notNull()
    .primaryKey()
    .references(() => users.id),
  total_points: integer("total_points").default(0),
  tier_name: varchar("tier_name", { length: 100 }),
  next_tier_points: integer("next_tier_points"),
  tier_progress_percentage: integer("tier_progress_percentage").default(0)
});

//----------------------------------------

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  tickets: many(tickets),
  loyalty_points: one(loyalty_points)
}));

export const moviesRelations = relations(movies, ({ many }) => ({
  showings: many(showings)
}));

export const showingsRelations = relations(showings, ({ one, many }) => ({
  movie: one(movies, {
    fields: [showings.movie_id],
    references: [movies.id]
  }),
  tickets: many(tickets)
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  showing: one(showings, {
    fields: [tickets.showing_id],
    references: [showings.id]
  }),
  user: one(users, {
    fields: [tickets.user_id],
    references: [users.id]
  })
}));

export const loyaltyPointsRelations = relations(loyalty_points, ({ one }) => ({
  user: one(users, {
    fields: [loyalty_points.user_id],
    references: [users.id]
  })
}));