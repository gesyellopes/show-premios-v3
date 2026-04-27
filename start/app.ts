/**
 * start/app.ts
 *
 * Central bootstrap file — imported once during application startup.
 * Register integrations and plugins here.
 *
 * Import this file in your app entrypoint or adonisrc.ts preloads:
 *   preloads: [() => import('./start/app.js')]
 */

//import app from '@adonisjs/core/services/app'

// ─── Integrations ────────────────────────────────────────────────────────────
// Uncomment as you add integrations via: node ace make:integration <name>
//
// import { ResendMail } from '#integrations/resend-mail/index'
// import { FirebasePush } from '#integrations/firebase-push/index'
//
// export const mailer = new ResendMail({
//   apiKey: process.env.RESEND_API_KEY!,
// })
//
// export const push = new FirebasePush({
//   projectId: process.env.FIREBASE_PROJECT_ID!,
// })

// ─── Plugins ─────────────────────────────────────────────────────────────────
// Uncomment as you add plugins via: node ace make:plugin <name>
//
// import { AuditLogPlugin } from '#plugins/audit-log/index'
// import { SlackAlertsPlugin } from '#plugins/slack-alerts/index'
//
// const plugins = [
//   new AuditLogPlugin(app, { enabled: true }),
//   new SlackAlertsPlugin(app, { webhookUrl: process.env.SLACK_WEBHOOK_URL! }),
// ]
//
// for (const plugin of plugins) {
//   await plugin.setup()
// }
//
// app.terminating(() => {
//   return Promise.all(plugins.map((p) => p.teardown()))
// })
