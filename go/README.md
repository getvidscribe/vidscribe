# Go example

Uses only the Go standard library (no dependencies). Requires Go 1.21+.

```bash
# from the repo root, set your key first (see ../.env.example)
export VIDSCRIBE_API_KEY=tsk_your_secret_key

cd go
go run transcribe.go "https://youtu.be/VIDEO_ID"
```

On Windows PowerShell, set the key with:

```powershell
$env:VIDSCRIBE_API_KEY = "tsk_your_secret_key"
```

The program prints the full transcript and waits automatically for long videos
processed in the background.
