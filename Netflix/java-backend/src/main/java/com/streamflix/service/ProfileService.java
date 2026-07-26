package com.streamflix.service;

import com.streamflix.model.Profile;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class ProfileService {
    private final List<Profile> profiles = Arrays.asList(
        new Profile("p1", "Gaurav", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80", "#E50914", false),
        new Profile("p2", "Cinema Buff", "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80", "#0071EB", false),
        new Profile("p3", "Kids Zone", "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&q=80", "#E5A93C", true),
        new Profile("p4", "Sci-Fi Fanatic", "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80", "#2BDB66", false)
    );

    public List<Profile> getAllProfiles() {
        return profiles;
    }
}
