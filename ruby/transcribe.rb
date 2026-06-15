# Transcribe a video with the VidScribe API.
#
# Usage:  ruby transcribe.rb "https://youtu.be/VIDEO_ID"

require "net/http"
require "json"
require "uri"

API_KEY = ENV["VIDSCRIBE_API_KEY"] || "tsk_your_secret_key"
BASE = ENV["VIDSCRIBE_BASE_URL"] || "https://getvidscribe.com/v1"

def request(method, url, body = nil)
  uri = URI(url)
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = uri.scheme == "https"
  req = method == :post ? Net::HTTP::Post.new(uri) : Net::HTTP::Get.new(uri)
  req["x-api-key"] = API_KEY
  if body
    req["content-type"] = "application/json"
    req.body = JSON.dump(body)
  end
  res = http.request(req)
  raise "HTTP #{res.code}: #{res.body}" if res.code.to_i >= 400
  JSON.parse(res.body)
end

def transcribe(url, lang: "en", mode: "auto")
  data = request(:post, "#{BASE}/transcript", { url: url, lang: lang, mode: mode })
  # Short videos return the transcript; long ones return a job to poll.
  return data["transcript"] if data["transcript"] && !data["transcript"].empty?
  poll(data["job_id"])
end

def poll(job_id)
  loop do
    data = request(:get, "#{BASE}/transcript/#{job_id}")
    return data["transcript"] if data["status"] == "completed"
    raise(data["error"] || "Transcription failed.") if data["status"] == "failed"
    puts "  job #{job_id}: #{data['status']} ..."
    sleep 3
  end
end

url = ARGV[0] || "https://youtu.be/VIDEO_ID"
begin
  puts transcribe(url)
rescue => e
  warn e.message
  exit 1
end
