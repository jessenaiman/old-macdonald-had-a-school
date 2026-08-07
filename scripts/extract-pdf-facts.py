#!/usr/bin/env python3
"""Extract text from PDFs to find new facts"""

import sys
from pathlib import Path

try:
    from pypdf import PdfReader
except ImportError:
    print("Installing pypdf...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf", "-q"])
    from pypdf import PdfReader

def extract_pdf_text(pdf_path, max_pages=10):
    """Extract text from first N pages of a PDF"""
    try:
        reader = PdfReader(pdf_path)
        text = []
        for i, page in enumerate(reader.pages[:max_pages]):
            page_text = page.extract_text()
            if page_text:
                text.append(f"=== PAGE {i+1} ===\n{page_text}")
        return "\n\n".join(text)
    except Exception as e:
        return f"Error extracting {pdf_path}: {e}"

# PDFs to examine
pdfs = [
    "01-libraries-agencies/pdf/ohio-ready-to-read-rhyme-with-me.pdf",
    "04-historical-public-domain/pdf/green-history-of-nursery-rhymes-1899.pdf",
    "02-educators-publishers/pdf/naeyc-beyond-twinkle-twinkle.pdf"
]

base_path = Path("c:/Users/jesse/OneDrive/Documents/Endless Measures/Curriculum/old-macdonald-had-a-school/docs/early-years-music-resources")

for pdf_rel in pdfs:
    pdf_path = base_path / pdf_rel
    print(f"\n{'='*80}")
    print(f"PDF: {pdf_rel}")
    print(f"{'='*80}\n")
    
    if not pdf_path.exists():
        print(f"File not found: {pdf_path}")
        continue
    
    text = extract_pdf_text(pdf_path, max_pages=8)
    print(text[:3000])  # First 3000 chars
    print("\n[... truncated ...]")
