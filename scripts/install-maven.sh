#!/usr/bin/env bash
# Pasang Apache Maven ke ~/tools tanpa Homebrew/apt (macOS dan Linux).
# Butuh JDK 17+ yang sudah terpasang. Set JAVA_HOME sebelum menjalankan jika bukan default.
set -euo pipefail

VERSION="${MAVEN_VERSION:-3.9.16}"
DEST="$HOME/tools"
TARBALL="apache-maven-${VERSION}-bin.tar.gz"
URL="https://dlcdn.apache.org/maven/maven-3/${VERSION}/binaries/${TARBALL}"

mkdir -p "$DEST"
cd "$DEST"

if [ ! -x "apache-maven-${VERSION}/bin/mvn" ]; then
  echo ">> Mengunduh Maven ${VERSION}..."
  curl -fSLO "$URL"
  curl -fSL "$URL.sha512" -o "${TARBALL}.sha512"

  echo ">> Verifikasi checksum..."
  echo "$(cat "${TARBALL}.sha512")  ${TARBALL}" | shasum -a 512 -c -

  tar xzf "$TARBALL"
  rm -f "$TARBALL" "${TARBALL}.sha512"
else
  echo ">> Maven ${VERSION} sudah ada, lewati unduhan."
fi

# Tambahkan PATH ke ~/.zshrc atau ~/.bashrc sekali saja
RC="$HOME/.bashrc"; [ -n "${ZSH_VERSION:-}" ] || [ "${SHELL##*/}" = "zsh" ] && RC="$HOME/.zshrc"
MARK="# >>> maven (install-maven.sh) >>>"
if ! grep -qF "$MARK" "$RC" 2>/dev/null; then
  cat >> "$RC" <<EOF

$MARK
export PATH="$DEST/apache-maven-${VERSION}/bin:\$PATH"
# <<< maven (install-maven.sh) <<<
EOF
  echo ">> PATH ditambahkan ke $RC"
fi

echo ">> Selesai. Buka terminal baru atau jalankan: source $RC"
"$DEST/apache-maven-${VERSION}/bin/mvn" -v
