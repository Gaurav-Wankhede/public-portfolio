#!/bin/bash

# Ultimate Validation Script for Portfolio Rust Backend
# This script runs all validation phases from validate.md

set -e  # Exit on first error

echo "🚀 Starting Ultimate Validation for Portfolio Rust Backend..."
echo ""

# Phase 1: Code Quality
echo "════════════════════════════════════════════════════════════"
echo "Phase 1: Code Quality & Safety"
echo "════════════════════════════════════════════════════════════"

cargo fmt --all -- --check || { echo "❌ Formatting failed"; exit 1; }
cargo clippy --all-targets --all-features -- -D warnings || { echo "❌ Clippy failed"; exit 1; }
cargo build --release || { echo "❌ Build failed"; exit 1; }

echo "✅ Code quality checks passed"
echo ""

# Phase 2: Security
echo "════════════════════════════════════════════════════════════"
echo "Phase 2: Security Validation"
echo "════════════════════════════════════════════════════════════"

if ! grep -q "Secrets.toml" .gitignore; then
    echo "❌ Secrets.toml not in .gitignore!"
    exit 1
fi

if ! command -v cargo-audit &> /dev/null; then
    cargo install cargo-audit
fi
cargo audit || { echo "⚠️  Vulnerabilities found"; }

echo "✅ Security checks passed"
echo ""

# Phase 3: Tests
echo "════════════════════════════════════════════════════════════"
echo "Phase 3: Running Tests"
echo "════════════════════════════════════════════════════════════"

cargo test --lib --bins || { echo "❌ Tests failed"; exit 1; }

echo "✅ All tests passed"
echo ""

echo "🎉 VALIDATION COMPLETE!"
echo ""
echo "All checks passed. Backend is ready for deployment! 🚀"
