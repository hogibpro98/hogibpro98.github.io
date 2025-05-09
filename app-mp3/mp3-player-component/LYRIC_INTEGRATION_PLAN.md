# Lyric Integration Plan

This document outlines the research findings on time-stamped lyric data and a proposed technical approach for synchronizing lyrics with audio playback in the `mp3-player.js` web component.

## Research Findings

### Lyric Data Formats with Timing:

*   **LRC Format (.lrc):** A widely used plain text format with timestamps in the format `[mm:ss.xx]` or `[mm:ss:xx]` preceding each lyric line. Simple and human-readable.
*   **SRT Format (.srt):** Primarily used for subtitles, could be adapted but less common for pure audio lyrics. Uses sequential numbers and time ranges.
*   **Enhanced Formats:** Some proprietary formats offer more granular timing (e.g., word-by-word) or richer metadata.

### Potential Sources for Time-Stamped Lyrics (Focus on Free/Open-Source):

*   **Online Databases/Communities:** Websites and forums where users share `.lrc` files. Availability and accuracy vary.
*   **Public Repositories:** Investigation needed to find non-commercial databases of LRC files.
*   **Desktop Applications/Tools:** Free/open-source tools exist for creating and editing LRC files, sometimes with syncing features.
*   **Web-Based Tools/Scripts:** Simple online tools or scripts can assist in LRC creation or validation.
*   **Manual Creation:** Feasible for a small number of songs using a text editor or dedicated LRC editor.

## Proposed Data Structure for `mp3-player.js`

A suitable JavaScript object structure to hold the parsed time-stamped lyric data within the web component would be an array of objects, where each object represents a lyric line and contains `timestamp` (in seconds) and `text` properties.

```javascript
[
  { timestamp: 0.5, text: "Lyric line 1" },
  { timestamp: 3.2, text: "Lyric line 2" },
  { timestamp: 6.8, text: "Lyric line 3" },
  // ... more lyric lines
]
```

This data could be loaded into the component by fetching a `.lrc` file alongside the MP3, embedding it in the HTML, or passing it as a property.

## Outline Synchronization Logic in `mp3-player.js`

1.  **Read Lyric Data:** The structured lyric data is loaded into the component.
2.  **Listen for `timeupdate`:** An event listener is attached to the audio element's `timeupdate` event.
3.  **Find Current Lyric:** When `timeupdate` fires, the audio's `currentTime` is compared with the timestamps in the lyric data array. The algorithm iterates through the array to find the lyric line whose timestamp is less than or equal to `currentTime` and whose subsequent line's timestamp (if it exists) is greater than `currentTime`.
4.  **Update Display:** The display is updated to highlight or show the identified current lyric line.

## Synchronization Logic Flowchart

```mermaid
graph TD
    A[Audio timeupdate event] --> B{Get current audio time};
    B --> C[Iterate through lyric data];
    C --> D{Compare current time with lyric timestamps};
    D -- Match found --> E[Highlight/Display current lyric line];
    D -- No match / End of lyrics --> F[Do nothing or clear display];
    E --> G[Wait for next timeupdate];
    F --> G[Wait for next timeupdate];