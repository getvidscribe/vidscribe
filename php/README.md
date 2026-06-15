# PHP example

Uses cURL, which ships with PHP. Reads your key from the environment.

```bash
# from the repo root, set your key first (see ../.env.example)
export VIDSCRIBE_API_KEY=tsk_your_secret_key

php php/transcribe.php "https://youtu.be/VIDEO_ID"
```

On Windows PowerShell, set the key with:

```powershell
$env:VIDSCRIBE_API_KEY = "tsk_your_secret_key"
```

Requires PHP 7.4 or newer with the cURL extension (enabled by default in most
installations). The script prints the full transcript and waits automatically
for long videos processed in the background.
