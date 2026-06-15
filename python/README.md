# Python example

A complete transcribe + poll flow using `requests`.

```bash
# from the repo root, set your key first (see ../.env.example)
export VIDSCRIBE_API_KEY=tsk_your_secret_key

pip install -r python/requirements.txt
python python/transcribe.py "https://youtu.be/VIDEO_ID"
```

On Windows PowerShell, set the key with:

```powershell
$env:VIDSCRIBE_API_KEY = "tsk_your_secret_key"
```

The script prints the full transcript to stdout. It automatically waits for
long videos that are processed in the background.
