<?php
// Transcribe a video with the VidScribe API.
//
// Usage:  php transcribe.php "https://youtu.be/VIDEO_ID"

$apiKey = getenv("VIDSCRIBE_API_KEY") ?: "tsk_your_secret_key";
$base   = getenv("VIDSCRIBE_BASE_URL") ?: "https://getvidscribe.com/v1";

function vidscribe_request($method, $url, $apiKey, $body = null) {
    $ch = curl_init($url);
    $headers = ["x-api-key: $apiKey"];
    if ($body !== null) {
        $headers[] = "content-type: application/json";
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [$code, json_decode($resp, true)];
}

function transcribe($url, $apiKey, $base, $lang = "en", $mode = "auto") {
    [$code, $data] = vidscribe_request("POST", "$base/transcript", $apiKey, [
        "url" => $url, "lang" => $lang, "mode" => $mode,
    ]);
    if ($code >= 400) {
        throw new Exception("HTTP $code: " . json_encode($data));
    }
    // Short videos return the transcript; long ones return a job to poll.
    if (!empty($data["transcript"])) {
        return $data["transcript"];
    }
    return poll($data["job_id"], $apiKey, $base);
}

function poll($jobId, $apiKey, $base) {
    while (true) {
        [$code, $data] = vidscribe_request("GET", "$base/transcript/$jobId", $apiKey);
        if ($data["status"] === "completed") {
            return $data["transcript"];
        }
        if ($data["status"] === "failed") {
            throw new Exception($data["error"] ?? "Transcription failed.");
        }
        echo "  job $jobId: {$data['status']} ...\n";
        sleep(3);
    }
}

$videoUrl = $argv[1] ?? "https://youtu.be/VIDEO_ID";
try {
    echo transcribe($videoUrl, $apiKey, $base) . "\n";
} catch (Exception $e) {
    fwrite(STDERR, $e->getMessage() . "\n");
    exit(1);
}
