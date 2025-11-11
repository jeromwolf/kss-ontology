import { pgTable, serial, text, timestamp, integer, jsonb, boolean, varchar, index } from 'drizzle-orm/pg-core'

// 사용자 테이블
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  notificationEnabled: boolean('notification_enabled').default(true).notNull(),
  notificationTime: varchar('notification_time', { length: 5 }).default('08:00'),
})

// 관심 기업 (Watchlist)
export const watchlist = pgTable('watchlist', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  companyName: varchar('company_name', { length: 100 }).notNull(),
  ticker: varchar('ticker', { length: 20 }),
  priority: integer('priority').default(5).notNull(), // 1-10
  notes: text('notes'),
  addedAt: timestamp('added_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('watchlist_user_id_idx').on(table.userId),
  companyNameIdx: index('watchlist_company_name_idx').on(table.companyName),
}))

// 일일 인사이트
export const dailyInsights = pgTable('daily_insights', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  date: timestamp('date').notNull(),

  // JSON으로 저장되는 분석 결과
  companies: jsonb('companies').notNull(),
  relationships: jsonb('relationships').notNull(),
  urgentItems: jsonb('urgent_items').notNull(),
  watchItems: jsonb('watch_items').notNull(),
  opportunityItems: jsonb('opportunity_items').notNull(),

  summary: text('summary'),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('daily_insights_user_id_idx').on(table.userId),
  dateIdx: index('daily_insights_date_idx').on(table.date),
}))

// 뉴스 메타데이터 (링크만, 전문은 저장 안 함)
export const newsArticles = pgTable('news_articles', {
  id: serial('id').primaryKey(),
  link: text('link').notNull().unique(),
  title: varchar('title', { length: 500 }),
  pubDate: timestamp('pub_date'),
  source: varchar('source', { length: 100 }),
  fetchedAt: timestamp('fetched_at').defaultNow().notNull(),
}, (table) => ({
  linkIdx: index('news_articles_link_idx').on(table.link),
  pubDateIdx: index('news_articles_pub_date_idx').on(table.pubDate),
}))

// 추출된 엔티티 (기업, 인물 등)
export const entities = pgTable('entities', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // company, person, organization
  firstSeen: timestamp('first_seen').defaultNow().notNull(),
  lastSeen: timestamp('last_seen').defaultNow().notNull(),
  mentionCount: integer('mention_count').default(1).notNull(),

  // 소스 뉴스 링크들 (배열)
  sourceLinks: jsonb('source_links').notNull(),
}, (table) => ({
  nameIdx: index('entities_name_idx').on(table.name),
  typeIdx: index('entities_type_idx').on(table.type),
}))

// 관계 테이블
export const relationships = pgTable('relationships', {
  id: serial('id').primaryKey(),
  sourceEntityId: integer('source_entity_id').references(() => entities.id, { onDelete: 'cascade' }).notNull(),
  targetEntityId: integer('target_entity_id').references(() => entities.id, { onDelete: 'cascade' }).notNull(),

  relationType: varchar('relation_type', { length: 50 }).notNull(), // supplier, customer, competitor, etc
  confidence: integer('confidence').notNull(), // 0-100

  firstSeen: timestamp('first_seen').defaultNow().notNull(),
  lastSeen: timestamp('last_seen').defaultNow().notNull(),

  // 소스 뉴스 링크들
  sourceLinks: jsonb('source_links').notNull(),
}, (table) => ({
  sourceIdx: index('relationships_source_idx').on(table.sourceEntityId),
  targetIdx: index('relationships_target_idx').on(table.targetEntityId),
  typeIdx: index('relationships_type_idx').on(table.relationType),
}))

// 타입 정의
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type WatchlistItem = typeof watchlist.$inferSelect
export type NewWatchlistItem = typeof watchlist.$inferInsert

export type DailyInsight = typeof dailyInsights.$inferSelect
export type NewDailyInsight = typeof dailyInsights.$inferInsert

export type NewsArticle = typeof newsArticles.$inferSelect
export type NewNewsArticle = typeof newsArticles.$inferInsert

export type Entity = typeof entities.$inferSelect
export type NewEntity = typeof entities.$inferInsert

export type Relationship = typeof relationships.$inferSelect
export type NewRelationship = typeof relationships.$inferInsert
