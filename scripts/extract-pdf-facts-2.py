#!/usr/bin/env python3
"""Extract more text from PDFs to find specific facts"""

import sys
from pathlib import Path
from pypdf import PdfReader

def extract_pdf_text(pdf_path, start_page=0, num_pages=5):
    """Extract text from specific pages of a PDF"""
    try:
        reader = PdfReader(pdf_path)
        text = []
        for i in range(start_page, min(start_page + num_pages, len(reader.pages))):
            page_text = reader.pages[i].extract_text()
            if page_text:
                text.append(f"=== PAGE {i+1} ===\n{page_text}")
        return "\n\n".join(text)
    except Exception as e:
        return f"Error extracting {pdf_path}: {e}"

base_path = Path("c:/Users/jesse/OneDrive/Documents/Endless Measures/Curriculum/old-macdonald-had-a-school/docs/early-years-music-resources")

# Extract more from Ohio PDF (pages 6-8 about "The Rhyming Problem")
print("="*80)
print("OHIO PDF - Pages 6-8 (The Rhyming Problem)")
print("="*80)
ohio_path = base_path / "01-libraries-agencies/pdf/ohio-ready-to-read-rhyme-with-me.pdf"
print(extract_pdf_text(ohio_path, start_page=5, num_pages=3))

# Extract from Green book (skip Google cover, start at page 5)
print("\n" + "="*80)
print("GREEN 1899 - Pages 5-10 (actual content)")
print("="*80)
green_path = base_path / "04-historical-public-domain/pdf/green-history-of-nursery-rhymes-1899.pdf"
print(extract_pdf_text(green_path, start_page=4, num_pages=6))

# Extract more from NAEYC article (pages 2-3)
print("\n" + "="*80)
print("NAEYC - Pages 2-3 (more developmental details)")
print("="*80)
naeyc_path = base_path / "02-educators-publishers/pdf/naeyc-beyond-twinkle-twinkle.pdf"
print(extract_pdf_text(naeyc_path, start_page=1, num_pages=2))
