package com.streamflix.model;

import java.util.ArrayList;
import java.util.List;

public class WatchPartyRoom {
    private String id;
    private String hostName;
    private String movieId;
    private PlaybackState playbackState;
    private List<Participant> participants = new ArrayList<>();
    private List<Message> messages = new ArrayList<>();

    public static class PlaybackState {
        private boolean isPlaying;
        private double currentTime;

        public PlaybackState() {}
        public PlaybackState(boolean isPlaying, double currentTime) {
            this.isPlaying = isPlaying;
            this.currentTime = currentTime;
        }

        public boolean isPlaying() { return isPlaying; }
        public void setPlaying(boolean playing) { isPlaying = playing; }
        public double getCurrentTime() { return currentTime; }
        public void setCurrentTime(double currentTime) { this.currentTime = currentTime; }
    }

    public static class Participant {
        private String name;
        private boolean isHost;

        public Participant() {}
        public Participant(String name, boolean isHost) {
            this.name = name;
            this.isHost = isHost;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public boolean isHost() { return isHost; }
        public void setHost(boolean host) { isHost = host; }
    }

    public static class Message {
        private String sender;
        private String text;

        public Message() {}
        public Message(String sender, String text) {
            this.sender = sender;
            this.text = text;
        }

        public String getSender() { return sender; }
        public void setSender(String sender) { this.sender = sender; }
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
    }

    public WatchPartyRoom() {}

    public WatchPartyRoom(String id, String hostName, String movieId) {
        this.id = id;
        this.hostName = hostName;
        this.movieId = movieId;
        this.playbackState = new PlaybackState(true, 0);
        this.participants.add(new Participant(hostName, true));
        this.messages.add(new Message("System", "Room created by " + hostName + ". Invite code: " + id));
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getHostName() { return hostName; }
    public void setHostName(String hostName) { this.hostName = hostName; }

    public String getMovieId() { return movieId; }
    public void setMovieId(String movieId) { this.movieId = movieId; }

    public PlaybackState getPlaybackState() { return playbackState; }
    public void setPlaybackState(PlaybackState playbackState) { this.playbackState = playbackState; }

    public List<Participant> getParticipants() { return participants; }
    public void setParticipants(List<Participant> participants) { this.participants = participants; }

    public List<Message> getMessages() { return messages; }
    public void setMessages(List<Message> messages) { this.messages = messages; }
}
