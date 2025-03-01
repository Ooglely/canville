import { pgTable, serial, integer, varchar } from 'drizzle-orm/pg-core';

export const city = pgTable('city', {
    cityid: serial('cityid').primaryKey(),
    citymoney: integer('citymoney').notNull()
});

export const building = pgTable('building', {
    buildingid: serial('buildingid').primaryKey(),
    cityid: integer('cityid').notNull().references(() => city.cityid, { onDelete: 'cascade' }),
    sprite: varchar({ length: 255 }).notNull(),
    size: varchar({ length: 255 }).notNull(),
    x: integer('x').notNull(),
    y: integer('y').notNull()
});