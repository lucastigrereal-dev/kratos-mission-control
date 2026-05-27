"""Tests for safe memory ingestion: Akasha -> Qdrant.

FASE 13A — Minimal safe tests. No destructive operations.
"""

import hashlib
import json
import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

# Add scripts dir to path
SCRIPTS_DIR = Path(__file__).parent.parent.parent / "scripts"
sys.path.insert(0, str(SCRIPTS_DIR))

from ingest_memory_to_qdrant import (
    BATCH_SIZE,
    COLLECTION_NAME,
    VECTOR_DIM,
    check_akasha,
    check_ollama,
    check_qdrant,
    save_checkpoint,
)


class TestPreFlightChecks:
    """Pre-flight check functions — mock external services."""

    def test_check_qdrant_online(self):
        with patch("ingest_memory_to_qdrant.QdrantClient") as mock_client:
            instance = mock_client.return_value
            mock_col = MagicMock()
            mock_col.name = COLLECTION_NAME
            instance.get_collections.return_value = MagicMock(
                collections=[mock_col]
            )
            mock_info = MagicMock()
            mock_info.points_count = 0
            mock_info.config.params.vectors.size = VECTOR_DIM
            mock_info.status = "green"
            instance.get_collection.return_value = mock_info
            result = check_qdrant()
            assert result["ok"] is True
            assert result["points"] == 0
            assert result["dimensions"] == VECTOR_DIM

    def test_check_qdrant_collection_missing(self):
        with patch("ingest_memory_to_qdrant.QdrantClient") as mock_client:
            instance = mock_client.return_value
            mock_col = MagicMock()
            mock_col.name = "other_collection"
            instance.get_collections.return_value = MagicMock(
                collections=[mock_col]
            )
            result = check_qdrant()
            assert result["ok"] is False
            assert "not found" in result["error"]

    def test_check_ollama_available(self):
        with patch("ingest_memory_to_qdrant.requests.get") as mock_get:
            mock_get.return_value.json.return_value = {
                "models": [{"name": "nomic-embed-text:latest"}]
            }
            mock_get.return_value.raise_for_status = MagicMock()
            result = check_ollama()
            assert result["ok"] is True

    def test_check_ollama_missing_model(self):
        with patch("ingest_memory_to_qdrant.requests.get") as mock_get:
            mock_get.return_value.json.return_value = {
                "models": [{"name": "llama3.1:8b"}]
            }
            mock_get.return_value.raise_for_status = MagicMock()
            result = check_ollama()
            assert result["ok"] is False

    def test_check_ollama_offline(self):
        with patch("ingest_memory_to_qdrant.requests.get") as mock_get:
            mock_get.side_effect = Exception("Connection refused")
            result = check_ollama()
            assert result["ok"] is False
            assert "Connection refused" in result["error"]


class TestBatchSafety:
    """Batch processing safety rules."""

    def test_batch_size_within_limit(self):
        """Batch size should never exceed 100 for safety."""
        assert BATCH_SIZE <= 100
        assert BATCH_SIZE == 50  # Current safe value

    def test_vector_dimension_768(self):
        """Canonical dimension is 768 (nomic-embed-text)."""
        assert VECTOR_DIM == 768

    def test_collection_name_canonical(self):
        """Must use jarvis_memory_v2 as canonical collection."""
        assert COLLECTION_NAME == "jarvis_memory_v2"


class TestCheckpointSafety:
    """Checkpoint save/load safety."""

    def test_save_checkpoint_creates_file(self, tmp_path):
        with patch("ingest_memory_to_qdrant.CHECKPOINT_FILE", tmp_path / "checkpoint.json"):
            save_checkpoint("test", {"count": 10})
            assert (tmp_path / "checkpoint.json").exists()
            data = json.loads((tmp_path / "checkpoint.json").read_text())
            assert data["stage"] == "test"
            assert data["count"] == 10
            assert "timestamp" in data

    def test_checkpoint_overwrites(self, tmp_path):
        cp_file = tmp_path / "checkpoint.json"
        cp_file.write_text('{"old": true}')
        with patch("ingest_memory_to_qdrant.CHECKPOINT_FILE", cp_file):
            save_checkpoint("new_stage", {"count": 42})
        data = json.loads(cp_file.read_text())
        assert data["stage"] == "new_stage"
        assert data["count"] == 42


class TestHashValidation:
    """Chunk hash validation for staleness detection."""

    def test_hash_match_same_text(self):
        text = "Este é um chunk de teste"
        h1 = hashlib.md5(text.encode()).hexdigest()
        h2 = hashlib.md5(text.encode()).hexdigest()
        assert h1 == h2

    def test_hash_mismatch_different_text(self):
        h1 = hashlib.md5("texto original".encode()).hexdigest()
        h2 = hashlib.md5("texto modificado".encode()).hexdigest()
        assert h1 != h2


class TestRulesCompliance:
    """Verify compliance with FASE 13A rules."""

    def test_no_delete_collection_code(self):
        """Script should never call delete_collection."""
        script = (SCRIPTS_DIR / "ingest_memory_to_qdrant.py").read_text()
        assert "delete_collection" not in script
        assert "delete(" not in script  # collection-level delete

    def test_no_recreate_collection_code(self):
        """Script should never call recreate_collection or create_collection."""
        script = (SCRIPTS_DIR / "ingest_memory_to_qdrant.py").read_text()
        assert "create_collection" not in script
        assert "recreate_collection" not in script

    def test_batch_upsert_only(self):
        """Script should only use upsert, never upload_points or upload_collection."""
        script = (SCRIPTS_DIR / "ingest_memory_to_qdrant.py").read_text()
        assert "upsert" in script  # has upsert
        assert "upload_points" not in script  # no bulk upload
        assert "upload_collection" not in script  # no collection upload

    def test_max_chunks_not_unbounded(self):
        """Default behavior should limit chunks, not ingest everything."""
        script = (SCRIPTS_DIR / "ingest_memory_to_qdrant.py").read_text()
        assert "--max-chunks" in script  # has limit parameter
        assert "--dry-run" in script  # has dry-run option
