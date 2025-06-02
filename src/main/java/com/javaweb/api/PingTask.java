import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.net.InetAddress;

@Component
public class PingTask {

    @Scheduled(initialDelay = 13 * 60 * 1000, fixedDelay = Long.MAX_VALUE)
    public void pingAfter13Minutes() {
        System.out.println("==> Ping started after 13 minutes");
        try {
            String host = "quanhne.id.vn"; // Thay bằng server bạn muốn ping
            InetAddress inet = InetAddress.getByName(host);

            System.out.println("Sending Ping Request to " + host);
            if (inet.isReachable(5000)) { // timeout 5000ms
                System.out.println("Host is reachable");
            } else {
                System.out.println("Host is NOT reachable");
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
