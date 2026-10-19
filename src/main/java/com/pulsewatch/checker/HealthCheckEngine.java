package com.pulsewatch.checker;

import com.pulsewatch.entity.HealthCheck;
import org.springframework.stereotype.Component;

import javax.net.ssl.SNIHostName;
import javax.net.ssl.SSLParameters;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.Inet4Address;
import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.URI;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class HealthCheckEngine {

    private static final List<String> BLOCKED_HOSTNAMES = List.of(
        "metadata.google.internal", "169.254.169.254", "localhost"
    );

    public HealthCheck performCheck(Long monitorId, String url, int timeoutMs) {
        HealthCheck check = new HealthCheck();
        check.setMonitorId(monitorId);
        check.setResponseTimeMs(0L);
        check.setCreatedAt(LocalDateTime.now());
        check.setCheckedAt(LocalDateTime.now());

        if (url == null || url.isBlank()) {
            check.setResult("DOWN");
            check.setFailureReason("Invalid URL: empty");
            return check;
        }

        try {
            URI uri = URI.create(url);
            String scheme = uri.getScheme();
            if (scheme == null || (!scheme.equalsIgnoreCase("http") && !scheme.equalsIgnoreCase("https"))) {
                check.setResult("DOWN");
                check.setFailureReason("Unsupported protocol: " + scheme);
                check.setErrorDetails("Only http and https are allowed");
                return check;
            }

            String host = uri.getHost();
            if (host == null || host.isBlank()) {
                check.setResult("DOWN");
                check.setFailureReason("Invalid URL: missing host");
                return check;
            }

            if (BLOCKED_HOSTNAMES.stream().anyMatch(h -> h.equalsIgnoreCase(host))) {
                check.setResult("DOWN");
                check.setFailureReason("Blocked host: " + host);
                check.setErrorDetails("SSRF protection blocked this request");
                return check;
            }

            int port = uri.getPort();
            if (port == -1) {
                port = scheme.equalsIgnoreCase("https") ? 443 : 80;
            }

            InetAddress[] addresses;
            try {
                addresses = InetAddress.getAllByName(host);
            } catch (Exception e) {
                check.setResult("DOWN");
                check.setFailureReason("Unknown host");
                check.setErrorDetails(e.getMessage());
                return check;
            }

            for (InetAddress addr : addresses) {
                if (isBlockedAddress(addr)) {
                    check.setResult("DOWN");
                    check.setFailureReason("Blocked host: " + host);
                    check.setErrorDetails("SSRF protection blocked private/internal address");
                    return check;
                }
            }

            // Pin a single resolved address to prevent DNS rebinding.
            InetAddress pinned = addresses[0];

            String path = uri.getRawPath();
            if (path == null || path.isBlank()) path = "/";
            String query = uri.getRawQuery();
            String requestTarget = query == null ? path : path + "?" + query;

            long start = System.currentTimeMillis();
            int statusCode = sendRequest(scheme, host, port, pinned, requestTarget, timeoutMs);
            long responseTime = System.currentTimeMillis() - start;

            check.setStatusCode(statusCode);
            check.setResponseTimeMs(responseTime);
            String result = statusCode >= 200 && statusCode < 400 ? "UP" : "DOWN";
            check.setResult(result);
            check.setFailureReason(result.equals("DOWN") ? "HTTP " + statusCode : null);

        } catch (java.net.ConnectException e) {
            check.setResult("DOWN");
            check.setFailureReason("Connection refused");
            check.setErrorDetails(e.getMessage());
        } catch (java.net.SocketTimeoutException e) {
            check.setResult("DOWN");
            check.setFailureReason("Connection timeout");
            check.setErrorDetails("Timeout after " + timeoutMs + "ms");
        } catch (java.net.UnknownHostException e) {
            check.setResult("DOWN");
            check.setFailureReason("Unknown host");
            check.setErrorDetails(e.getMessage());
        } catch (Exception e) {
            check.setResult("DOWN");
            check.setFailureReason("Request failed");
            check.setErrorDetails(e.getMessage());
        }

        return check;
    }

    private int sendRequest(String scheme, String host, int port, InetAddress pinned, String requestTarget, int timeoutMs) throws Exception {
        boolean https = scheme.equalsIgnoreCase("https");
        java.net.Socket socket;
        if (https) {
            SSLSocketFactory factory = (SSLSocketFactory) SSLSocketFactory.getDefault();
            SSLSocket sslSocket = (SSLSocket) factory.createSocket();
            sslSocket.connect(new java.net.InetSocketAddress(pinned, port), timeoutMs);
            sslSocket.setSoTimeout(timeoutMs);
            SSLParameters params = sslSocket.getSSLParameters();
            params.setServerNames(List.of(new SNIHostName(host)));
            params.setEndpointIdentificationAlgorithm("HTTPS");
            sslSocket.setSSLParameters(params);
            sslSocket.startHandshake();
            socket = sslSocket;
        } else {
            socket = new java.net.Socket();
            socket.connect(new java.net.InetSocketAddress(pinned, port), timeoutMs);
            socket.setSoTimeout(timeoutMs);
        }

        try (socket) {
            var out = socket.getOutputStream();
            String authority = port == (https ? 443 : 80) ? host : host + ":" + port;
            String request = "GET " + requestTarget + " HTTP/1.1\r\n" +
                "Host: " + authority + "\r\n" +
                "Connection: close\r\n" +
                "User-Agent: PulseWatch/1.0\r\n" +
                "Accept: */*\r\n\r\n";
            out.write(request.getBytes(java.nio.charset.StandardCharsets.US_ASCII));
            out.flush();

            BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream(), java.nio.charset.StandardCharsets.ISO_8859_1));
            String statusLine = reader.readLine();
            if (statusLine == null || !statusLine.startsWith("HTTP/")) {
                throw new java.io.IOException("Invalid HTTP response");
            }
            String[] parts = statusLine.split(" ", 3);
            return Integer.parseInt(parts[1]);
        }
    }

    private boolean isBlockedAddress(InetAddress addr) {
        if (addr.isLoopbackAddress() || addr.isLinkLocalAddress() || addr.isSiteLocalAddress()
            || addr.isMulticastAddress() || addr.isAnyLocalAddress()) {
            return true;
        }

        if (addr instanceof Inet4Address) {
            byte[] b = addr.getAddress();
            int o1 = b[0] & 0xFF;
            int o2 = b[1] & 0xFF;
            int o3 = b[2] & 0xFF;
            int o4 = b[3] & 0xFF;
            // 0.0.0.0/8 unspecified
            if (o1 == 0) return true;
            // 10.0.0.0/8
            if (o1 == 10) return true;
            // 127.0.0.0/8 loopback
            if (o1 == 127) return true;
            // 169.254.0.0/16 link-local + metadata
            if (o1 == 169 && o2 == 254) return true;
            // 172.16.0.0/12
            if (o1 == 172 && o2 >= 16 && o2 <= 31) return true;
            // 192.168.0.0/16
            if (o1 == 192 && o2 == 168) return true;
            // 100.64.0.0/10 CGNAT
            if (o1 == 100 && o2 >= 64 && o2 <= 127) return true;
            // 192.0.0.0/24, 192.0.2.0/24, 198.18.0.0/15, 198.51.100.0/24, 203.0.113.0/24
            if (o1 == 192 && o2 == 0) return true;
            if (o1 == 198 && (o2 == 18 || o2 == 19)) return true;
            if (o1 == 198 && o2 == 51 && o3 == 100) return true;
            if (o1 == 203 && o2 == 0 && o3 == 113) return true;
            // 224.0.0.0/4 multicast
            if (o1 >= 224 && o1 <= 239) return true;
            // 240.0.0.0/4 reserved
            if (o1 >= 240) return true;
            // broadcast
            if (o1 == 255 && o2 == 255 && o3 == 255 && o4 == 255) return true;
        } else if (addr instanceof Inet6Address) {
            byte[] b = addr.getAddress();
            // ::1 loopback
            // :: unspecified
            boolean allZero = true;
            for (byte x : b) if (x != 0) { allZero = false; break; }
            if (allZero) return true;
            // fc00::/7 ULA
            if ((b[0] & 0xFE) == 0xFC) return true;
            // fe80::/10 link-local
            if ((b[0] & 0xFF) == 0xFE && (b[1] & 0xC0) == 0x80) return true;
            // ff00::/8 multicast
            if ((b[0] & 0xFF) == 0xFF) return true;
            // IPv4-mapped ::ffff:a.b.c.d
            if (b[0] == 0 && b[1] == 0 && b[2] == 0 && b[3] == 0 && b[4] == 0 && b[5] == 0
                && b[6] == 0 && b[7] == 0 && b[8] == 0 && b[9] == 0 && b[10] == (byte)0xFF && b[11] == (byte)0xFF) {
                // reconstruct IPv4
                try {
                    InetAddress v4 = InetAddress.getByAddress(new byte[]{b[12], b[13], b[14], b[15]});
                    return isBlockedAddress(v4);
                } catch (Exception ignored) { return true; }
            }
        }
        return false;
    }
}
