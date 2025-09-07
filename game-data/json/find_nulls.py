#!/usr/bin/env python3
import sys
import json
import re
from pathlib import Path

def strip_utf8_bom(raw: bytes):
    bom = b"\xef\xbb\xbf"
    if raw.startswith(bom):
        return raw[len(bom):], True
    return raw, False

def index_to_line_col(text, index):
    line = text.count("\n", 0, index) + 1
    col = index - text.rfind("\n", 0, index)
    return line, col

def find_null_tokens(text):
    hits = []
    i, in_string, esc = 0, False, False
    while i < len(text):
        ch = text[i]
        if in_string:
            if esc: esc = False
            elif ch == "\\": esc = True
            elif ch == '"': in_string = False
            i += 1; continue
        if ch == '"':
            in_string = True; i += 1; continue
        if text.startswith("null", i):
            prev = text[i-1] if i > 0 else ""
            nxt = text[i+4] if i+4 < len(text) else ""
            boundary = lambda c: c == "" or c.isspace() or c in ",}]:" 
            if boundary(prev) and boundary(nxt):
                line, col = index_to_line_col(text, i)
                line_text = text[text.rfind("\n", 0, i)+1 : text.find("\n", i)]
                hits.append((line, col, (line_text or "").strip()))
            i += 4; continue
        i += 1
    return hits

def collect_null_paths(obj, path="$"):
    paths = []
    if obj is None:
        paths.append(path)
    elif isinstance(obj, list):
        for idx, v in enumerate(obj):
            paths.extend(collect_null_paths(v, f"{path}[{idx}]"))
    elif isinstance(obj, dict):
        for k, v in obj.items():
            key = f'["{k}"]' if not re.match(r"^[A-Za-z_][A-Za-z0-9_]*$", k) else f".{k}"
            paths.extend(collect_null_paths(v, path + key))
    return paths

def main():
    if len(sys.argv) < 2:
        print("Usage: python find_nulls.py <path-to-json> [--fix-bom]")
        sys.exit(1)
    fix_bom = "--fix-bom" in sys.argv
    file_path = Path(sys.argv[1])

    raw = file_path.read_bytes()
    raw, had_bom = strip_utf8_bom(raw)
    if had_bom:
        print("⚠️  Detected and stripped UTF-8 BOM.")
        if fix_bom:
            file_path.write_bytes(raw)
            print("✅ Wrote file back WITHOUT BOM.")

    text = raw.decode("utf-8", errors="strict")

    # Part A: raw scan
    token_hits = find_null_tokens(text)
    if token_hits:
        print(f"🔎 Found {len(token_hits)} raw 'null' token(s):")
        for line, col, snippet in token_hits:
            print(f"- line {line}, col {col}: {snippet}")
    else:
        print("✅ No raw 'null' tokens found in text.")

    # Part B: parse JSON
    try:
        data = json.loads(text)
    except json.JSONDecodeError as e:
        print("\n❌ JSON.parse failed:", e)
        # best-effort location hint
        if e.pos is not None:
            line, col = e.lineno, e.colno
            print(f"   at line {line}, column {col}")
        sys.exit(2)

    null_paths = collect_null_paths(data)
    if null_paths:
        print(f"\n🧭 JSON paths with null values ({len(null_paths)}):")
        for p in null_paths:
            print("  " + p)
    else:
        print("\n✅ No null values in parsed JSON.")

    print("\n💡 VSCode quick search regex for exact null tokens:")
    print(r"   \bnull\b")

if __name__ == "__main__":
    main()
