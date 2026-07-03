import asyncio
import concurrent.futures
from typing import Any

# pyrefly: ignore [missing-import]
import cognee

DATASET_NAME = "interview_tutor"


def run_async(coro):
    return asyncio.run(coro)


def run_async_with_timeout(coro, timeout: float):
    """
    Run an async Cognee call with a hard timeout.
    If Cognee Cloud is slow or unreachable, this returns None instead of
    hanging the whole chat response — critical for a smooth demo.
    """
    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
        future = pool.submit(asyncio.run, coro)
        try:
            return future.result(timeout=timeout)
        except concurrent.futures.TimeoutError:
            print(f"⚠️ Cognee call timed out after {timeout}s — continuing without it")
            return None
        except Exception as e:
            print(f"⚠️ Cognee call failed: {e}")
            return None


def _format_recall_results(results: list[Any]) -> list[dict[str, Any]]:
    formatted = []
    for result in results or []:
        text = getattr(result, "text", None) or str(result)
        source = getattr(result, "source", "unknown")
        entry: dict[str, Any] = {"text": text, "source": source}
        for field in ("qa_id", "question", "answer", "dataset_name", "kind"):
            value = getattr(result, field, None)
            if value is not None:
                entry[field] = value
        formatted.append(entry)
    return formatted


def recall_memory(
    query: str,
    *,
    session_id: str | None = None,
    only_context: bool = False,
    top_k: int = 10,
    timeout: float = 6.0,
) -> list[dict[str, Any]]:
    async def _recall():
        return await cognee.recall(
            query_text=query,
            session_id=session_id,
            datasets=[DATASET_NAME] if session_id is None else None,
            only_context=only_context,
            top_k=top_k,
        )

    result = run_async_with_timeout(_recall(), timeout)
    return _format_recall_results(result)


def store_memory(
    content: str,
    *,
    session_id: str | None = None,
    permanent: bool = False,
) -> None:
    async def _remember():
        if permanent or session_id is None:
            await cognee.remember(content, dataset_name=DATASET_NAME)
        else:
            await cognee.remember(content, session_id=session_id)

    run_async_with_timeout(_remember(), timeout=15.0)


def forget_memory(*, dataset: str | None = None, everything: bool = False) -> None:
    async def _forget():
        if everything:
            await cognee.forget(everything=True)
        else:
            await cognee.forget(dataset=dataset or DATASET_NAME)

    run_async_with_timeout(_forget(), timeout=15.0)


def improve_memory(
    *,
    dataset: str | None = None,
    session_id: str | None = None,
    run_in_background: bool = True,
) -> None:
    async def _improve():
        await cognee.improve(
            dataset=dataset or DATASET_NAME,
            session_ids=[session_id] if session_id is not None else None,
            run_in_background=run_in_background,
        )

    run_async_with_timeout(_improve(), timeout=45.0)
