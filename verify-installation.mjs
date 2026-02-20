import { execSync } from 'node:child_process'
import { getCiphers } from 'node:crypto'

const checks = []

// 1. Node.js version
const nodeVersion = process.version
const [majorStr, minorStr = '0'] = nodeVersion.slice(1).split('.')
const major = Number(majorStr)
const minor = Number(minorStr)

const nodePass = major > 22 || (major === 22 && minor >= 12)

checks.push({
	name: 'Node.js version',
	pass: nodePass,
	value: nodeVersion,
	required: '>=22.12.0'
})

// 2. DisTube package
try {
	await import('distube')
	checks.push({ name: 'distube', pass: true, value: 'Found' })
} catch {
	checks.push({ name: 'distube', pass: false, value: 'Not found' })
}

// 3. discord.js
try {
	const discord = await import('discord.js')
	const version =
		discord?.version ??
		discord?.default?.version ??
		'Unknown'
	checks.push({ name: 'discord.js', pass: true, value: version })
} catch {
	checks.push({ name: 'discord.js', pass: false, value: 'Not found' })
}

// 4. @discordjs/voice
try {
	await import('@discordjs/voice')
	checks.push({ name: '@discordjs/voice', pass: true, value: 'Found' })
} catch {
	checks.push({ name: '@discordjs/voice', pass: false, value: 'Not found' })
}

// 5. @discordjs/opus
try {
	await import('@discordjs/opus')
	checks.push({ name: '@discordjs/opus', pass: true, value: 'Found' })
} catch {
	checks.push({ name: '@discordjs/opus', pass: false, value: 'Not found' })
}

// 6. FFmpeg
try {
	const ffmpeg = execSync('ffmpeg -version', { encoding: 'utf8' })
	const version = ffmpeg.split('\n')[0]
	checks.push({ name: 'FFmpeg', pass: true, value: version })
} catch {
	checks.push({ name: 'FFmpeg', pass: false, value: 'Not in PATH' })
}

// 7. Encryption
const hasNative = getCiphers().includes('aes-256-gcm')
let encryptionLib = 'Native AES-256-GCM'
let encryptionPass = hasNative

if (!hasNative) {
	try {
		await import('@noble/ciphers')
		encryptionLib = '@noble/ciphers'
		encryptionPass = true
	} catch {
		try {
			await import('sodium-native')
			encryptionLib = 'sodium-native'
			encryptionPass = true
		} catch {
			encryptionLib = 'MISSING'
			encryptionPass = false
		}
	}
}

checks.push({
	name: 'Encryption',
	pass: encryptionPass,
	value: encryptionLib
})

// Print results
console.log('\n=== DisTube Installation Verification ===\n')
for (const check of checks) {
	const status = check.pass ? '✓' : '✗'
	const required = check.required ? ` (required: ${check.required})` : ''
	console.log(`${status} ${check.name}: ${check.value}${required}`)
}

const allPassed = checks.every((c) => c.pass)
console.log('\n' + (allPassed ? '✓ All checks passed!' : '✗ Some checks failed'))

process.exit(allPassed ? 0 : 1)