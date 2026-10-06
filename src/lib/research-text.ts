export type TextPart = { kind: 'text' | 'num'; value: string };

/** Split prose so numbers and % (and close suffixes) use the mono face. */
export function tokenizeNums(text: string): TextPart[] {
	const parts: TextPart[] = [];
	const re = /(\+?\d+(?:[.,]\d+)?(?:%|pp|[BbKk]|gb|mb)?)/g;
	let last = 0;
	let match: RegExpExecArray | null;
	while ((match = re.exec(text)) !== null) {
		if (match.index > last) {
			parts.push({ kind: 'text', value: text.slice(last, match.index) });
		}
		parts.push({ kind: 'num', value: match[0] });
		last = match.index + match[0].length;
	}
	if (last < text.length) {
		parts.push({ kind: 'text', value: text.slice(last) });
	}
	return parts.length ? parts : [{ kind: 'text', value: text }];
}
