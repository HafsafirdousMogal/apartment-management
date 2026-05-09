package com.example.demo;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    // Post a notice
    public Notice postNotice(Notice notice) {
        notice.setPostedAt(LocalDate.now());
        return noticeRepository.save(notice);
    }

    // Get all notices
    public List<Notice> getAllNotices() {
        return noticeRepository.findAll();
    }

    // Get one notice
    public Notice getNoticeById(Long id) {
        return noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice not found"));
    }

    // Delete a notice
    public void deleteNotice(Long id) {
        noticeRepository.deleteById(id);
    }

}