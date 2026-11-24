
#!/usr/bin/env python3
"""
Build hero assets from a complete video.

Usage:
    python scripts/build-hero-assets.py hero1.mp4
"""

import subprocess
import sys
import os

# --------------------------------------------------
# Configuration
# --------------------------------------------------

if len(sys.argv) < 2:
    print("Usage: python scripts/build-hero-assets.py hero1.mp4")
    sys.exit(1)

SRC = sys.argv[1]

OUT = "public/hero1"

CROP = "576:720:342:0"

# --------------------------------------------------
# Helpers
# --------------------------------------------------

def run(*args):
    subprocess.run(args, check=True)

# Check that the source video exists
if not os.path.isfile(SRC):
    print(f"Error: Video file not found: {SRC}")
    sys.exit(1)

# Create output directory if it doesn't exist
os.makedirs(OUT, exist_ok=True)

# --------------------------------------------------
# Video processing
# Complete video, no trimming, no looping
# --------------------------------------------------

vf = (
    f"crop={CROP},"
    "scale=768:960,"
    "colorlevels=rimax=0.90:gimax=0.90:bimax=0.90,"
    "fps=30"
)

# --------------------------------------------------
# Generate MP4
# --------------------------------------------------

run(
    "ffmpeg",
    "-y",
    "-v", "error",
    "-i", SRC,
    "-vf", vf,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-crf", "24",
    "-preset", "slow",
    "-c:a", "aac",
    "-b:a", "96k",
    "-movflags", "+faststart",
    os.path.join(OUT, "hero1.mp4")
)

# --------------------------------------------------
# Generate WebM
# Same complete source video
# --------------------------------------------------

run(
    "ffmpeg",
    "-y",
    "-v", "error",
    "-i", SRC,
    "-vf", vf,
    "-c:v", "libvpx-vp9",
    "-crf", "36",
    "-b:v", "0",
    "-c:a", "libopus",
    "-b:a", "80k",
    os.path.join(OUT, "hero1.webm")
)

# --------------------------------------------------
# Generate portrait thumbnail
# --------------------------------------------------

run(
    "ffmpeg",
    "-y",
    "-v", "error",
    "-ss", "3",
    "-i", SRC,
    "-vf", "crop=240:300:510:20,scale=480:600",
    "-frames:v", "1",
    "public/portrait.png"
)

# --------------------------------------------------
# Finished
# --------------------------------------------------

print("Hero assets generated successfully!")
print(f"MP4:   {OUT}/hero1.mp4")
print(f"WebM:  {OUT}/hero1.webm")
print("Image: public/portrait.png")
