"""
Backend package wrapper for FastAPI app and auth helpers.
This package re-exports objects from top-level modules to avoid breaking imports
while keeping the original file layout intact.
"""

from .main import app  # re-export FastAPI app

__all__ = ["app"]

