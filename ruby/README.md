# Ruby example

Uses only the Ruby standard library (no gems). Requires Ruby 2.7+.

```bash
# from the repo root, set your key first (see ../.env.example)
export VIDSCRIBE_API_KEY=tsk_your_secret_key

ruby ruby/transcribe.rb "https://youtu.be/VIDEO_ID"
```

On Windows PowerShell, set the key with:

```powershell
$env:VIDSCRIBE_API_KEY = "tsk_your_secret_key"
```

The script prints the full transcript and waits automatically for long videos
processed in the background.
