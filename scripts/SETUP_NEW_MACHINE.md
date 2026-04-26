# Run transcription pipeline on a new machine

End-to-end setup: clone repo → install deps → run batch.

## 1. Install Python (3.10+)

| OS | Command |
|---|---|
| Windows | `winget install Python.Python.3.13` |
| macOS | `brew install python@3.13` |
| Linux | `sudo apt install python3 python3-pip` |

Verify: `python --version`

## 2. Install ffmpeg

Required by `yt-dlp` to convert HLS streams to mp3.

| OS | Command |
|---|---|
| Windows | `winget install Gyan.FFmpeg` |
| macOS | `brew install ffmpeg` |
| Linux | `sudo apt install ffmpeg` |

Restart the shell after install. Verify: `ffmpeg -version`

## 3. Clone the repo

```bash
git clone https://github.com/YossiAbutbul/Haparlamentor.git
cd Haparlamentor
```

## 4. Install Python dependencies

```bash
pip install -r scripts/requirements.txt
```

Installs `faster-whisper` and `yt-dlp`.

## 5. (Optional) GPU acceleration

If the machine has an NVIDIA GPU, transcription runs ~30-50x realtime instead of ~3-5x on CPU.

```bash
pip install ctranslate2 nvidia-cublas-cu12 nvidia-cudnn-cu12
```

The script auto-detects CUDA via `device="auto"` in `transcribe.py`. Nothing else to change.

Verify GPU is seen:
```bash
python -c "import ctranslate2; print(ctranslate2.get_supported_compute_types('cuda'))"
```

## 6. Provide m3u8 URLs

The file `data/s<N>/m3u8.json` is gitignored — not pushed to the repo. Populate it on each new machine.

Format:
```json
{
  "<vcmId1>": "<m3u8 manifest url>",
  "<vcmId2>": "<m3u8 manifest url>"
}
```

To collect URLs:
1. Open the short page on `mako.co.il`, hit play
2. F12 → Network tab → filter `m3u8`
3. Right-click the first `.m3u8` entry → Copy URL
4. Paste against the matching `vcmId` from `data/s<N>/shorts.json`

You can also copy `data/s<N>/m3u8.json` from another machine where it already exists.

## 7. Run the batch

```bash
python scripts/batch_run.py 1
```

For each entry in `m3u8.json`:
- Skip if `data/s1/transcripts/<vcmId>.txt` already exists
- Otherwise download audio to `scripts/audio/`, then transcribe → write `.txt`
- At the end: rebuild `public/data/db.json`

## 8. First run downloads the model

`large-v3` is ~3GB, cached at `~/.cache/huggingface/`. Subsequent runs reuse the cache.

## 9. Resume after interruption

Killing the script (Ctrl+C / shutdown) is safe. Already-finished shorts have a `.txt` file. Re-run `python scripts/batch_run.py 1` — it skips finished shorts and continues.

## 10. Sync transcripts back

After a batch finishes:

```bash
git add data/s1/transcripts/ public/data/db.json
git commit -m "data: transcribe N shorts in s1"
git push
```

Audio files (`scripts/audio/`) and `m3u8.json` are gitignored — they don't sync. Re-collect on each machine.

## Troubleshooting

### `ffmpeg` not found

`yt-dlp` falls back to saving the raw HLS segment without converting. The downloaded file ends up as `.ts` or extensionless. Faster-whisper still decodes `.ts` via PyAV — works, but install ffmpeg for cleaner pipeline.

### Slow transcription on CPU

Switch to a smaller model in `scripts/transcribe.py`:

```python
MODEL_NAME = "large-v3-turbo"   # ~6x faster, near-identical accuracy
# or
MODEL_NAME = "medium"           # ~3x faster, slight accuracy hit
```

### Hebrew text garbled in console

Already handled (`PYTHONIOENCODING=utf-8` set in scripts). If a different shell drops UTF-8: `chcp 65001` on Windows cmd.

### Stuck process / no output

Scripts use line-buffered stdout. If still seeing nothing in the output file mid-run, check the process is alive:

```bash
# Windows PowerShell
Get-Process python | Select-Object Id, CPU, StartTime
```

CPU climbing = still working. Whisper segments stream as they're decoded.

## Cloud option (Google Colab, free GPU)

If the local machine is slow, run on Colab:

1. New Colab notebook, runtime → GPU (T4 free tier)
2. Cells:
   ```python
   !git clone https://github.com/YossiAbutbul/Haparlamentor.git
   %cd Haparlamentor
   !pip install -r scripts/requirements.txt
   ```
3. Upload `m3u8.json` to `data/s1/m3u8.json` via the Files panel
4. ```python
   !python scripts/batch_run.py 1
   ```
5. Download `data/s1/transcripts/` as zip at the end. Commit locally.

Total runtime on Colab T4: ~30-60 minutes for all 37 shorts.
