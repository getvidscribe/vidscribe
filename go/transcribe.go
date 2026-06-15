// Transcribe a video with the VidScribe API.
//
// Usage:  go run transcribe.go "https://youtu.be/VIDEO_ID"
package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

func envOr(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

var (
	apiKey = envOr("VIDSCRIBE_API_KEY", "tsk_your_secret_key")
	base   = envOr("VIDSCRIBE_BASE_URL", "https://getvidscribe.com/v1")
)

func do(method, url string, body io.Reader) (map[string]any, error) {
	req, _ := http.NewRequest(method, url, body)
	req.Header.Set("x-api-key", apiKey)
	if body != nil {
		req.Header.Set("content-type", "application/json")
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	data, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("HTTP %d: %s", resp.StatusCode, data)
	}
	var m map[string]any
	json.Unmarshal(data, &m)
	return m, nil
}

func transcribe(url string) (string, error) {
	payload, _ := json.Marshal(map[string]string{"url": url, "lang": "en", "mode": "auto"})
	m, err := do("POST", base+"/transcript", bytes.NewReader(payload))
	if err != nil {
		return "", err
	}
	// Short videos return the transcript; long ones return a job to poll.
	if t, ok := m["transcript"].(string); ok && t != "" {
		return t, nil
	}
	return poll(int(m["job_id"].(float64)))
}

func poll(jobID int) (string, error) {
	for {
		m, err := do("GET", fmt.Sprintf("%s/transcript/%d", base, jobID), nil)
		if err != nil {
			return "", err
		}
		switch m["status"] {
		case "completed":
			return m["transcript"].(string), nil
		case "failed":
			msg, _ := m["error"].(string)
			if msg == "" {
				msg = "transcription failed"
			}
			return "", errors.New(msg)
		}
		fmt.Printf("  job %d: %v ...\n", jobID, m["status"])
		time.Sleep(3 * time.Second)
	}
}

func main() {
	url := "https://youtu.be/VIDEO_ID"
	if len(os.Args) > 1 {
		url = os.Args[1]
	}
	text, err := transcribe(url)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	fmt.Println(text)
}
