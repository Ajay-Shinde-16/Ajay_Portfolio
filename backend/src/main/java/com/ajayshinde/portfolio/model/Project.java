package com.ajayshinde.portfolio.model;

import java.util.List;
import java.util.Map;

/**
 * Plain data object for a featured project. Populated from
 * resources/projects.json (the canonical source, shared with the frontend).
 * Field names match the React component and the JSON keys exactly.
 */
public class Project {
    private String name;
    private String blurb;
    private List<String> tech;
    private List<String> tags;
    private List<String> metrics;
    private Map<String, Object> architecture;
    private String live;
    private String code;
    private String image;
    private String shape;
    private boolean liveLabel;

    public Project() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBlurb() { return blurb; }
    public void setBlurb(String blurb) { this.blurb = blurb; }
    public List<String> getTech() { return tech; }
    public void setTech(List<String> tech) { this.tech = tech; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public List<String> getMetrics() { return metrics; }
    public void setMetrics(List<String> metrics) { this.metrics = metrics; }
    public Map<String, Object> getArchitecture() { return architecture; }
    public void setArchitecture(Map<String, Object> architecture) { this.architecture = architecture; }
    public String getLive() { return live; }
    public void setLive(String live) { this.live = live; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getShape() { return shape; }
    public void setShape(String shape) { this.shape = shape; }
    public boolean isLiveLabel() { return liveLabel; }
    public void setLiveLabel(boolean liveLabel) { this.liveLabel = liveLabel; }
}