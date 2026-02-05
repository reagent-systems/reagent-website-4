import { createCanvas, registerFont } from 'canvas';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Read ASCII art from the TypeScript file
const asciiArtFile = readFileSync(join(rootDir, 'src/lib/ascii-art.ts'), 'utf-8');
// Extract the ASCII art string from the export
const asciiArtMatch = asciiArtFile.match(/export const asciiArt = `([\s\S]*?)`;/);
if (!asciiArtMatch) {
	throw new Error('Could not extract ASCII art from ascii-art.ts');
}
const asciiArt = asciiArtMatch[1];

// Register fonts
registerFont(join(rootDir, 'static/fonts/IBMPlexMono-Bold.ttf'), { family: 'IBM Plex Mono' });
registerFont(join(rootDir, 'static/fonts/Raleway-Thin.ttf'), { family: 'Raleway', weight: '100' });
registerFont(join(rootDir, 'static/fonts/Raleway-VariableFont_wght.ttf'), { family: 'Raleway Variable' });

// OG Image dimensions (standard)
const width = 1200;
const height = 630;

// Create canvas
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// White background
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, width, height);

// Calculate ASCII art size and position
const asciiLines = asciiArt.split('\n').filter(line => line.trim().length > 0);
const asciiFontSize = 7;
ctx.font = `${asciiFontSize}px "IBM Plex Mono"`;

// Find the actual width of ASCII art (excluding trailing spaces)
let maxAsciiWidth = 0;
for (const line of asciiLines) {
	const trimmed = line.trimEnd();
	if (trimmed.length > 0) {
		const metrics = ctx.measureText(trimmed);
		maxAsciiWidth = Math.max(maxAsciiWidth, metrics.width);
	}
}

// Center ASCII art on right side
const asciiX = width * 0.55; // Start from middle-right
const asciiY = height * 0.5;
const asciiStartY = asciiY - (asciiLines.length * asciiFontSize * 1.15) / 2;

// Draw ASCII art with gradient - draw each line with its own gradient
ctx.font = `${asciiFontSize}px "IBM Plex Mono"`;

let yPos = asciiStartY;
for (const line of asciiLines) {
	const trimmed = line.trimEnd();
	if (trimmed.length > 0) {
		const lineWidth = ctx.measureText(trimmed).width;
		// Create gradient for this line
		const gradient = ctx.createLinearGradient(asciiX, 0, asciiX + lineWidth, 0);
		gradient.addColorStop(0, '#2d4a8a'); // Blue
		gradient.addColorStop(0.5, '#800020'); // Maroon
		gradient.addColorStop(1, '#2d4a8a'); // Blue
		
		ctx.fillStyle = gradient;
		ctx.fillText(trimmed, asciiX, yPos);
	}
	yPos += asciiFontSize * 1.15;
}

// Add text on the left side (matching original layout)
ctx.fillStyle = '#1a1a1a';
ctx.textAlign = 'left';
ctx.textBaseline = 'top';

const textX = width * 0.08; // Left side
const textY = height * 0.35; // Slightly above center

// Draw "reagent systems" (main text, larger, heavier weight, dark grey)
ctx.font = '900 110px "Raleway Variable"';
ctx.strokeStyle = '#1a1a1a';
ctx.lineWidth = 4;
ctx.strokeText('reagent systems', textX, textY);
ctx.fillText('reagent systems', textX, textY);

// Draw "the idea factory" (below, bigger, heavier weight, lighter grey)
ctx.fillStyle = '#6b6b6b'; // Lighter grey
ctx.strokeStyle = '#6b6b6b';
ctx.font = '900 48px "Raleway Variable"';
ctx.lineWidth = 2;
ctx.strokeText('the idea factory', textX, textY + 130);
ctx.fillText('the idea factory', textX, textY + 130);

// Save the image
const outputPath = join(rootDir, 'static/og-image.png');
const buffer = canvas.toBuffer('image/png');
writeFileSync(outputPath, buffer);

console.log('✅ OG image generated successfully at:', outputPath);
console.log(`   Dimensions: ${width}x${height}px`);
