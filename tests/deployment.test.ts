import assert from "node:assert/strict"
import { test } from "node:test"
import mongoose from "mongoose"
import { connectToDatabase } from "../lib/db"
import { defaultPortfolioProfile, getPortfolioProfile, getPublicPortfolioProfile, localizeProfile } from "../lib/profile"
import { PortfolioProfile } from "../model/profile"

test("deployment database failures", async (t) => {
  const originalUri = process.env.MONGODB_URI
  const cache = (globalThis as unknown as {
    mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
  }).mongoose

  t.beforeEach(() => {
    cache.conn = null
    cache.promise = null
    process.env.MONGODB_URI = "mongodb://127.0.0.1:1/deployment-check"
  })
  t.afterEach(() => {
    t.mock.restoreAll()
    cache.conn = null
    cache.promise = null
    if (originalUri === undefined) delete process.env.MONGODB_URI
    else process.env.MONGODB_URI = originalUri
  })

  await t.test("missing URI renders bundled public content in both languages", async () => {
    delete process.env.MONGODB_URI
    const log = t.mock.method(console, "error", () => {})
    const profile = await getPublicPortfolioProfile()
    assert.deepEqual(profile, defaultPortfolioProfile)
    assert.equal(localizeProfile(profile, "bn").fullName, defaultPortfolioProfile.fullNameBn)
    assert.equal(log.mock.callCount(), 1)
  })

  await t.test("admin reads still reject a missing URI", async () => {
    delete process.env.MONGODB_URI
    await assert.rejects(getPortfolioProfile(), /MONGODB_URI is not configured/)
  })

  await t.test("failed connections can retry and successful connections are reused", async () => {
    let attempts = 0
    const connect = t.mock.method(mongoose, "connect", async () => {
      if (++attempts === 1) throw new Error("Connection unavailable")
      return mongoose
    })
    await assert.rejects(connectToDatabase(), /Connection unavailable/)
    assert.equal(cache.promise, null)
    assert.equal(await connectToDatabase(), mongoose)
    assert.equal(await connectToDatabase(), mongoose)
    assert.equal(connect.mock.callCount(), 2)
    assert.equal(connect.mock.calls[0].arguments[1]?.serverSelectionTimeoutMS, 5000)
  })

  await t.test("unreachable database falls back without logging connection details", async () => {
    t.mock.method(mongoose, "connect", async () => {
      throw new Error("Failed to connect to mongodb://user:secret@private-host/db")
    })
    const log = t.mock.method(console, "error", () => {})
    assert.deepEqual(await getPublicPortfolioProfile(), defaultPortfolioProfile)
    assert.equal(cache.promise, null)
    assert.equal(log.mock.callCount(), 1)
    assert.doesNotMatch(JSON.stringify(log.mock.calls), /secret|private-host/)
  })

  await t.test("query failures fall back publicly and remain visible to admins", async () => {
    cache.conn = mongoose
    t.mock.method(PortfolioProfile, "findOne", () => ({
      lean: async () => { throw new Error("Read unavailable") },
    }))
    t.mock.method(console, "error", () => {})
    assert.deepEqual(await getPublicPortfolioProfile(), defaultPortfolioProfile)
    await assert.rejects(getPortfolioProfile(), /Read unavailable/)
  })

  await t.test("saved content is used when the database is available", async () => {
    cache.conn = mongoose
    t.mock.method(PortfolioProfile, "findOne", () => ({
      lean: async () => ({ fullName: "Saved portfolio name", updatedAt: new Date() }),
    }))
    const profile = await getPublicPortfolioProfile()
    assert.equal(profile.fullName, "Saved portfolio name")
    assert.deepEqual(profile.services, defaultPortfolioProfile.services)
    assert.equal("isPersisted" in profile, false)
    assert.equal("updatedAt" in profile, false)
  })
})
