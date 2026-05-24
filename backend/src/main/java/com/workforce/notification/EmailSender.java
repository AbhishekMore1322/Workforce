package com.workforce.notification;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
@Component
@RequiredArgsConstructor
public class EmailSender {
    private final JavaMailSender mailSender;
    public void send(String to, String message) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(mimeMessage, false, "UTF-8");
            helper.setFrom("storm.962003@gmail.com");
            helper.setTo(to);
            String subject = "WorkForce Notification";
            String body = message;
            if (message.contains("\n\n")) {
                subject = message.substring(0, message.indexOf("\n\n")).trim();
                body = message.substring(message.indexOf("\n\n") + 2);
            }
            helper.setSubject(subject);
            helper.setText(body, false);
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            throw new RuntimeException("Email sending failed", e);
        }
    }
}
