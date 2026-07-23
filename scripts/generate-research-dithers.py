#!/usr/bin/env python3
"""Generate unique dithered thumbnails for the research page."""

from __future__ import annotations

import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "static" / "research-images"
SIZE = 640
# Match site --page-background (#fafafa)
PAPER = 250
INK = 26


def floyd_steinberg(arr: np.ndarray, threshold: int = 128) -> np.ndarray:
	arr = arr.astype(float)
	h, w = arr.shape
	for y in range(h):
		for x in range(w):
			old = arr[y, x]
			new = 255.0 if old > threshold else 0.0
			arr[y, x] = new
			err = old - new
			if x + 1 < w:
				arr[y, x + 1] += err * 7 / 16
			if x - 1 >= 0 and y + 1 < h:
				arr[y + 1, x - 1] += err * 3 / 16
			if y + 1 < h:
				arr[y + 1, x] += err * 5 / 16
			if x + 1 < w and y + 1 < h:
				arr[y + 1, x + 1] += err * 1 / 16
	return np.clip(arr, 0, 255).astype(np.uint8)


def ordered_dither(arr: np.ndarray) -> np.ndarray:
	bayer = np.array([[0, 2], [3, 1]], dtype=float)
	reps_y = (arr.shape[0] + 1) // 2
	reps_x = (arr.shape[1] + 1) // 2
	bayer = np.tile(bayer, (reps_y, reps_x))[: arr.shape[0], : arr.shape[1]]
	threshold_map = (bayer + 0.5) * 255 / 4
	return np.where(arr > threshold_map, 255, 0).astype(np.uint8)


def atkinson_dither(arr: np.ndarray, threshold: int = 128) -> np.ndarray:
	arr = arr.astype(float)
	h, w = arr.shape
	for y in range(h):
		for x in range(w):
			old = arr[y, x]
			new = 255.0 if old > threshold else 0.0
			arr[y, x] = new
			err = (old - new) / 8
			for dx, dy in [(1, 0), (2, 0), (-1, 1), (0, 1), (1, 1), (0, 2)]:
				nx, ny = x + dx, y + dy
				if 0 <= nx < w and 0 <= ny < h:
					arr[ny, nx] += err
	return np.clip(arr, 0, 255).astype(np.uint8)


def to_paper_ink(arr: np.ndarray) -> np.ndarray:
	"""Map binary dither (0/255) onto uniform paper + ink."""
	return np.where(arr < 128, INK, PAPER).astype(np.uint8)


def shape_dither(
	arr: np.ndarray,
	shape: str = "circles",
	detail: int = 10,
	dot_size: int = 6,
	seed: int = 0,
) -> Image.Image:
	h, w = arr.shape
	out = Image.new("L", (w, h), PAPER)
	draw = ImageDraw.Draw(out)
	rng = np.random.default_rng(seed)
	for y in range(0, h, detail):
		for x in range(0, w, detail):
			block = arr[y : y + detail, x : x + detail]
			avg = float(np.mean(block))
			density = (255 - avg) / 255.0
			if density < 0.12:
				continue
			size = max(1, int(1 + density * (dot_size - 1)))
			cx, cy = x + detail // 2, y + detail // 2
			if shape == "circles":
				draw.ellipse([cx - size, cy - size, cx + size, cy + size], fill=INK)
			elif shape == "squares":
				draw.rectangle([cx - size, cy - size, cx + size, cy + size], fill=INK)
			elif shape == "triangles":
				angle = -math.pi / 2
				r = size * 1.25
				pts = [
					(
						cx + r * math.cos(angle + i * 2 * math.pi / 3),
						cy + r * math.sin(angle + i * 2 * math.pi / 3),
					)
					for i in range(3)
				]
				draw.polygon(pts, fill=INK)
			elif shape == "triangles_rand":
				angle = rng.uniform(0, 2 * math.pi)
				r = size * 1.25
				pts = [
					(
						cx + r * math.cos(angle + i * 2 * math.pi / 3),
						cy + r * math.sin(angle + i * 2 * math.pi / 3),
					)
					for i in range(3)
				]
				draw.polygon(pts, fill=INK)
	return out


def prep(img: Image.Image, contrast: float = 1.35, brightness: float = 1.08) -> Image.Image:
	img = ImageEnhance.Brightness(img.convert("RGB")).enhance(brightness)
	img = ImageEnhance.Contrast(img).enhance(contrast)
	return img.convert("L")


def save(name: str, img_l: Image.Image) -> None:
	OUT.mkdir(parents=True, exist_ok=True)
	# Flatten any residual midtones onto uniform paper (ink stays dark)
	arr = np.array(img_l.convert("L"))
	arr = np.where(arr > 200, PAPER, arr)
	arr = np.where(arr < 80, INK, arr)
	# Anything still in between near paper → paper (kills speckled bg)
	arr = np.where(arr > 180, PAPER, arr)
	Image.fromarray(arr.astype(np.uint8)).resize((SIZE, SIZE), Image.NEAREST).save(OUT / f"{name}.png")
	print(f"{name}: bg pixels @ {PAPER} = {int(np.sum(arr == PAPER))} / {arr.size}")


def src_dandelion() -> Image.Image:
	img = Image.new("L", (SIZE, SIZE), PAPER)
	d = ImageDraw.Draw(img)
	cx, cy = SIZE // 2, SIZE // 2 + 30
	rng = np.random.default_rng(7)
	d.line([(cx, cy), (cx, SIZE - 30)], fill=40, width=5)
	d.ellipse([cx - 26, cy - 26, cx + 26, cy + 26], fill=30)
	for _ in range(110):
		ang = rng.uniform(0, 2 * math.pi)
		dist = rng.uniform(50, 270)
		x2 = cx + dist * math.cos(ang)
		y2 = cy + dist * math.sin(ang) * 0.88
		d.line([(cx, cy), (x2, y2)], fill=int(rng.integers(50, 130)), width=1)
		r = rng.uniform(2, 6)
		d.ellipse([x2 - r, y2 - r, x2 + r, y2 + r], fill=32)
	return img


def src_simple_agent() -> Image.Image:
	img = Image.new("L", (SIZE, SIZE), PAPER)
	d = ImageDraw.Draw(img)
	d.ellipse([160, 160, 480, 480], outline=32, width=12)
	d.ellipse([205, 205, 435, 435], outline=90, width=3)
	d.polygon([(485, 310), (455, 288), (455, 332)], fill=32)
	nodes = [(110, 150), (530, 150), (90, 400), (550, 400), (320, 70), (320, 570)]
	for x, y in nodes:
		d.line([(320, 320), (x, y)], fill=90, width=2)
		d.rounded_rectangle([x - 34, y - 22, x + 34, y + 22], radius=8, fill=42)
	d.ellipse([285, 285, 355, 355], fill=22)
	return img.filter(ImageFilter.GaussianBlur(0.35))


def src_phone_agent() -> Image.Image:
	img = Image.new("L", (SIZE, SIZE), PAPER)
	d = ImageDraw.Draw(img)
	d.rounded_rectangle([205, 70, 435, 570], radius=38, outline=30, width=6)
	d.rounded_rectangle([220, 95, 420, 545], radius=30, fill=210)
	d.rounded_rectangle([240, 140, 400, 470], radius=6, fill=230)
	d.ellipse([300, 500, 340, 540], outline=40, width=4)
	for r in (45, 75, 105):
		d.arc([320 - r, 20 - r // 3, 320 + r, 55 + r], 200, 340, fill=35, width=4)
	for i, y in enumerate([175, 235, 295, 355, 415]):
		d.ellipse([265, y, 295, y + 28], fill=40)
		d.rectangle([315, y + 6, 380, y + 22], fill=60 + i * 15)
	return img


def src_bently() -> Image.Image:
	img = Image.new("L", (SIZE, SIZE), PAPER)
	d = ImageDraw.Draw(img)
	rng = np.random.default_rng(11)
	layers = [5, 8, 8, 6, 3]
	xs = [80, 200, 320, 440, 560]
	coords = []
	for li, (x, n) in enumerate(zip(xs, layers)):
		layer = []
		for i in range(n):
			y = 90 + i * (SIZE - 180) / max(n - 1, 1)
			layer.append((x, y))
			r = 11 if li < 4 else 16
			d.ellipse([x - r, y - r, x + r, y + r], fill=28 if li == 4 else 60, outline=20, width=1)
		coords.append(layer)
	for li in range(len(coords) - 1):
		for a in coords[li]:
			for b in coords[li + 1]:
				if rng.random() < 0.4:
					d.line([a, b], fill=int(rng.integers(70, 140)), width=1)
	for x, s in [(35, 1), (605, -1)]:
		d.line([(x, 110), (x, 200)], fill=25, width=6)
		d.line([(x, 110), (x + 18 * s, 110)], fill=25, width=6)
		d.line([(x, 440), (x, 530)], fill=25, width=6)
		d.line([(x, 530), (x + 18 * s, 530)], fill=25, width=6)
	return img.filter(ImageFilter.GaussianBlur(0.45))


def main() -> None:
	save(
		"dandelion",
		shape_dither(np.array(prep(src_dandelion())), "circles", detail=7, dot_size=6, seed=3),
	)
	save(
		"simple-agent-core",
		Image.fromarray(to_paper_ink(atkinson_dither(np.array(prep(src_simple_agent(), 1.45, 1.12)), 130))),
	)
	save(
		"phone-agent",
		Image.fromarray(to_paper_ink(ordered_dither(np.array(prep(src_phone_agent(), 1.55, 1.15))))),
	)
	save(
		"bently-coder-7b",
		Image.fromarray(to_paper_ink(floyd_steinberg(np.array(prep(src_bently(), 1.4, 1.1)), 122))),
	)
	print("wrote", sorted(p.name for p in OUT.glob("*.png")))


if __name__ == "__main__":
	main()
