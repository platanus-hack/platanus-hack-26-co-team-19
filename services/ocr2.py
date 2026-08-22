from pathlib import Path

from liteparse import LiteParse

pdf_path = Path(__file__).with_name("hola.pdf")

parser = LiteParse(
    output_format="markdown",
    image_mode="placeholder",
    extract_links=True,
)
result = parser.parse(str(pdf_path))
print(result.text)
