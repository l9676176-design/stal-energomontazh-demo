#!/usr/bin/env python3
"""Проверка утверждённой структуры и локальных ссылок статического сайта."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[2]

REQUIRED_PATHS = (
    ".github/workflows/validate.yml",
    "docs/PROJECT_STRUCTURE.md",
    "docs/ARCHITECTURE.md",
    "docs/SETUP.md",
    "docs/DEPLOYMENT.md",
    "docs/TESTING.md",
    "docs/SECURITY.md",
    "src/styles/styles.css",
    "src/scripts/script.js",
    "public/images/site/sem-products-yellow-frame.png",
    "legal/privacy-policy.html",
    "legal/personal-data-consent.html",
    "privacy-policy.html",
    "personal-data-consent.html",
    "AGENTS.md",
    "README.md",
    "PROJECT_STATUS.md",
    "CHANGELOG.md",
    "ROADMAP.md",
    ".env.example",
    ".gitignore",
)


class LocalReferenceParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.references: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        for name in ("href", "src"):
            value = attributes.get(name)
            if value:
                self.references.append(value)


def local_target(document: Path, reference: str) -> Path | None:
    parts = urlsplit(reference)
    if parts.scheme or parts.netloc or reference.startswith(("#", "mailto:", "tel:")):
        return None
    clean_path = parts.path
    if not clean_path:
        return None
    return (document.parent / clean_path).resolve()


def main() -> None:
    missing = [path for path in REQUIRED_PATHS if not (ROOT / path).exists()]
    if missing:
        raise SystemExit("Не найдены обязательные пути:\n- " + "\n- ".join(missing))

    html_files = [ROOT / "index.html", *sorted((ROOT / "legal").glob("*.html"))]
    broken: list[str] = []
    for document in html_files:
        parser = LocalReferenceParser()
        parser.feed(document.read_text(encoding="utf-8"))
        for reference in parser.references:
            target = local_target(document, reference)
            if target is not None and not target.exists():
                broken.append(f"{document.relative_to(ROOT)} -> {reference}")

    if broken:
        raise SystemExit("Найдены неработающие локальные ссылки:\n- " + "\n- ".join(broken))

    print(f"OK: структура на месте; проверено HTML-файлов: {len(html_files)}")


if __name__ == "__main__":
    main()
