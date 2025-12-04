/**
 * Notification Service
 *
 * 다양한 채널을 통한 알림 발송
 * - 콘솔 로그 (기본)
 * - 이메일 (선택)
 * - Slack 웹훅 (선택)
 * - Discord 웹훅 (선택)
 */

export type NotificationType =
  | 'job_success'
  | 'job_failure'
  | 'system_error'
  | 'data_quality_alert'
  | 'info'

export interface Notification {
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  error?: string
  data?: any
}

/**
 * 알림 발송 (기본 구현)
 */
export async function sendNotification(notification: Notification) {
  const { type, title, message, timestamp, error, data } = notification

  // 1. 콘솔 로그 (항상 출력)
  logToConsole(notification)

  // 2. Slack 웹훅 (설정된 경우)
  if (process.env.SLACK_WEBHOOK_URL) {
    try {
      await sendSlackNotification(notification)
    } catch (err: any) {
      console.error('Slack 알림 실패:', err.message)
    }
  }

  // 3. Discord 웹훅 (설정된 경우)
  if (process.env.DISCORD_WEBHOOK_URL) {
    try {
      await sendDiscordNotification(notification)
    } catch (err: any) {
      console.error('Discord 알림 실패:', err.message)
    }
  }

  // 4. 이메일 (설정된 경우)
  if (process.env.NOTIFICATION_EMAIL) {
    try {
      await sendEmailNotification(notification)
    } catch (err: any) {
      console.error('이메일 알림 실패:', err.message)
    }
  }
}

/**
 * 콘솔 로그 출력
 */
function logToConsole(notification: Notification) {
  const { type, title, message, timestamp, error } = notification

  const icon = getIcon(type)
  const timeStr = timestamp.toLocaleString('ko-KR')

  console.log(`\n${icon} [${type.toUpperCase()}] ${title}`)
  console.log(`   시간: ${timeStr}`)
  console.log(`   메시지: ${message}`)

  if (error) {
    console.log(`   오류: ${error}`)
  }
}

/**
 * Slack 웹훅 알림
 */
async function sendSlackNotification(notification: Notification) {
  const { type, title, message, timestamp, error } = notification

  const color = getColor(type)
  const icon = getIcon(type)

  const payload = {
    username: 'KSS Ontology Bot',
    icon_emoji: ':robot_face:',
    attachments: [
      {
        color,
        title: `${icon} ${title}`,
        text: message,
        fields: [
          {
            title: '시간',
            value: timestamp.toISOString(),
            short: true,
          },
          {
            title: '타입',
            value: type,
            short: true,
          },
        ],
        footer: 'KSS Ontology',
        ts: Math.floor(timestamp.getTime() / 1000),
      },
    ],
  }

  if (error) {
    payload.attachments[0].fields.push({
      title: '오류',
      value: `\`\`\`${error.substring(0, 500)}\`\`\``,
      short: false,
    })
  }

  const response = await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Slack API error: ${response.statusText}`)
  }
}

/**
 * Discord 웹훅 알림
 */
async function sendDiscordNotification(notification: Notification) {
  const { type, title, message, timestamp, error } = notification

  const color = getColorCode(type)
  const icon = getIcon(type)

  const embed = {
    title: `${icon} ${title}`,
    description: message,
    color,
    fields: [
      {
        name: '타입',
        value: type,
        inline: true,
      },
      {
        name: '시간',
        value: timestamp.toISOString(),
        inline: true,
      },
    ],
    footer: {
      text: 'KSS Ontology',
    },
    timestamp: timestamp.toISOString(),
  }

  if (error) {
    embed.fields.push({
      name: '오류',
      value: `\`\`\`${error.substring(0, 500)}\`\`\``,
      inline: false,
    })
  }

  const payload = {
    username: 'KSS Ontology Bot',
    embeds: [embed],
  }

  const response = await fetch(process.env.DISCORD_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Discord API error: ${response.statusText}`)
  }
}

/**
 * 이메일 알림
 *
 * Nodemailer 설치 필요:
 *   npm install nodemailer @types/nodemailer
 *
 * 환경 변수:
 *   NOTIFICATION_EMAIL=recipient@example.com
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=587
 *   SMTP_USER=sender@gmail.com
 *   SMTP_PASS=app-password
 */
async function sendEmailNotification(notification: Notification) {
  const { type, title, message, timestamp, error } = notification

  // Nodemailer가 설치되어 있으면 실제 이메일 발송
  try {
    // Dynamic import to avoid errors if nodemailer is not installed
    const nodemailer = await import('nodemailer').catch(() => null)

    if (!nodemailer) {
      console.log('📧 이메일 알림 (nodemailer 미설치):', title)
      return
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const icon = getIcon(type)
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${icon} ${title}</h2>
        <p style="color: #666; font-size: 14px;">
          <strong>타입:</strong> ${type}<br>
          <strong>시간:</strong> ${timestamp.toLocaleString('ko-KR')}<br>
        </p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; color: #333;">${message}</p>
        </div>
        ${
          error
            ? `
        <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong style="color: #856404;">오류:</strong>
          <pre style="margin: 10px 0 0; padding: 10px; background: #fff; border-radius: 3px; overflow-x: auto; font-size: 12px;">${error}</pre>
        </div>
        `
            : ''
        }
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          KSS Ontology 자동 알림 시스템
        </p>
      </div>
    `

    await transporter.sendMail({
      from: `"KSS Ontology" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `${icon} [KSS] ${title}`,
      html,
    })

    console.log('📧 이메일 알림 발송 완료:', process.env.NOTIFICATION_EMAIL)
  } catch (err: any) {
    // nodemailer가 없거나 설정이 잘못된 경우 조용히 실패
    console.log('📧 이메일 알림 (전송 실패):', title, '-', err.message)
  }
}

/**
 * 알림 타입별 아이콘
 */
function getIcon(type: NotificationType): string {
  const icons: Record<NotificationType, string> = {
    job_success: '✅',
    job_failure: '❌',
    system_error: '🚨',
    data_quality_alert: '⚠️',
    info: 'ℹ️',
  }
  return icons[type] || 'ℹ️'
}

/**
 * 알림 타입별 색상 (Slack)
 */
function getColor(type: NotificationType): string {
  const colors: Record<NotificationType, string> = {
    job_success: 'good',
    job_failure: 'danger',
    system_error: 'danger',
    data_quality_alert: 'warning',
    info: '#36a64f',
  }
  return colors[type] || '#36a64f'
}

/**
 * 알림 타입별 색상 코드 (Discord)
 */
function getColorCode(type: NotificationType): number {
  const colors: Record<NotificationType, number> = {
    job_success: 0x00ff00, // Green
    job_failure: 0xff0000, // Red
    system_error: 0xff0000, // Red
    data_quality_alert: 0xffa500, // Orange
    info: 0x0000ff, // Blue
  }
  return colors[type] || 0x0000ff
}

/**
 * 간편 알림 헬퍼 함수들
 */
export async function notifyJobSuccess(jobName: string, duration: string) {
  await sendNotification({
    type: 'job_success',
    title: `${jobName} 작업 완료`,
    message: `소요 시간: ${duration}`,
    timestamp: new Date(),
  })
}

export async function notifyJobFailure(
  jobName: string,
  error: string,
  duration: string
) {
  await sendNotification({
    type: 'job_failure',
    title: `${jobName} 작업 실패`,
    message: `소요 시간: ${duration}`,
    timestamp: new Date(),
    error,
  })
}

export async function notifySystemError(title: string, error: string) {
  await sendNotification({
    type: 'system_error',
    title,
    message: '시스템 오류 발생',
    timestamp: new Date(),
    error,
  })
}

export async function notifyDataQualityIssue(message: string, data?: any) {
  await sendNotification({
    type: 'data_quality_alert',
    title: '데이터 품질 경고',
    message,
    timestamp: new Date(),
    data,
  })
}
