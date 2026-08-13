"""Small utilities for bounded, polite Python script shutdown."""

from __future__ import annotations

import signal
import sys
import threading
import time
from dataclasses import dataclass
from typing import Any


@dataclass
class RuntimeGuard:
    start_time: float
    max_seconds: int | None
    stop_event: threading.Event
    label: str


def install_runtime_guard(label: str, max_seconds: int | None = None) -> RuntimeGuard:
    """Install soft stop handlers so repeated Ctrl+C or external SIGTERM exits quickly."""
    stop_event = threading.Event()

    def _request_stop(signum: int | Any, frame: Any) -> None:
        stop_event.set()

    for signame in ("SIGINT", "SIGTERM"):
        sig = getattr(signal, signame, None)
        if sig is not None:
            try:
                signal.signal(sig, _request_stop)
            except (ValueError, OSError):
                # In restricted execution contexts, ignore signal registration failures.
                pass

    return RuntimeGuard(time.perf_counter(), max_seconds, stop_event, label)


def check_runtime(guard: RuntimeGuard) -> bool:
    """Return True when the process should stop.

    The caller can break loops and return a clean status code before any hard kill
    is needed.
    """
    if guard.stop_event.is_set():
        print(f"{guard.label} stopped by external signal; exiting safely.", file=sys.stderr)
        return True
    if guard.max_seconds is not None and guard.max_seconds > 0:
        elapsed = time.perf_counter() - guard.start_time
        if elapsed >= guard.max_seconds:
            print(
                f"{guard.label} exceeded runtime limit ({guard.max_seconds}s); exiting safely.",
                file=sys.stderr,
            )
            return True
    return False


def maybe_add_runtime_argument(parser: Any, default_seconds: int | None = None) -> None:
    parser.add_argument(
        "--max-runtime-seconds",
        type=int,
        default=default_seconds,
        help="Abort safely if runtime exceeds this many seconds.",
    )
